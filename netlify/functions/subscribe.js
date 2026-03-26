/**
 * Netlify serverless function: add email to Mailchimp audience
 * Requires env vars: MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID
 * Optional body: tags: string[] — applied after subscribe (e.g. ["checkout-soldout"])
 */
const crypto = require('crypto');

function subscriberHash(email) {
  return crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');
}

async function applyTags(dc, apiKey, listId, email, tags) {
  if (!tags || !Array.isArray(tags) || tags.length === 0) return;
  const hash = subscriberHash(email);
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${hash}/tags`;
  const body = {
    tags: tags.map((name) => ({ name: String(name), status: 'active' })),
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Mailchimp tags error:', res.status, err);
  }
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;

  if (!apiKey || !listId) {
    console.error('Missing MAILCHIMP_API_KEY or MAILCHIMP_LIST_ID');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server configuration error' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const email = body.email_address?.trim();
  const tagList = body.tags;

  if (!email) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Email is required' }),
    };
  }

  const dc = apiKey.split('-').pop();
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`;

  const mergeFields = {};
  if (body.merge_fields && typeof body.merge_fields === 'object') {
    Object.assign(mergeFields, body.merge_fields);
  }

  const memberPayload = {
    email_address: email,
    status: 'subscribed',
  };
  if (Object.keys(mergeFields).length > 0) {
    memberPayload.merge_fields = mergeFields;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(memberPayload),
  });

  const data = await response.json().catch(() => ({}));

  if (response.ok) {
    await applyTags(dc, apiKey, listId, email, tagList);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: true }),
    };
  }

  if (response.status === 400 && data.title === 'Member Exists') {
    await applyTags(dc, apiKey, listId, email, tagList);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: true }),
    };
  }

  console.error('Mailchimp error:', response.status, data);
  return {
    statusCode: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ error: data.detail || 'Subscription failed' }),
  };
};
