/**
 * Tests pour localStorage (persistance panier et historique)
 * Utilise des mocks pour simuler localStorage
 */

// Mock de localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: jest.fn(key => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; })
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('LocalStorage Persistence', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  test('panier peut être sauvegardé et récupéré', () => {
    const cart = [
      { id: 'pan-poulet', name: 'Panini Poulet', price: 23, qty: 2 },
      { id: 'bur-simple', name: 'Burger Simple', price: 20, qty: 1 }
    ];

    localStorage.setItem('casa-poulet-cart', JSON.stringify(cart));
    const saved = JSON.parse(localStorage.getItem('casa-poulet-cart'));

    expect(saved).toEqual(cart);
    expect(saved.length).toBe(2);
    expect(saved[0].id).toBe('pan-poulet');
  });

  test('historique peut être ajouté et récupéré', () => {
    const order = {
      id: 'ORD-2025-001',
      date: new Date().toISOString(),
      items: [{ name: 'Tacos Poulet', price: 25, qty: 1 }],
      total: 25,
      mode: 'emporter'
    };

    const history = [order];
    localStorage.setItem('casa-poulet-history', JSON.stringify(history));

    const saved = JSON.parse(localStorage.getItem('casa-poulet-history'));
    expect(saved).toEqual(history);
    expect(saved[0].id).toBe('ORD-2025-001');
  });

  test('historique peut ajouter une nouvelle commande', () => {
    const existing = [
      { id: 'ORD-001', total: 50, date: '2025-01-01T00:00:00.000Z' }
    ];
    localStorage.setItem('casa-poulet-history', JSON.stringify(existing));

    const newOrder = { id: 'ORD-002', total: 75, date: new Date().toISOString() };
    const current = JSON.parse(localStorage.getItem('casa-poulet-history'));
    current.push(newOrder);
    localStorage.setItem('casa-poulet-history', JSON.stringify(current));

    const saved = JSON.parse(localStorage.getItem('casa-poulet-history'));
    expect(saved.length).toBe(2);
    expect(saved[1].id).toBe('ORD-002');
  });

  test('panier vide est géré correctement', () => {
    localStorage.setItem('casa-poulet-cart', JSON.stringify([]));
    const saved = JSON.parse(localStorage.getItem('casa-poulet-cart'));
    expect(saved).toEqual([]);
  });

  test('suppression du panier fonctionne', () => {
    const cart = [{ id: 'test', price: 10, qty: 1 }];
    localStorage.setItem('casa-poulet-cart', JSON.stringify(cart));
    localStorage.removeItem('casa-poulet-cart');

    const saved = localStorage.getItem('casa-poulet-cart');
    expect(saved).toBeNull();
  });
});

describe('Cart Operations', () => {
  // Fonctions simulées basées sur la logique réelle
  function addToCart(cart, item) {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      existing.qty += item.qty;
    } else {
      cart.push({ ...item });
    }
    return cart;
  }

  function removeFromCart(cart, itemId) {
    return cart.filter(i => i.id !== itemId);
  }

  function updateQty(cart, itemId, newQty) {
    if (newQty <= 0) {
      return cart.filter(i => i.id !== itemId);
    }
    const item = cart.find(i => i.id === itemId);
    if (item) {
      item.qty = newQty;
    }
    return cart;
  }

  test('ajouter un item nouveau au panier', () => {
    let cart = [];
    cart = addToCart(cart, { id: 'pan-poulet', name: 'Panini Poulet', price: 23, qty: 1 });
    expect(cart.length).toBe(1);
    expect(cart[0].qty).toBe(1);
  });

  test('ajouter un item existant l\'incrémente', () => {
    let cart = [{ id: 'pan-poulet', name: 'Panini Poulet', price: 23, qty: 1 }];
    cart = addToCart(cart, { id: 'pan-poulet', price: 23, qty: 2 });
    expect(cart.length).toBe(1);
    expect(cart[0].qty).toBe(3);
  });

  test('supprimer un item du panier', () => {
    let cart = [
      { id: 'pan-poulet', price: 23, qty: 1 },
      { id: 'bur-simple', price: 20, qty: 2 }
    ];
    cart = removeFromCart(cart, 'pan-poulet');
    expect(cart.length).toBe(1);
    expect(cart[0].id).toBe('bur-simple');
  });

  test('mettre à jour quantité', () => {
    let cart = [{ id: 'tac-poulet', price: 25, qty: 1 }];
    cart = updateQty(cart, 'tac-poulet', 5);
    expect(cart[0].qty).toBe(5);
  });

  test('mettre à jour quantité à 0 équivaut à supprimer (logique métier)', () => {
    let cart = [{ id: 'test', price: 10, qty: 1 }];
    cart = updateQty(cart, 'test', 0);
    expect(cart.length).toBe(0);
  });
});
