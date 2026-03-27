/**
 * Dad Gains — client-side cart (localStorage)
 * Key: dadgains_cart — array of { sku, name, price, qty, image }
 */
(function () {
  const STORAGE_KEY = 'dadgains_cart';
  const FREE_SHIPPING_MIN = 50;
  const EST_SHIPPING_FLAT = 5.99;

  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      let cart = Array.isArray(parsed) ? parsed : [];
      let migrated = false;
      cart = cart.map((line) => {
        if (!line) return line;
        const o = { ...line };
        if (o.sku === 'vanilla-1lb') {
          migrated = true;
          o.sku = 'lemonade-1lb';
          o.name = 'Lemonade';
        }
        if (o.image === 'images/hero-product.png' || o.image === 'images/dadgains-pouch-hero.svg') {
          migrated = true;
          o.image = 'images/dadgains-pack-lemonade.png';
        }
        return o;
      });
      if (migrated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('dadgains-cart-updated'));
      }
      return cart;
    } catch {
      return [];
    }
  }

  function setCart(lines) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    window.dispatchEvent(new CustomEvent('dadgains-cart-updated'));
  }

  function addItem(item) {
    const { sku, name, price, image } = item;
    const cart = getCart();
    const i = cart.findIndex((l) => l.sku === sku);
    if (i >= 0) {
      cart[i].qty += item.qty || 1;
    } else {
      cart.push({
        sku,
        name,
        price: Number(price),
        qty: item.qty || 1,
        image: image || 'images/dadgains-pack-lemonade.png',
      });
    }
    setCart(cart);
    return cart;
  }

  function updateQty(sku, qty) {
    let cart = getCart();
    const q = Math.max(0, parseInt(qty, 10) || 0);
    if (q === 0) {
      cart = cart.filter((l) => l.sku !== sku);
    } else {
      const line = cart.find((l) => l.sku === sku);
      if (line) line.qty = q;
    }
    setCart(cart);
    return cart;
  }

  function removeLine(sku) {
    const cart = getCart().filter((l) => l.sku !== sku);
    setCart(cart);
    return cart;
  }

  function clearCart() {
    setCart([]);
  }

  function getTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, l) => sum + l.price * l.qty, 0);
    const qualifiesFreeShip = subtotal >= FREE_SHIPPING_MIN;
    const shipping = qualifiesFreeShip ? 0 : EST_SHIPPING_FLAT;
    const total = subtotal + shipping;
    return {
      subtotal,
      shipping,
      total,
      qualifiesFreeShip,
      freeShippingMin: FREE_SHIPPING_MIN,
      estShippingFlat: EST_SHIPPING_FLAT,
      lineCount: cart.reduce((n, l) => n + l.qty, 0),
    };
  }

  function formatMoney(n) {
    return '$' + (Math.round(n * 100) / 100).toFixed(2);
  }

  function refreshNavBag() {
    const el = document.getElementById('nav-bag-count');
    if (!el) return;
    const n = getTotals().lineCount;
    el.textContent = n > 0 ? String(n) : '';
    el.classList.toggle('nav-bag-count--empty', n === 0);
  }

  document.addEventListener('DOMContentLoaded', refreshNavBag);
  window.addEventListener('dadgains-cart-updated', refreshNavBag);

  window.DadGainsCart = {
    getCart,
    setCart,
    addItem,
    updateQty,
    removeLine,
    clearCart,
    getTotals,
    formatMoney,
    FREE_SHIPPING_MIN,
    EST_SHIPPING_FLAT,
    refreshNavBag,
  };
})();
