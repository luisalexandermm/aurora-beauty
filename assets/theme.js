document.documentElement.classList.remove('no-js');

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------- Header scroll state ---------------- */
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ---------------- Hero: fondo reactivo al cursor ---------------- */
  var heroBg = document.getElementById('heroBg');
  var hero = document.querySelector('.hero');
  if (hero && heroBg) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      heroBg.style.setProperty('--blob-angle', (x * 360) + 'deg');
      heroBg.style.setProperty('--blob-x', (x * 100) + '%');
      heroBg.style.setProperty('--blob-y', (y * 100) + '%');
    });
  }

  /* ---------------- Cursor personalizado ---------------- */
  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  if (dot && ring && matchMedia('(hover:hover)').matches) {
    window.addEventListener('mousemove', function (e) {
      dot.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px) translate(-50%,-50%)';
      ring.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px) translate(-50%,-50%)';
    });
    document.body.addEventListener('mouseover', function (e) {
      if (e.target.closest('a,button,input')) { ring.style.width = '50px'; ring.style.height = '50px'; ring.style.opacity = '0.5'; }
    });
    document.body.addEventListener('mouseout', function (e) {
      if (e.target.closest('a,button,input')) { ring.style.width = '34px'; ring.style.height = '34px'; ring.style.opacity = '1'; }
    });
  }

  /* ---------------- Botones magnéticos ---------------- */
  document.addEventListener('mousemove', function (e) {
    var btn = e.target.closest && e.target.closest('.magnetic');
    if (!btn) return;
    var r = btn.getBoundingClientRect();
    var x = e.clientX - r.left - r.width / 2;
    var y = e.clientY - r.top - r.height / 2;
    btn.style.transform = 'translate(' + (x * 0.25) + 'px,' + (y * 0.35) + 'px)';
  });
  document.addEventListener('mouseout', function (e) {
    var btn = e.target.closest && e.target.closest('.magnetic');
    if (btn) btn.style.transform = 'translate(0,0)';
  });

  /* ---------------- Tilt 3D en capas con brillo dinámico (producto) ----------------
     CSS 3D real (perspective + preserve-3d + translateZ por capa) — delegado, así que
     funciona en cualquier tarjeta de producto en cualquier parte del sitio. */
  document.addEventListener('mousemove', function (e) {
    var media = e.target.closest('.prod-media');
    if (!media) return;
    var tilt = media.querySelector('.prod-tilt');
    if (!tilt) return;
    var glare = media.querySelector('.glare');
    var r = media.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width;
    var py = (e.clientY - r.top) / r.height;
    var rotateY = (px - 0.5) * 26;
    var rotateX = (0.5 - py) * 26;
    tilt.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.07,1.07,1.07)';
    if (glare) { glare.style.setProperty('--gx', (px * 100) + '%'); glare.style.setProperty('--gy', (py * 100) + '%'); }
  });
  document.addEventListener('mouseleave', function (e) {
    var media = e.target.closest && e.target.closest('.prod-media');
    if (media) {
      var tilt = media.querySelector('.prod-tilt');
      if (tilt) tilt.style.transform = '';
    }
  }, true);

  /* ---------------- Scroll reveal (incluye contenido cargado luego) ---------------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) en.target.classList.add('in'); });
  }, { threshold: 0.12 });
  function observeReveals(root) {
    (root || document).querySelectorAll('.reveal:not(.in)').forEach(function (el) { io.observe(el); });
  }
  observeReveals();

  /* ---------------- Mobile drawer ---------------- */
  var menuToggle = document.getElementById('MenuToggle');
  var mobileDrawer = document.getElementById('MobileDrawer');
  function openDrawer() {
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', function () {
      mobileDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
    });
    document.querySelectorAll('[data-drawer-close]').forEach(function (el) { el.addEventListener('click', closeDrawer); });
  }

  /* ---------------- Utilidades ---------------- */
  function formatCOP(cents) {
    var n = Math.round(cents / 100);
    return '$' + n.toLocaleString('es-CO').replace(/,/g, '.');
  }
  function starString(r) { r = Math.round(r || 0); return '★★★★★'.slice(0, r) + '☆☆☆☆☆'.slice(0, 5 - r); }

  var toastTimer;
  function showToast(msg) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  /* ---------------- Reseñas simuladas por categoría (mismo criterio que el prototipo) ---------------- */
  var categoryReviews = {
    'Skincare': [
      { name: 'Manuela Ríos', city: 'Bogotá', comment: 'Mi piel se siente distinta desde la segunda semana. Textura liviana, no deja sensación pegajosa.' },
      { name: 'Valentina Ospina', city: 'Medellín', comment: 'Por fin un producto que no me irrita. Lo uso mañana y noche y ya se nota la diferencia.' },
      { name: 'Camila Herrera', city: 'Cali', comment: 'Se absorbe rápido y no deja la piel grasosa. Ideal para el clima de acá.' },
      { name: 'Isabella Duarte', city: 'Barranquilla', comment: 'Llegó bien empacado y el olor es delicioso. Ya es parte fija de mi rutina.' },
    ],
    'Maquillaje': [
      { name: 'Daniela Perea', city: 'Quibdó', comment: 'El color es tal cual la foto y dura todo el día sin resecar. Muy recomendado.' },
      { name: 'Laura Gómez', city: 'Bucaramanga', comment: 'Fácil de aplicar y difuminar. Se ve natural, no cargado.' },
      { name: 'Sara Martínez', city: 'Pereira', comment: 'Excelente pigmentación, con poquito rinde muchísimo.' },
      { name: 'Juliana Cárdenas', city: 'Cartagena', comment: 'Me encantó el acabado, ni muy mate ni muy brillante. Justo lo que buscaba.' },
    ],
    'Cabello': [
      { name: 'Estefanía Mosquera', city: 'Quibdó', comment: 'Mi cabello se siente más fuerte y con menos frizz desde la primera aplicación.' },
      { name: 'Paula Castañeda', city: 'Medellín', comment: 'Huele delicioso y deja el cabello suave sin apelmazar.' },
      { name: 'Natalia Suárez', city: 'Cali', comment: 'Ya llevo tres frascos. Es lo único que le ha funcionado a mi cabello rizado.' },
      { name: 'Mariana Zapata', city: 'Bogotá', comment: 'Se nota menos caída después de un mes de uso constante.' },
    ],
    'Belleza Facial': [
      { name: 'Alejandra Vélez', city: 'Bogotá', comment: 'Lo uso en las noches como parte de mi ritual. Se siente como un mini spa en casa.' },
      { name: 'Catalina Rojas', city: 'Medellín', comment: 'Ayuda muchísimo con la hinchazón de la cara en las mañanas.' },
    ],
    'Perfumería': [
      { name: 'Andrea López', city: 'Barranquilla', comment: 'La fragancia dura todo el día y no es invasiva. Me han preguntado varias veces cuál uso.' },
      { name: 'Melissa Torres', city: 'Cartagena', comment: 'Empaque hermoso y el aroma es justo como lo esperaba.' },
      { name: 'Carolina Restrepo', city: 'Bogotá', comment: 'Notas suaves, ni muy dulce ni muy fuerte. Para uso diario queda perfecto.' },
    ],
    'Accesorios': [
      { name: 'Yuliana Palacios', city: 'Quibdó', comment: 'Buena calidad, se nota que no es desechable. Cumple muy bien su función.' },
      { name: 'Diana Marín', city: 'Cali', comment: 'Práctico y bien terminado. Llegó justo como se veía en las fotos.' },
    ],
  };
  function pickReview(productType, productId) {
    var pool = categoryReviews[productType];
    if (!pool || !pool.length) return null;
    return pool[productId % pool.length];
  }

  /* ---------------- Carrito: Shopify AJAX Cart API real ---------------- */
  var cartDrawer = document.getElementById('CartDrawer');
  function openCart() { cartDrawer.classList.add('open'); }
  function closeCart() { cartDrawer.classList.remove('open'); }
  document.getElementById('CartToggle').addEventListener('click', openCart);
  document.querySelectorAll('[data-cart-close]').forEach(function (el) { el.addEventListener('click', closeCart); });

  function fetchCart() { return fetch('/cart.js').then(function (r) { return r.json(); }); }

  function renderCart(cart) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = cart.item_count; });
    var body = document.getElementById('CartBody');
    if (cart.item_count === 0) {
      body.innerHTML = '<div class="cart-empty">Tu carrito está vacío.</div>';
    } else {
      body.innerHTML = cart.items.map(function (item) {
        var img = item.image ? item.image.replace(/(\.[a-zA-Z]{3,4})(\?|$)/, '_140x$1$2') : '';
        return (
          '<div class="cart-item" data-key="' + item.key + '">' +
            (img ? '<div class="sw" style="background-image:url(\'' + img + '\')"></div>' : '<div class="sw"></div>') +
            '<div style="flex:1;">' +
              '<div class="n">' + item.product_title + '</div>' +
              (item.variant_title && item.variant_title !== 'Default Title' ? '<div class="m">' + item.variant_title + '</div>' : '') +
              '<div class="row">' +
                '<div class="qty"><button type="button" data-qty-minus>–</button><input readonly value="' + item.quantity + '"><button type="button" data-qty-plus>+</button></div>' +
                '<span class="cart-price">' + formatCOP(item.final_line_price) + '</span>' +
              '</div>' +
            '</div>' +
            '<button class="cart-remove" data-cart-remove aria-label="Eliminar">✕</button>' +
          '</div>'
        );
      }).join('');
    }
    var subtotalEl = document.getElementById('CartSubtotal');
    if (subtotalEl) subtotalEl.textContent = formatCOP(cart.total_price);
  }

  function addToCart(variantId, qty) {
    return fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: qty || 1 })
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (err) { throw err; });
      return fetchCart();
    }).then(function (cart) {
      renderCart(cart);
      return cart;
    });
  }

  function changeCartItem(key, qty) {
    return fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: key, quantity: qty })
    }).then(function (r) { return r.json(); }).then(function (cart) { renderCart(cart); return cart; });
  }

  document.body.addEventListener('click', function (e) {
    var addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      var variantId = addBtn.dataset.variantId;
      if (!variantId) return;
      addBtn.disabled = true;
      addToCart(variantId, 1).then(function () {
        showToast('Agregado al carrito');
        openCart();
      }).catch(function () {
        showToast('No se pudo agregar. Intenta de nuevo.');
      }).finally(function () { addBtn.disabled = false; });
    }

    var qtyMinus = e.target.closest('[data-qty-minus]');
    var qtyPlus = e.target.closest('[data-qty-plus]');
    if (qtyMinus || qtyPlus) {
      var row = (qtyMinus || qtyPlus).closest('[data-key]');
      var key = row.getAttribute('data-key');
      var input = row.querySelector('input');
      var val = parseInt(input.value, 10) || 1;
      val = qtyPlus ? val + 1 : Math.max(0, val - 1);
      changeCartItem(key, val);
    }

    var removeBtn = e.target.closest('[data-cart-remove]');
    if (removeBtn) {
      var rowR = removeBtn.closest('[data-key]');
      changeCartItem(rowR.getAttribute('data-key'), 0);
    }
  });

  fetchCart().then(renderCart);
  window.AuroraCart = { add: addToCart, open: openCart, close: closeCart, fetch: fetchCart, render: renderCart };

  /* ---------------- Vista rápida: datos reales por fetch + reseña ---------------- */
  var qvOverlay = document.getElementById('qvOverlay');
  var qvModal = document.getElementById('qvModal');

  function openQV(handle) {
    fetch('/products/' + handle + '.js').then(function (r) { return r.json(); }).then(function (p) {
      var variant = p.variants[0];
      var img = p.featured_image ? p.featured_image.replace(/(\.[a-zA-Z]{3,4})(\?|$)/, '_600x$1$2') : '';
      var ratingMeta = p.tags.find(function (t) { return t.indexOf('rating:') === 0; });
      var rating = ratingMeta ? parseFloat(ratingMeta.split(':')[1]) : null;
      var reviewCountMeta = p.tags.find(function (t) { return t.indexOf('reviews:') === 0; });
      var reviewCount = reviewCountMeta ? reviewCountMeta.split(':')[1] : null;

      var optionsHTML = '';
      if (p.variants.length > 1) {
        p.options.forEach(function (optName, idx) {
          var values = [];
          p.variants.forEach(function (v) {
            var val = [v.option1, v.option2, v.option3][idx];
            if (val && values.indexOf(val) === -1) values.push(val);
          });
          if (values.length > 1) {
            optionsHTML += '<div class="qv-options"><label>' + optName + '</label><div class="qv-option-pills">' +
              values.map(function (v, i) { return '<button type="button" class="option-pill' + (i === 0 ? ' active' : '') + '" data-opt-idx="' + idx + '" data-opt-val="' + v + '">' + v + '</button>'; }).join('') +
              '</div></div>';
          }
        });
      }

      var review = pickReview(p.type, p.id);

      qvModal.innerHTML =
        '<div class="qv-media' + (p.available ? '' : ' is-sold-out') + '">' +
          (img ? '<img class="prod-img" src="' + img + '" alt="' + p.title.replace(/"/g, '&quot;') + '">' : '') +
        '</div>' +
        '<div class="qv-info">' +
          '<button class="qv-close" id="qvClose">✕</button>' +
          '<h3>' + p.title + '</h3>' +
          '<div class="m">' + (p.vendor || '') + (p.available ? '' : ' · Agotado') + '</div>' +
          '<div class="price" id="qvPrice">' + formatCOP(variant.price) + (variant.compare_at_price > variant.price ? '<span class="compare" style="margin-left:8px;">' + formatCOP(variant.compare_at_price) + '</span>' : '') + '</div>' +
          (rating ? '<div class="prod-rating">' + starString(rating) + (reviewCount ? ' <span>(' + reviewCount + ')</span>' : '') + '</div>' : '') +
          (p.description ? '<div class="qv-desc">' + p.description.replace(/<[^>]+>/g, '').slice(0, 220) + '</div>' : '') +
          optionsHTML +
          '<div class="qv-actions">' +
            (p.available
              ? '<button class="btn btn-primary" data-add data-variant-id="' + variant.id + '" id="qvAddBtn">Agregar al carrito →</button>'
              : '<button class="btn btn-outline" disabled>Agotado</button>') +
          '</div>' +
          (review ?
            '<div class="qv-review">' +
              '<div class="qv-review-label">Opinión de quien lo compró</div>' +
              '<div class="qv-review-top">' +
                '<span class="qv-review-avatar">' + review.name.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase() + '</span>' +
                '<div><div class="qv-review-name">' + review.name + '</div><div class="qv-review-city">' + review.city + '</div></div>' +
              '</div>' +
              '<div class="qv-review-stars">' + starString(rating || 4.7) + '</div>' +
              '<p class="qv-review-comment">"' + review.comment + '"</p>' +
            '</div>' : '') +
        '</div>';
      qvOverlay.classList.add('open');
      document.getElementById('qvClose').addEventListener('click', function () { qvOverlay.classList.remove('open'); });

      var selected = {};
      qvModal.querySelectorAll('.option-pill').forEach(function (pill) {
        pill.addEventListener('click', function () {
          var idx = pill.dataset.optIdx;
          qvModal.querySelectorAll('.option-pill[data-opt-idx="' + idx + '"]').forEach(function (b) { b.classList.remove('active'); });
          pill.classList.add('active');
          selected[idx] = pill.dataset.optVal;
          var match = p.variants.find(function (v) {
            var opts = [v.option1, v.option2, v.option3];
            return Object.keys(selected).every(function (i) { return opts[i] === selected[i]; });
          });
          if (match) {
            document.getElementById('qvPrice').innerHTML = formatCOP(match.price) + (match.compare_at_price > match.price ? '<span class="compare" style="margin-left:8px;">' + formatCOP(match.compare_at_price) + '</span>' : '');
            var addBtn = document.getElementById('qvAddBtn');
            if (addBtn) addBtn.setAttribute('data-variant-id', match.id);
          }
        });
      });
    });
  }
  document.body.addEventListener('click', function (e) {
    var media = e.target.closest('[data-qv]');
    if (media) openQV(media.dataset.qv);
  });
  if (qvOverlay) {
    qvOverlay.addEventListener('click', function (e) { if (e.target === qvOverlay) qvOverlay.classList.remove('open'); });
  }

  /* ---------------- Búsqueda predictiva real ---------------- */
  var searchPanel = document.getElementById('SearchPanel');
  var searchList = document.getElementById('SearchList');
  var searchInput = document.getElementById('SearchInput');
  var searchTimer;

  function renderSearchResults(items) {
    if (!items.length) {
      searchList.innerHTML = '<p style="font-family:Inter,sans-serif;font-size:13px;color:var(--ink-soft);">Sin resultados.</p>';
      return;
    }
    searchList.innerHTML = items.map(function (p) {
      var img = p.image ? p.image.replace(/(\.[a-zA-Z]{3,4})(\?|$)/, '_140x$1$2') : '';
      return '<a class="search-item" href="' + p.url + '">' +
        (img ? '<div class="sw" style="background-image:url(\'' + img + '\'); background-size:cover;"></div>' : '<div class="sw"></div>') +
        '<div><div class="n">' + p.title + '</div><div class="d">' + (p.price || '') + '</div></div>' +
      '</a>';
    }).join('');
  }

  function runSearch(term) {
    if (!term.trim()) { searchList.innerHTML = ''; return; }
    fetch('/search/suggest.json?q=' + encodeURIComponent(term) + '&resources[type]=product&resources[limit]=6&resources[options][unavailable_products]=last')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var products = (data.resources && data.resources.results && data.resources.results.products) || [];
        renderSearchResults(products);
      });
  }

  if (searchInput) {
    document.getElementById('SearchToggle').addEventListener('click', function () {
      searchPanel.classList.add('open');
      searchInput.focus();
    });
    document.getElementById('SearchClose').addEventListener('click', function () { searchPanel.classList.remove('open'); });
    searchInput.addEventListener('input', function (e) {
      clearTimeout(searchTimer);
      var term = e.target.value;
      searchTimer = setTimeout(function () { runSearch(term); }, 250);
    });
  }

  /* ---------------- "Ver más" en secciones de producto (revela el resto de la grilla) ---------------- */
  document.querySelectorAll('[data-load-more]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var group = btn.dataset.loadMore;
      document.querySelectorAll('[data-extra-product][data-group="' + group + '"]').forEach(function (el) {
        el.classList.remove('is-hidden');
      });
      observeReveals();
      btn.remove();
    });
  });
});
