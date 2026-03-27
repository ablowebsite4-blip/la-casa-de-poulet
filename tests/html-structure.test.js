/**
 * Tests pour la structure HTML de base
 * Ne modifie pas le site,Only lit et valide
 */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

describe('HTML Structure', () => {
  test('doit avoir DOCTYPE html', () => {
    expect(html).toMatch(/<!DOCTYPE html>/i);
  });

  test('doit avoir lang="fr"', () => {
    expect(html).toMatch(/<html[^>]*lang="fr"/);
  });

  test('doit inclure manifest.json', () => {
    expect(html).toMatch(/<link[^>]*rel="manifest"[^>]*href="\/manifest\.json"/);
  });

  test('doit inclure le service worker', () => {
    expect(html).toMatch(/navigator\.serviceWorker\.register/);
    expect(html).toMatch(/\/sw\.js/);
  });

  test('doit avoir un header avec hero-bg', () => {
    expect(html).toMatch(/class="hero-bg"/);
  });

  test('doit avoir une barre de navigation', () => {
    expect(html).toMatch(/<nav[^>]*id="nav"/);
  });

  test('doit avoir un contenu principal', () => {
    expect(html).toMatch(/<main[^>]*class="main"/);
  });

  test('doit avoir un bottom-bar (panier)', () => {
    expect(html).toMatch(/<div[^>]*id="bottomBar"/);
  });

  test('doit avoir un modal pour le formulaire de commande', () => {
    expect(html).toMatch(/<div[^>]*id="modal"/);
  });

  test('doit avoir un modal admin hidden', () => {
    expect(html).toMatch(/<div[^>]*id="adminModal"/);
  });

  test('doit avoir un input de recherche', () => {
    expect(html).toMatch(/<input[^>]*id="searchInput"/);
  });

  test('bouton Commander doit exister', () => {
    expect(html).toMatch(/<button[^>]*id="orderBtn"/);
  });

  test('bouton d\'admin doit exister (même si caché)', () => {
    // Il doit y avoir une référence à l'admin somewhere dans le JS ou HTML
    // On vérifie que le modal admin est présent dans le HTML
    expect(html).toMatch(/id="adminSaveBtn"/);
    expect(html).toMatch(/<textarea[^>]*id="menuEditor"/);
  });

  test('doit avoir le toggle de langue', () => {
    expect(html).toMatch(/id="langToggle"/);
  });

  test('doit avoir le bouton historique', () => {
    expect(html).toMatch(/id="historyBtn"/);
  });

  test('balise meta viewport correcte', () => {
    expect(html).toMatch(/viewport.*width=device-width/);
  });

  test('meta theme-color doit être #050505', () => {
    expect(html).toMatch(/<meta[^>]*name="theme-color"[^>]*content="#050505"/);
  });
});

describe('Form Fields', () => {
  test('champ nom (required)', () => {
    expect(html).toMatch(/<input[^>]*id="name"[^>]*required/);
  });

  test('champ téléphone (optionnel)', () => {
    expect(html).toMatch(/<input[^>]*id="phone"/);
  });

  test('boutons de mode (surplace, emporter, livraison)', () => {
    expect(html).toMatch(/data-mode="surplace"/);
    expect(html).toMatch(/data-mode="emporter"/);
    expect(html).toMatch(/data-mode="livraison"/);
  });

  test('sélection de table (1-10)', () => {
    for (let i = 1; i <= 10; i++) {
      expect(html).toMatch(new RegExp(`data-table="${i}"`));
    }
  });

  test('bouton GPS', () => {
    expect(html).toMatch(/id="gpsBtn"/);
  });

  test('champ adresse', () => {
    expect(html).toMatch(/<textarea[^>]*id="address"/);
  });

  test('champ instructions spéciales', () => {
    expect(html).toMatch(/<textarea[^>]*id="specialInstructions"/);
  });

  test('bouton soumission WhatsApp existe', () => {
    expect(html).toMatch(/<button[^>]*id="submitBtn"/);
    expect(html).toMatch(/Envoyer via WhatsApp/);
  });
});

describe('Accessibility Basics', () => {
  test('doit avoir un titre (h1)', () => {
    expect(html).toMatch(/<h1[^>]*>LA CASA DE POULET<\/h1>/);
  });

  test('rôles ARIA sur modal', () => {
    expect(html).toMatch(/role="dialog"/);
    expect(html).toMatch(/aria-modal="true"/);
  });

  test('aria-label sur panier', () => {
    expect(html).toMatch(/aria-label="Panier de commande"/);
  });

  test('aria-live sur panier count et total', () => {
    expect(html).toMatch(/id="cartCount"[^>]*aria-live="polite"/);
    expect(html).toMatch(/id="totalPrice"[^>]*aria-live="polite"/);
  });
});
