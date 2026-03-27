/**
 * Tests automatisés pour LA CASA DE POULET
 * Ne modifient pas le site existant -纯粹的测试逻辑
 */

const fs = require('fs');
const path = require('path');

// Charger le menu depuis JSON
const menuData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../menu.json'), 'utf8')
);

// ============================================
// FONCTIONS PURES À TESTER (logique métier)
// ============================================

/**
 * Calcule le total d'un panier
 * @param {Array} cart - Array de {price, qty}
 * @returns {number}
 */
function calculateTotal(cart) {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

/**
 * Extrait le texte d'un élément HTML
 * @param {string} html
 * @param {string} selector
 * @returns {string}
 */
function getTextContent(html, selector) {
  // Simple regex-based extraction (pour tests)
  const regex = new RegExp(`<${selector}[^>]*>([\\s\\S]*?)<\\/${selector}>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : '';
}

/**
 * Vérifie si une catégorie est valide
 * @param {Object} category
 * @returns {boolean}
 */
function isValidCategory(category) {
  return (
    category &&
    typeof category.label === 'string' &&
    typeof category.emoji === 'string' &&
    Array.isArray(category.items)
  );
}

/**
 * Vérifie si un item est valide
 * @param {Object} item
 * @returns {boolean}
 */
function isValidItem(item) {
  if (!item || typeof item.id !== 'string' || typeof item.name !== 'string') {
    return false;
  }

  // Vérifier qu'au moins un champ prix est défini et > 0
  const priceFields = ['price', 'priceP', 'priceM', 'priceSimple', 'priceSalade'];
  const hasValidPrice = priceFields.some(field => {
    const val = item[field];
    return typeof val === 'number' && val > 0;
  });

  return hasValidPrice;
}

/**
 * Retourne tous les prix d'un item (pour validation)
 * @param {Object} item
 * @returns {Array<number>}
 */
function getItemPrices(item) {
  const priceFields = ['price', 'priceP', 'priceM', 'priceSimple', 'priceSalade'];
  return priceFields
    .map(field => item[field])
    .filter(val => typeof val === 'number' && val > 0);
}

/**
 * Formate un nombre en prix marocain
 * @param {number} price
 * @returns {string}
 */
function formatPrice(price) {
  return `${price} dh`;
}

// ============================================
// TESTS
// ============================================

describe('Menu Data', () => {
  test('menu.json doit être un objet valide', () => {
    expect(typeof menuData).toBe('object');
    expect(Object.keys(menuData).length).toBeGreaterThan(0);
  });

  test(' doit avoir au moins 10 catégories', () => {
    const categories = Object.keys(menuData);
    expect(categories.length).toBeGreaterThanOrEqual(10);
  });

  test('chaque catégorie doit avoir label, emoji et items', () => {
    Object.values(menuData).forEach(category => {
      expect(isValidCategory(category)).toBe(true);
    });
  });

  test('chaque item doit avoir id, name, price valide', () => {
    Object.values(menuData).forEach(category => {
      category.items.forEach(item => {
        expect(isValidItem(item)).toBe(true);
      });
    });
  });

  test('les prix doivent être entre 6 et 200 dh', () => {
    Object.values(menuData).forEach(category => {
      category.items.forEach(item => {
        const prices = getItemPrices(item);
        prices.forEach(price => {
          expect(price).toBeGreaterThanOrEqual(6);
          expect(price).toBeLessThanOrEqual(200);
        });
      });
    });
  });

  test('pas d\'IDs en double dans tout le menu', () => {
    const allIds = [];
    Object.values(menuData).forEach(category => {
      category.items.forEach(item => {
        allIds.push(item.id);
      });
    });
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  test('catégorie PANINI doit exister avec au moins 8 items', () => {
    expect(menuData.panini).toBeDefined();
    expect(menuData.panini.items.length).toBeGreaterThanOrEqual(8);
  });

  test('catégorie BURGER doit exister', () => {
    expect(menuData.burger).toBeDefined();
    expect(menuData.burger.label).toBe('LES BURGER');
  });

  test('catégorie PIZZA doit avoir priceP et priceM pour chaque pizza', () => {
    menuData.pizza.items.forEach(item => {
      expect(item.priceP).toBeDefined();
      expect(item.priceM).toBeDefined();
      expect(item.priceM).toBeGreaterThan(item.priceP);
    });
  });
});

describe('Cart Calculations', () => {
  test('panier vide = total 0', () => {
    expect(calculateTotal([])).toBe(0);
  });

  test('un article à 25 dh × 2 = 50 dh', () => {
    const cart = [{ price: 25, qty: 2 }];
    expect(calculateTotal(cart)).toBe(50);
  });

  test('plusieurs articles différents', () => {
    const cart = [
      { price: 20, qty: 1 },
      { price: 30, qty: 2 },
      { price: 15, qty: 3 }
    ];
    // 20 + 60 + 45 = 125
    expect(calculateTotal(cart)).toBe(125);
  });

  test('quantité 0 ne change pas le total', () => {
    const cart = [{ price: 25, qty: 0 }];
    expect(calculateTotal(cart)).toBe(0);
  });

  test('total avec fromage burger (25) + pizza M (40) = 65', () => {
    const cart = [
      { price: 25, qty: 1 },  // cheese burger
      { price: 40, qty: 1 }   // pizza taille M
    ];
    expect(calculateTotal(cart)).toBe(65);
  });
});

describe('Price Formatting', () => {
  test('formatPrice(25) => "25 dh"', () => {
    expect(formatPrice(25)).toBe('25 dh');
  });

  test('formatPrice(0) => "0 dh"', () => {
    expect(formatPrice(0)).toBe('0 dh');
  });

  test('formatPrice(120) => "120 dh"', () => {
    expect(formatPrice(120)).toBe('120 dh');
  });
});

describe('Data Integrity', () => {
  test('tous les items ont un ID unique', () => {
    const ids = new Set();
    Object.entries(menuData).forEach(([categoryKey, category]) => {
      category.items.forEach(item => {
        const fullId = `${categoryKey}-${item.id}`;
        expect(ids.has(fullId)).toBe(false);
        ids.add(fullId);
      });
    });
  });

  test('les badges optionnels doivent être des strings si présents', () => {
    Object.values(menuData).forEach(category => {
      category.items.forEach(item => {
        if (item.badge) {
          expect(typeof item.badge).toBe('string');
        }
        if (item.badgeColor) {
          expect(['orange', 'red', 'yellow', 'green']).toContain(item.badgeColor);
        }
      });
    });
  });

  test('les catégories avec isPizza=true doivent avoir priceP et priceM', () => {
    Object.values(menuData).forEach(category => {
      category.items.forEach(item => {
        if (item.isPizza) {
          expect(item.priceP).toBeDefined();
          expect(item.priceM).toBeDefined();
          expect(typeof item.priceP).toBe('number');
          expect(typeof item.priceM).toBe('number');
        }
      });
    });
  });

  test('les catégories avec isPlat=true doivent avoir priceSimple et priceSalade', () => {
    Object.values(menuData).forEach(category => {
      category.items.forEach(item => {
        if (item.isPlat) {
          expect(item.priceSimple).toBeDefined();
          expect(item.priceSalade).toBeDefined();
        }
      });
    });
  });
});

describe('Special Items', () => {
  test('Tacos Bowl doit avoir badge ⭐ Spécial', () => {
    const tacoBowl = menuData.tacos.items.find(i => i.id === 'tac-bowl');
    expect(tacoBowl).toBeDefined();
    expect(tacoBowl.badge).toBe('⭐ Spécial');
    expect(tacoBowl.fullWidth).toBe(true);
  });

  test('Crispy items doivent avoir badge ⚡ Crispy', () => {
    const crispyItems = menuData.crispy.items;
    expect(crispyItems.length).toBeGreaterThan(0);
    crispyItems.forEach(item => {
      expect(item.badge).toBe('⚡ Crispy');
      expect(item.badgeColor).toBe('orange');
    });
  });

  test('articles du vendredi (Couscous) doivent avoir badge vert', () => {
    const couscous = [
      menuData.poulet.items.find(i => i.id === 'csc-poulet'),
      menuData.poulet.items.find(i => i.id === 'csc-viande')
    ];
    couscous.forEach(item => {
      expect(item.badge).toBe('Vendredi');
      expect(item.badgeColor).toBe('green');
    });
  });
});

describe('Bilingual Support', () => {
  test('chaque catégorie doit avoir labelAr (arabe)', () => {
    Object.values(menuData).forEach(category => {
      expect(category.labelAr).toBeDefined();
      expect(typeof category.labelAr).toBe('string');
      expect(category.labelAr.length).toBeGreaterThan(0);
    });
  });

  test('chaque item doit avoir un name en français', () => {
    Object.values(menuData).forEach(category => {
      category.items.forEach(item => {
        expect(typeof item.name).toBe('string');
        expect(item.name.length).toBeGreaterThan(0);
      });
    });
  });
});

console.log('✅ Tests chargés. Exécutez "npm test" pour lancer la suite.');
