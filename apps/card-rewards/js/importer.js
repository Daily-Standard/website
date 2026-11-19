// Statement import: reads a transactions CSV downloaded from Chase or Amex,
// finds statement credits, and suggests which tracked benefit each belongs to.
// Pure functions only (no DOM) so they can be unit-tested.
//
// Column layouts are based on the usual Chase and Amex CSV downloads, as
// remembered when this was written (not checked against a live download):
//   Chase:  Transaction Date, Post Date, Description, Category, Type, Amount, Memo
//           purchases negative, credits/returns positive, Type "Payment" for payments
//   Amex:   Date, Description, Amount (plus optional extra columns)
//           charges positive, credits negative
// If a file doesn't match, the importer falls back to any Date/Description/Amount
// (or Debit/Credit) columns it can find.

import { periodFor, creditAmount, usageKey } from './engine.js';

/** Minimal RFC 4180 CSV parser: quoted fields, escaped quotes, CRLF. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  const src = String(text).replace(/^﻿/, '');
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field); field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((f) => f.trim() !== '')) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  row.push(field);
  if (row.some((f) => f.trim() !== '')) rows.push(row);
  return rows;
}

function findCol(headers, names) {
  const lower = headers.map((h) => h.trim().toLowerCase());
  for (const n of names) {
    const i = lower.indexOf(n);
    if (i !== -1) return i;
  }
  return -1;
}

/** Parse "11/05/2026", "2026-11-05" or "11/05/26" into a local Date. */
export function parseDate(s) {
  const t = String(s || '').trim();
  let m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (m) {
    const y = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
    return new Date(y, Number(m[1]) - 1, Number(m[2]));
  }
  return null;
}

function parseAmount(s) {
  const t = String(s ?? '').trim();
  if (!t) return null;
  const negative = /^\(.*\)$/.test(t) || t.startsWith('-');
  const n = Number(t.replace(/[()$,\s+-]/g, ''));
  if (!Number.isFinite(n)) return null;
  return negative ? -n : n;
}

/**
 * Turn a CSV into normalized transactions:
 * { id, date, description, amount, isCredit, isPayment }
 * where `amount` is always positive and `isCredit` marks money coming back.
 */
export function readStatement(text) {
  const rows = parseCsv(text);
  if (rows.length < 2) return { format: 'unknown', transactions: [], error: 'The file has no transactions.' };
  const headers = rows[0];
  const iDate = findCol(headers, ['transaction date', 'date', 'trans. date', 'posted date', 'post date']);
  const iDesc = findCol(headers, ['description', 'merchant', 'payee']);
  const iAmount = findCol(headers, ['amount']);
  const iDebit = findCol(headers, ['debit']);
  const iCredit = findCol(headers, ['credit']);
  const iType = findCol(headers, ['type']);
  if (iDate === -1 || iDesc === -1 || (iAmount === -1 && iDebit === -1 && iCredit === -1)) {
    return { format: 'unknown', transactions: [], error: 'Could not find Date, Description and Amount columns.' };
  }
  const lowerHeaders = headers.map((h) => h.trim().toLowerCase());
  let format = 'generic';
  if (lowerHeaders.includes('post date') && iType !== -1) format = 'chase';
  else if (lowerHeaders[0] === 'date' && iType === -1 && iAmount !== -1) format = 'amex';

  const transactions = [];
  for (const r of rows.slice(1)) {
    const date = parseDate(r[iDate]);
    const description = String(r[iDesc] || '').trim();
    if (!date || !description) continue;
    let signed;
    if (iAmount !== -1) {
      signed = parseAmount(r[iAmount]);
      if (signed == null) continue;
      // Normalize so positive = money back to you.
      if (format === 'amex') signed = -signed;
    } else {
      const debit = parseAmount(r[iDebit]) || 0;
      const credit = parseAmount(r[iCredit]) || 0;
      signed = Math.abs(credit) - Math.abs(debit);
    }
    const type = iType !== -1 ? String(r[iType] || '').trim().toLowerCase() : '';
    const isPayment = type === 'payment' || /\b(AUTOPAY|PAYMENT\s*-?\s*THANK YOU|ONLINE PAYMENT|MOBILE PAYMENT)\b/i.test(description);
    const amount = Math.round(Math.abs(signed) * 100) / 100;
    transactions.push({
      id: `${date.toISOString().slice(0, 10)}|${description}|${signed.toFixed(2)}`,
      date,
      description,
      amount,
      isCredit: signed > 0,
      isPayment,
    });
  }
  return { format, transactions, error: transactions.length ? null : 'No transactions found in the file.' };
}

/** Description with numbers and extra spaces removed, for remembering matches. */
export function descriptionPattern(description) {
  return String(description).toUpperCase().replace(/[0-9#*]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Suggest which credit a statement credit line belongs to.
 * Remembered rules win; otherwise the credit's `match` keywords are tried.
 */
export function suggestCredit(description, cardId, credits, rules = []) {
  const pattern = descriptionPattern(description);
  const rule = rules.find((r) => r.cardId === cardId && r.pattern === pattern);
  if (rule && credits.some((c) => c.id === rule.creditId)) return rule.creditId;
  // Whole-word keyword match; the longest matching keyword wins
  // (so "CREDIT" doesn't match the keyword "EDIT").
  const upper = String(description).toUpperCase();
  let best = null;
  for (const c of credits) {
    for (const k of c.match || []) {
      const escaped = k.toUpperCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (new RegExp(`(^|[^A-Z0-9])${escaped}([^A-Z0-9]|$)`).test(upper) && (!best || k.length > best.len)) {
        best = { id: c.id, len: k.length };
      }
    }
  }
  return best ? best.id : null;
}

/**
 * Apply confirmed matches to usage. `lines` = [{ id, date, amount, description, creditId }].
 * Returns a new { usage, imported, importRules } (does not mutate the inputs).
 */
export function applyMatches(state, entry, credits, lines) {
  const usage = { ...(state.usage || {}) };
  const imported = { ...(state.imported || {}) };
  const rules = [...(state.importRules || [])];
  for (const line of lines) {
    if (imported[`${entry.cardId}|${line.id}`]) continue;
    imported[`${entry.cardId}|${line.id}`] = true;
    if (!line.creditId) continue;
    const credit = credits.find((c) => c.id === line.creditId);
    if (!credit) continue;
    const period = periodFor(credit.cadence, line.date, entry.anniversaryMonth);
    const key = usageKey(entry.cardId, credit.id, period.key);
    const max = creditAmount(credit, period);
    usage[key] = Math.min(max, Math.round(((usage[key] || 0) + line.amount) * 100) / 100);
    const pattern = descriptionPattern(line.description);
    const existing = rules.findIndex((r) => r.cardId === entry.cardId && r.pattern === pattern);
    const rule = { cardId: entry.cardId, pattern, creditId: credit.id };
    if (existing === -1) rules.push(rule); else rules[existing] = rule;
  }
  return { usage, imported, importRules: rules };
}

/** Distinct merchants you've paid, most frequent first (for matching card offers later). */
export function merchantsFromStatement(transactions) {
  const counts = new Map();
  for (const t of transactions) {
    if (t.isCredit || t.isPayment) continue;
    const name = descriptionPattern(t.description).split(' ').slice(0, 3).join(' ');
    if (!name) continue;
    counts.set(name, (counts.get(name) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
}
