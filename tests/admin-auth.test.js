/**
 * Tests pour l'authentification administrateur
 */

const fs = require('fs');
const path = require('path');

// Charger le script (il contient les fonctions admin)
// Note: On teste les fonctions de manière isolée via sessionStorage mock

describe('Admin Authentication', () => {
    const ADMIN_SESSION_KEY = 'lacasadepoulet_admin_session';
    const SESSION_DURATION_MS = 60 * 60 * 1000;

    // Mock sessionStorage car Jest (Node) ne l'a pas par défaut
    const mockSessionStorage = {
        store: {},
        getItem: function(key) {
            return this.store[key] || null;
        },
        setItem: function(key, value) {
            this.store[key] = String(value);
        },
        removeItem: function(key) {
            delete this.store[key];
        },
        clear: function() {
            this.store = {};
        }
    };

    beforeAll(() => {
        global.sessionStorage = mockSessionStorage;
    });

    beforeEach(() => {
        sessionStorage.clear();
    });

    test('doit générer un hash SHA-256 valide pour le mot de passe par défaut', () => {
        const crypto = require('crypto');
        const password = 'CasaDePouletAdmin2025!';
        const hash = crypto.createHash('sha256').update(password).digest('hex');
        expect(hash).toBe('6ca3634577a51d27fd0c5134492fbb30c8f823c5d6a3605630245a442ef31075');
    });

    test('doit correctement définir et lire une session admin', () => {
        const sessionData = {
            authenticated: true,
            expires: Date.now() + SESSION_DURATION_MS
        };
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));

        const retrieved = JSON.parse(sessionStorage.getItem(ADMIN_SESSION_KEY));
        expect(retrieved.authenticated).toBe(true);
        expect(retrieved.expires).toBeGreaterThan(Date.now());
    });

    test('doit détecter une session invalide (expirée)', () => {
        const sessionData = {
            authenticated: true,
            expires: Date.now() - 1000 // expired
        };
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));

        const retrieved = JSON.parse(sessionStorage.getItem(ADMIN_SESSION_KEY));
        expect(retrieved.expires < Date.now()).toBe(true);
    });

    test('doit retourner null si pas de session', () => {
        expect(sessionStorage.getItem(ADMIN_SESSION_KEY)).toBeNull();
    });

    test('doit gérer une session JSON corrompue', () => {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'invalid json{');
        const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
        expect(() => JSON.parse(session)).toThrow();
    });
});

describe('Admin HTML Elements', () => {
    const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

    test('doit avoir le bouton admin caché par défaut', () => {
        expect(html).toMatch(/<button[^>]*id="adminBtn"[^>]*style="[^"]*display:\s*none/);
    });

    test('doit avoir le modal de login admin', () => {
        expect(html).toMatch(/<div[^>]*id="loginModal"/);
        expect(html).toMatch(/<input[^>]*id="adminPassword"/);
        expect(html).toMatch(/<form[^>]*id="loginForm"/);
        expect(html).toMatch(/<button[^>]*id="loginSubmitBtn"/);
        expect(html).toMatch(/<div[^>]*id="loginError"/);
    });

    test('doit avoir le bouton logout dans modal admin', () => {
        expect(html).toMatch(/<button[^>]*id="adminLogoutBtn"/);
    });

    test('le modal admin doit rester présent', () => {
        expect(html).toMatch(/<div[^>]*id="adminModal"/);
        expect(html).toMatch(/<textarea[^>]*id="menuEditor"/);
        expect(html).toMatch(/<button[^>]*id="adminSaveBtn"/);
        expect(html).toMatch(/<button[^>]*id="adminResetBtn"/);
    });
});

describe('Admin Security in Script', () => {
    const scriptContent = fs.readFileSync(path.join(__dirname, '../script.96986dcf.js'), 'utf8');

    test('doit contenir le hash de mot de passe admin', () => {
        expect(scriptContent).toMatch(/passwordHash:\s*"6ca3634577a51d27fd0c5134492fbb30c8f823c5d6a3605630245a442ef31075"/);
    });

    test('doit contenir les fonctions d\'authentification', () => {
        expect(scriptContent).toMatch(/function\s+isAdminAuthenticated/);
        expect(scriptContent).toMatch(/function\s+setAdminSession/);
        expect(scriptContent).toMatch(/function\s+clearAdminSession/);
        expect(scriptContent).toMatch(/function\s+verifyAdminPassword/);
        expect(scriptContent).toMatch(/function\s+showLoginModal/);
        expect(scriptContent).toMatch(/function\s+handleAdminLogin/);
    });

    test('doit vérifier l\'authentification avant d\'ouvrir le modal admin', () => {
        // Vérifier que openAdminModal appelle isAdminAuthenticated au début
        expect(scriptContent).toMatch(/function\s+openAdminModal\s*\([\s\S]*?if\s*\(\s*!isAdminAuthenticated\(\s*\)/);
    });

    test('doit utiliser SHA-256 via crypto.subtle', () => {
        expect(scriptContent).toMatch(/crypto\.subtle\.digest\s*\(\s*['"]SHA-256['"]/);
    });
});
