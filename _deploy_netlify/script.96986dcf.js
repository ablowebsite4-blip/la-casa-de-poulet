// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
    openTime: "11:00",
    closeTime: "23:59",
    whatsappNumber: "212694168759",
    estimatedPrepTime: "20-30", // minutes (range)
    restaurantLat: 33.8971,  // Meknès Zitoune approx
    restaurantLng: -5.5287,
    deliveryFeePerKm: 5, // dh per km
    freeDeliveryKm: 3     // free delivery within 3km
};

// ==========================================
// ADMIN SECURITY
// ==========================================
const ADMIN_CONFIG = {
    // SHA-256 hash du mot de passe: "CasaDePouletAdmin2025!"
    // Générez votre propre hash avec: node -e "console.log(require('crypto').createHash('sha256').update('VOTRE_MOT_DE_PASSE').digest('hex'))"
    passwordHash: "6ca3634577a51d27fd0c5134492fbb30c8f823c5d6a3605630245a442ef31075",
    sessionKey: "lacasadepoulet_admin_session",
    sessionDurationMs: 60 * 60 * 1000 // 1 heure
};

// ==========================================
// TRANSLATIONS
// ==========================================
const TRANSLATIONS = {
    fr: {
        open: "Ouvert",
        closed: "Fermé",
        categories: "Catégories",
        items: "Articles",
        open_days: "Ouvert 7/7",
        search: "Rechercher un plat...",
        total: "Total",
        order: "Commander",
        your_order: "📋 Votre Commande",
        fullname: "👤 Nom complet",
        fullname_ph: "Votre nom",
        district: "🏘️ Quartier",
        district_ph: "Votre quartier",
        gps: "Partager ma position GPS",
        address: "🏠 Adresse exacte / Repère",
        address_ph: "Optionnel: précisez si besoin...",
        special_inst: "📝 Instructions spéciales",
        special_inst_ph: "Ex: Sans oignons, sauce algérienne...",
        optional: "(optionnel)",
        send_whatsapp: "Envoyer via WhatsApp",
        added_to_cart: "ajouté au panier",
        empty_cart: "Panier vide",
        cart_cleared: "Panier vidé",
        offline_mode: "Mode hors-ligne",
        clear_cart_title: "Vider le panier ?",
        clear_cart_desc: "Êtes-vous sûr de vouloir supprimer tous les articles ?",
        cancel: "Annuler",
        yes_clear: "Oui, vider",
        seat: "Numéro de place",
        seat_ph: "Ex: Table 1, Banquette 3...",
        order_mode: "Mode de commande",
        mode_surplace: "Sur place",
        mode_emporter: "À emporter",
        mode_livraison: "Livraison",
        phone: "📱 Téléphone",
        phone_ph: "06 12 34 56 78",
        history: "Historique",
        admin_login: "🔐 Administration",
        admin_login_desc: "Veuillez entrer le mot de passe administrateur pour continuer.",
        password: "Mot de passe",
        login: "Se connecter",
        admin_connected: "Connecté en tant qu'administrateur",
        admin_disconnected: "Déconnecté"
    },
    ar: {
        open: "مفتوح",
        closed: "مغلق",
        categories: "فئات",
        items: "وجبات",
        open_days: "مفتوح 7/7",
        search: "قلب على شي وجبة...",
        total: "المجموع",
        order: "اطلب دابا",
        your_order: "📋 الطلب ديالك",
        fullname: "👤 السمية كاملة",
        fullname_ph: "السمية ديالك",
        district: "🏘️ الحي",
        district_ph: "الحي ديالك",
        gps: "شارك الموقع ديالي (GPS)",
        address: "🏠 العنوان بالضبط / علامة",
        address_ph: "اختياري: وضح الا كان ضروري...",
        special_inst: "📝 ملاحظات خاصة",
        special_inst_ph: "مثال: بلا بصلة، صوص الجيريان...",
        optional: "(اختياري)",
        send_whatsapp: "صيفط فـ WhatsApp",
        added_to_cart: "تزاد فالسلة",
        empty_cart: "السلة خاوية",
        cart_cleared: "السلة خوات",
        offline_mode: "وضع غير متصل",
        clear_cart_title: "نخويو السلة؟",
        clear_cart_desc: "واش متأكد بغيتي تمسح كاع الوجبات؟",
        cancel: "إلغاء",
        yes_clear: "أه، مسح",
        seat: "رقم الطاولة",
        seat_ph: "مثال: طاولة 1، بنكوة 3...",
        order_mode: "نوع الطلبية",
        mode_surplace: "في المكان",
        mode_emporter: "للإخذ",
        mode_livraison: "توصيل",
        phone: "📱 الهاتف",
        phone_ph: "06 12 34 56 78",
        history: "السجل",
        admin_login: "🔐 الإدارة",
        admin_login_desc: "أدخل كلمة مرور المسؤول للمتابعة.",
        password: "كلمة المرور",
        login: "تسجيل الدخول",
        admin_connected: "تم تسجيل الدخول كمسؤول",
        admin_disconnected: "تم تسجيل الخروج"
    }
};

// ==========================================
// MENU DATA (Default + Dynamic Loading)
// ==========================================
// NOTE: DEFAULT_MENU est un fallback hors-ligne. Il doit être maintenu synchronisé
// avec menu.json (source principale). L'admin editor modifie uniquement le localStorage,
// pas le fichier menu.json ou ce code. Pour modifier le menu par défaut, éditez les deux.
const DEFAULT_MENU = {"panini": {"label": "LES PANINI", "labelAr": "بانيني", "emoji": "🥙", "items": [{"id": "pan-fromage", "name": "Panini Fromage", "price": 20, "image": "images/22.jpeg"}, {"id": "pan-poulet", "name": "Panini Poulet", "price": 23, "image": "images/10.jpeg"}, {"id": "pan-dinde", "name": "Panini Dinde", "price": 23, "image": "images/27.jpeg"}, {"id": "pan-viandh", "name": "Panini Viande H.", "price": 23, "image": "images/24.jpeg"}, {"id": "pan-mixt", "name": "Panini Mixt", "price": 25, "image": "images/28.jpeg"}, {"id": "pan-charcut", "name": "Panini Charcuterie", "price": 25, "image": "images/25.jpeg"}, {"id": "pan-negutte", "name": "Panini Negutte", "price": 25, "image": "images/23.jpeg"}, {"id": "pan-cordon", "name": "Panini Cordon Bleu", "price": 30, "image": "images/26.jpeg"}, {"id": "pan-mer", "name": "Panini Fruit de Mer", "price": 30, "image": "images/21.jpeg"}, {"id": "pan-crispy", "name": "Panini Crispy", "price": 25, "badge": "⚡ Crispy", "badgeColor": "orange"}]}, "burger": {"label": "LES BURGER", "labelAr": "برجر", "emoji": "🍔", "items": [{"id": "bur-simple", "name": "Burger Simple", "price": 20}, {"id": "bur-cheese", "name": "Cheese Burger", "price": 25, "image": "images/13.jpeg"}, {"id": "bur-egg", "name": "Egg Burger", "price": 30}, {"id": "bur-beeg", "name": "Beeg Burger", "price": 35}, {"id": "bur-chiken", "name": "Chiken Burger", "price": 30}]}, "pizza": {"label": "LES PIZZA", "labelAr": "بيتزا", "emoji": "🍕", "items": [{"id": "piz-marguareta", "name": "Pizza Marguareta", "priceP": 20, "priceM": 30, "isPizza": true, "image": "images/16.jpeg"}, {"id": "piz-poulet", "name": "Pizza Poulet", "priceP": 25, "priceM": 35, "isPizza": true}, {"id": "piz-dinde", "name": "Pizza Dinde", "priceP": 25, "priceM": 35, "isPizza": true}, {"id": "piz-viandh", "name": "Pizza Viande H.", "priceP": 25, "priceM": 35, "isPizza": true}, {"id": "piz-thon", "name": "Pizza Thon", "priceP": 25, "priceM": 35, "isPizza": true}, {"id": "piz-mixt", "name": "Pizza Mixt", "priceP": 30, "priceM": 40, "isPizza": true}, {"id": "piz-4saison", "name": "Pizza 4 Saison", "priceP": 32, "priceM": 40, "isPizza": true}, {"id": "piz-mer", "name": "Pizza Fruit de Mer", "priceP": 32, "priceM": 40, "isPizza": true}, {"id": "piz-pepperoni", "name": "Pizza Pepperoni", "priceP": 32, "priceM": 40, "isPizza": true}]}, "tacos": {"label": "LES TACOS", "labelAr": "طاغوس", "emoji": "🌯", "items": [{"id": "tac-poulet", "name": "Tacos Poulet", "price": 25, "image": "images/18.jpeg"}, {"id": "tac-dinde", "name": "Tacos Dinde", "price": 25}, {"id": "tac-viandh", "name": "Tacos Viande H.", "price": 25}, {"id": "tac-mixt", "name": "Tacos Mixt", "price": 30}, {"id": "tac-charcut", "name": "Tacos Charcuterie", "price": 25}, {"id": "tac-negutte", "name": "Tacos Negutte", "price": 25}, {"id": "tac-cordon", "name": "Tacos Cordon Bleu", "price": 30}, {"id": "tac-mer", "name": "Tacos Fruit de Mer", "price": 35}, {"id": "tacg-poulet", "name": "Tacos Poulet", "price": 30, "badge": "Gratiné", "badgeColor": "red", "image": "images/17.jpeg"}, {"id": "tacg-dinde", "name": "Tacos Dinde", "price": 30, "badge": "Gratiné", "badgeColor": "red"}, {"id": "tacg-viandh", "name": "Tacos Viande H.", "price": 30, "badge": "Gratiné", "badgeColor": "red"}, {"id": "tacg-mixt", "name": "Tacos Mixt", "price": 35, "badge": "Gratiné", "badgeColor": "red"}, {"id": "tacg-charcut", "name": "Tacos Charcuterie", "price": 30, "badge": "Gratiné", "badgeColor": "red"}, {"id": "tacg-negutte", "name": "Tacos Negutte", "price": 30, "badge": "Gratiné", "badgeColor": "red"}, {"id": "tacg-cordon", "name": "Tacos Cordon Bleu", "price": 35, "badge": "Gratiné", "badgeColor": "red"}, {"id": "tacg-mer", "name": "Tacos Fruit de Mer", "price": 40, "badge": "Gratiné", "badgeColor": "red"}, {"id": "tac-bowl", "name": "Tacos Bowl", "price": 30, "badge": "⭐ Spécial", "badgeColor": "yellow", "fullWidth": true, "image": "images/3.jpeg"}]}, "chawarma": {"label": "CHAWARMA", "labelAr": "شاورما", "emoji": "🥗", "items": [{"id": "chaw-poulet", "name": "Chawarma Poulet", "price": 25, "image": "images/20.jpeg"}, {"id": "chaw-mixt", "name": "Chawarma Mixt", "price": 30}, {"id": "chaw-fromage", "name": "Chawarma Fromage", "price": 28}, {"id": "chaw-plat", "name": "Plat Chawarma", "price": 35, "badge": "⭐ Spécial", "badgeColor": "yellow"}]}, "pasticcio": {"label": "LES PASTICCIO", "labelAr": "باستيشيو", "emoji": "🫕", "items": [{"id": "pas-poulet", "name": "Pasticcio Poulet", "price": 25, "image": "images/pasticcio.jpeg"}, {"id": "pas-dinde", "name": "Pasticcio Dinde", "price": 25}, {"id": "pas-viandh", "name": "Pasticcio Viande H.", "price": 25}, {"id": "pas-mixt", "name": "Pasticcio Mixt", "price": 30}, {"id": "pas-charcut", "name": "Pasticcio Charcuterie", "price": 25}, {"id": "pas-negutte", "name": "Pasticcio Negutte", "price": 25}, {"id": "pas-cordon", "name": "Pasticcio Cordon Bleu", "price": 30}, {"id": "pas-mer", "name": "Pasticcio Fruit de Mer", "price": 35}, {"id": "pas-crispy", "name": "Pasticcio Crispy", "price": 28, "badge": "⚡ Crispy", "badgeColor": "orange"}]}, "sandwich": {"label": "LES SANDWICH", "labelAr": "ساندويش", "emoji": "🥖", "items": [{"id": "san-poulet", "name": "Sandwich Poulet", "price": 15, "image": "images/sandw-poulet-grille.jpeg"}, {"id": "san-dinde", "name": "Sandwich Dinde", "price": 15}, {"id": "san-viandh", "name": "Sandwich Viande H.", "price": 15}, {"id": "san-mixt", "name": "Sandwich Mixt", "price": 15}, {"id": "san-negutte", "name": "Sandwich Negutte", "price": 15}, {"id": "san-saucisse", "name": "Sandwich Saucisse", "price": 15}, {"id": "san-crispy", "name": "Sandwich Crispy", "price": 17, "badge": "⚡ Crispy", "badgeColor": "orange"}]}, "baguetto": {"label": "BAGUETTO", "labelAr": "باكيطو", "emoji": "🥖", "items": [{"id": "bag-poulet", "name": "Baguetto Poulet", "price": 25, "image": "images/sandw-poulet-grille.jpeg"}, {"id": "bag-dinde", "name": "Baguetto Dinde", "price": 25}, {"id": "bag-viandh", "name": "Baguetto Viande H.", "price": 25}, {"id": "bag-mixt", "name": "Baguetto Mixt", "price": 30}, {"id": "bag-crispy", "name": "Baguetto Crispy", "price": 28, "badge": "⚡ Crispy", "badgeColor": "orange"}]}, "qussadilla": {"label": "QUSSADILLA", "labelAr": "كاساديا", "emoji": "🫓", "items": [{"id": "qus-poulet", "name": "Qassadilla Poulet", "price": 30, "image": "images/quesadillas-legumes.jpeg"}, {"id": "qus-dinde", "name": "Qassadilla Dinde", "price": 30}, {"id": "qus-viandh", "name": "Qassadilla Viande H.", "price": 30}, {"id": "qus-mixt", "name": "Qassadilla Mixt", "price": 30, "image": "images/quesadillas-legumes.jpeg"}, {"id": "qus-crispy", "name": "Quassadilla Crispy", "price": 28, "badge": "⚡ Crispy", "badgeColor": "orange"}]}, "plats": {"label": "LES PLATS", "labelAr": "أطباق", "emoji": "🍽", "items": [{"id": "pla-poulet", "name": "Plat Poulet", "priceSimple": 25, "priceSalade": 35, "isPlat": true, "image": "images/rfissa.jpeg"}, {"id": "pla-dinde", "name": "Plat Dinde", "priceSimple": 25, "priceSalade": 35, "isPlat": true}, {"id": "pla-viandh", "name": "Plat Viande H.", "priceSimple": 25, "priceSalade": 35, "isPlat": true}, {"id": "pla-mixt", "name": "Plat Mixt", "priceSimple": 25, "priceSalade": 35, "isPlat": true}, {"id": "pla-negutte", "name": "Plat Negutte", "priceSimple": 25, "priceSalade": 35, "isPlat": true}, {"id": "pla-saucisse", "name": "Plat Saucisse", "priceSimple": 25, "priceSalade": 35, "isPlat": true}, {"id": "pla-chawarma", "name": "Plat Chawarma", "price": 35, "badge": "⭐ Spécial", "badgeColor": "yellow"}, {"id": "pla-crispy", "name": "Plat Crispy", "price": 38, "badge": "⚡ Crispy", "badgeColor": "orange"}]}, "poulet": {"label": "POULET & TAJINE", "labelAr": "دجاج وطاجين", "emoji": "🍗", "items": [{"id": "rot-quart", "name": "1/4 Poulet Rôti", "price": 30}, {"id": "rot-demi", "name": "1/2 Poulet Rôti", "price": 60}, {"id": "rot-complet", "name": "Poulet Rôti Complet", "price": 120, "image": "images/poulet-roti.jpeg"}, {"id": "dgm-quart", "name": "1/4 Poulet Dgmira", "price": 30, "note": "دخمير"}, {"id": "dgm-demi", "name": "1/2 Poulet Dgmira", "price": 60, "note": "دخمير"}, {"id": "dgm-complet", "name": "Poulet Complet Dgmira", "price": 120, "note": "دخمير"}, {"id": "taj-pruneaux", "name": "Tajine aux Pruneaux", "price": 40, "note": "طاجين بالبرقوق", "image": "images/6.jpeg"}, {"id": "taj-legumes", "name": "Tajine aux Légumes", "price": 40, "note": "طاجين بالخضر", "image": "images/19.jpeg"}, {"id": "csc-poulet", "name": "Couscous Poulet", "price": 30, "badge": "Vendredi", "badgeColor": "green"}, {"id": "csc-viande", "name": "Couscous Viande", "price": 40, "badge": "Vendredi", "badgeColor": "green", "image": "images/9.jpeg"}, {"id": "rfi-rfissa", "name": "Rfissa", "price": 40, "badge": "Mercredi", "badgeColor": "green", "note": "رفيسة", "image": "images/14.jpeg"}]}, "crispy": {"label": "CRISPY CHICKEN", "labelAr": "دجاج مقرمش", "emoji": "⚡", "items": [{"id": "cri-tacos", "name": "Tacos Crispy", "price": 28, "badge": "⚡ Crispy", "badgeColor": "orange"}, {"id": "cri-panini", "name": "Panini Crispy", "price": 25, "badge": "⚡ Crispy", "badgeColor": "orange", "image": "images/21.jpeg"}, {"id": "cri-pasticc", "name": "Pasticcio Crispy", "price": 28, "badge": "⚡ Crispy", "badgeColor": "orange"}, {"id": "cri-sandw", "name": "Sandwich Crispy", "price": 17, "badge": "⚡ Crispy", "badgeColor": "orange"}, {"id": "cri-plat", "name": "Plat Crispy", "price": 38, "badge": "⚡ Crispy", "badgeColor": "orange"}, {"id": "cri-bag", "name": "Baguetto Crispy", "price": 28, "badge": "⚡ Crispy", "badgeColor": "orange"}, {"id": "cri-quas", "name": "Quassadilla Crispy", "price": 28, "badge": "⚡ Crispy", "badgeColor": "orange"}]}, "salades": {"label": "LES SALADES", "labelAr": "سلطات", "emoji": "🥗", "items": [{"id": "sal-nicoise", "name": "Salade Niçoise", "price": 10}, {"id": "sal-maroc", "name": "Salade Marocain", "price": 10}, {"id": "sal-varie", "name": "Salade Varié", "price": 17}, {"id": "sal-riche", "name": "Salade Riche", "price": 32, "badge": "⭐ Premium", "badgeColor": "yellow", "image": "images/7.jpeg"}]}, "boissons": {"label": "JUS & BOISSONS", "labelAr": "عصائر ومشروبات", "emoji": "🥤", "items": [{"id": "boi-banane", "name": "Jus Banane", "price": 12, "emoji": "🍌"}, {"id": "boi-pomme", "name": "Jus Pomme", "price": 12, "emoji": "🍎"}, {"id": "boi-avocat", "name": "Jus Avocat", "price": 15, "emoji": "🥑"}, {"id": "boi-orange", "name": "Jus Orange", "price": 12, "emoji": "🍊"}, {"id": "boi-canette", "name": "Boisson Canette", "price": 6, "emoji": "🥫"}, {"id": "boi-1l", "name": "Boisson 1L", "price": 12, "emoji": "🍶"}]}};
let MENU = {};

async function loadMenu() {
    // Try localStorage override first (for admin edits)
    const savedMenu = localStorage.getItem('lacasadepoulet_menu_override');
    if (savedMenu) {
        try {
            MENU = JSON.parse(savedMenu);
            console.log('[Menu] Loaded override from localStorage');
            return;
        } catch (e) {
            console.warn('[Menu] Failed to parse override, continuing...');
            showError('Erreur menu: modifications ignorées');
        }
    }

    // Try fetch menu.json
    try {
        const response = await fetch('/menu.json');
        if (response.ok) {
            const data = await response.json();
            MENU = data;
            console.log('[Menu] Loaded from menu.json');
            return;
        }
    } catch (e) {
        console.warn('[Menu] menu.json not available, using default');
    }

    // Fallback to DEFAULT_MENU
    MENU = DEFAULT_MENU;
    console.log('[Menu] Using DEFAULT_MENU');
    if (!navigator.onLine) {
        const lang = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;
        showToast(lang.offline_mode + ' - menu par défaut');
    }
}

// Initialize default stock if not present
function initializeStocks() {
    Object.values(MENU).forEach(cat => {
        if (cat.items) {
            cat.items.forEach(item => {
                if (item.stock === undefined) {
                    item.stock = 100; // stock par défaut raisonnable
                }
            });
        }
    });
}

// Call after MENU is loaded
const originalLoadMenu = loadMenu;
loadMenu = async function() {
    await originalLoadMenu();
    initializeStocks();
};

// ==========================================
// STATE
// ==========================================
let cart = {};
let gpsData = null;
let activeCategory = 'panini';
let pizzaSelections = {};
let platSelections = {};
let currentLang = 'fr';
let isShopOpen = true;
let selectedTable = null;
let orderMode = 'surplace'; // default

// ==========================================
// LOCAL STORAGE
// ==========================================
const STORAGE_KEYS = {
    CART: 'lacasadepoulet_cart',
    PIZZA_SIZES: 'lacasadepoulet_pizza_sizes',
    PLAT_OPTIONS: 'lacasadepoulet_plat_options',
    TABLE_SELECTION: 'lacasadepoulet_table',
    ORDER_MODE: 'lacasadepoulet_order_mode',
    ORDER_HISTORY: 'lacasadepoulet_order_history'
};

// ==========================================
// DOM ELEMENTS
// ==========================================
const navList = document.getElementById('navList');
const content = document.getElementById('content');
const bottomBar = document.getElementById('bottomBar');
const cartCount = document.getElementById('cartCount');
const cartPreview = document.getElementById('cartPreview');
const totalPrice = document.getElementById('totalPrice');
const clearBtn = document.getElementById('clearBtn');
const orderBtn = document.getElementById('orderBtn');
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const orderSummary = document.getElementById('orderSummary');
const confirmModal = document.getElementById('confirmModal');
const confirmOverlay = document.getElementById('confirmOverlay');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const confirmYesBtn = document.getElementById('confirmYesBtn');
const orderForm = document.getElementById('orderForm');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const districtInput = document.getElementById('district');
const addressInput = document.getElementById('address');
const specialInstructionsInput = document.getElementById('specialInstructions');
const gpsBtn = document.getElementById('gpsBtn');
const gpsInfo = document.getElementById('gpsInfo');
const submitBtn = document.getElementById('submitBtn');
const floatingCallBtn = document.getElementById('floatingCallBtn');
const addressOptional = document.getElementById('addressOptional');
const langToggle = document.getElementById('langToggle');
const statusBadge = document.getElementById('statusBadge');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const toastContainer = document.getElementById('toastContainer');
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const historyOverlay = document.getElementById('historyOverlay');
const historyClose = document.getElementById('historyClose');
const historyList = document.getElementById('historyList');

// Login Modal Elements
const loginModal = document.getElementById('loginModal');
const loginOverlay = document.getElementById('loginOverlay');
const loginClose = document.getElementById('loginClose');
const loginForm = document.getElementById('loginForm');
const adminPasswordInput = document.getElementById('adminPassword');
const loginError = document.getElementById('loginError');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');

// Admin Modal Elements
const adminBtn = document.getElementById('adminBtn');
const adminModal = document.getElementById('adminModal');
const adminOverlay = document.getElementById('adminOverlay');
const adminClose = document.getElementById('adminClose');
const menuEditor = document.getElementById('menuEditor');
const adminSaveBtn = document.getElementById('adminSaveBtn');
const adminResetBtn = document.getElementById('adminResetBtn');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');
const adminStatus = document.getElementById('adminStatus');

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    if (floatingCallBtn) floatingCallBtn.href = `tel:+${CONFIG.whatsappNumber}`;
    await loadMenu();
    checkShopStatus();
    loadCartFromStorage(); // Load saved cart first
    updateUITexts(); // Translate all static elements
    initNavigation();
    renderCategories();
    renderCartBar();
    initModal();
    initFormValidation();
    initTableSelection();
    initOrderModeSelection();
    restoreSavedSelections(); // Restore saved selections (mode, table) and ARIA states
    initMobileOptimizations();
    initTranslations();
    initSearch();
    initHistory();
    initAdmin();
});

// ==========================================
// STATUS & TRANSLATIONS
// ==========================================
function checkShopStatus() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour + currentMinute / 60;
    
    const [openH, openM] = CONFIG.openTime.split(':').map(Number);
    const [closeH, closeM] = CONFIG.closeTime.split(':').map(Number);
    const openTime = openH + openM / 60;
    const closeTime = closeH + closeM / 60;

    isShopOpen = currentTime >= openTime && currentTime < closeTime;
    
    if (!isShopOpen) {
        statusBadge.classList.add('closed');
        statusBadge.querySelector('.status-text').textContent = TRANSLATIONS[currentLang].closed;
        orderBtn.disabled = true;
        orderBtn.style.opacity = '0.5';
    } else {
        statusBadge.classList.remove('closed');
        statusBadge.querySelector('.status-text').textContent = TRANSLATIONS[currentLang].open;
        orderBtn.disabled = false;
        orderBtn.style.opacity = '1';
    }
}

function initTranslations() {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'fr' ? 'ar' : 'fr';
        langToggle.textContent = currentLang === 'fr' ? 'عربية' : 'Français';
        document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = currentLang;
        updateUITexts();
        renderCategories(); // Re-render to update category names
    });
}

function updateUITexts() {
    const t = TRANSLATIONS[currentLang];

    // Update data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.placeholder = t[key];
    });

    // Update table buttons text
    document.querySelectorAll('.table-btn').forEach(btn => {
        const tableNum = btn.dataset.table;
        btn.textContent = currentLang === 'ar' ? `طاولة ${tableNum}` : `Table ${tableNum}`;
    });

    // Update order mode buttons text
    const modeLabels = {
        surplace: t.mode_surplace,
        emporter: t.mode_emporter,
        livraison: t.mode_livraison
    };
    document.querySelectorAll('.mode-btn').forEach(btn => {
        const mode = btn.dataset.mode;
        if (modeLabels[mode]) {
            btn.textContent = modeLabels[mode];
        }
    });

    // Update status
    checkShopStatus();

    // Update nav
    initNavigation();
}

// ==========================================
// PERSISTENCE (localStorage)
// ==========================================
function saveCartToStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        localStorage.setItem(STORAGE_KEYS.PIZZA_SIZES, JSON.stringify(pizzaSelections));
        localStorage.setItem(STORAGE_KEYS.PLAT_OPTIONS, JSON.stringify(platSelections));
        localStorage.setItem(STORAGE_KEYS.ORDER_MODE, orderMode);
        if (selectedTable) {
            localStorage.setItem(STORAGE_KEYS.TABLE_SELECTION, selectedTable);
        } else {
            localStorage.removeItem(STORAGE_KEYS.TABLE_SELECTION);
        }
    } catch (e) {
        console.warn('Failed to save to localStorage:', e);
        showError('Impossible de sauvegarder le panier');
    }
}

function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
        const savedPizzaSizes = localStorage.getItem(STORAGE_KEYS.PIZZA_SIZES);
        const savedPlatOptions = localStorage.getItem(STORAGE_KEYS.PLAT_OPTIONS);
        const savedMode = localStorage.getItem(STORAGE_KEYS.ORDER_MODE);
        const savedTable = localStorage.getItem(STORAGE_KEYS.TABLE_SELECTION);

        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        if (savedPizzaSizes) {
            pizzaSelections = JSON.parse(savedPizzaSizes);
        }
        if (savedPlatOptions) {
            platSelections = JSON.parse(savedPlatOptions);
        }
        if (savedMode) {
            orderMode = savedMode;
        }
        if (savedTable) {
            selectedTable = savedTable;
        }
    } catch (e) {
        console.warn('Failed to load from localStorage:', e);
        showError('Impossible de charger le panier sauvegardé');
    }
}

// ==========================================
// RESTORE UI STATE (after load)
// ==========================================
function restoreSavedSelections() {
    const modeBtns = document.querySelectorAll('.mode-btn');
    const tableBtns = document.querySelectorAll('.table-btn');

    // Restore mode button selection
    modeBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
    });
    const activeModeBtn = document.querySelector(`.mode-btn[data-mode="${orderMode}"]`);
    if (activeModeBtn) {
        activeModeBtn.classList.add('active');
        activeModeBtn.setAttribute('aria-checked', 'true');
    }

    // Restore table button selection
    tableBtns.forEach(b => {
        b.classList.remove('selected');
        b.setAttribute('aria-checked', 'false');
    });
    if (selectedTable) {
        const selectedBtn = document.querySelector(`.table-btn[data-table="${selectedTable}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
            selectedBtn.setAttribute('aria-checked', 'true');
        }
    }

    // Update table buttons state (disable if not surplace)
    updateTableButtonsState();
}

// ==========================================
// SEARCH
// ==========================================
function initSearch() {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        clearSearch.style.display = query.length > 0 ? 'flex' : 'none';
        
        if (query === '') {
            // Show all categories and active one
            document.querySelectorAll('.category-section').forEach(section => {
                section.style.display = section.dataset.category === activeCategory ? 'block' : 'none';
            });
            document.querySelector('.nav').style.display = 'block';
            return;
        }

        // Hide nav during search
        document.querySelector('.nav').style.display = 'none';

        // Filter and show matching items
        Object.keys(MENU).forEach(cat => {
            const section = document.querySelector(`.category-section[data-category="${cat}"]`);
            const grid = document.getElementById(`grid-${cat}`);
            const items = MENU[cat].items;
            
            const matchingItems = items.filter(item => 
                item.name.toLowerCase().includes(query) || 
                (item.note && item.note.toLowerCase().includes(query))
            );

            if (matchingItems.length > 0) {
                section.style.display = 'block';
                grid.innerHTML = '';
                matchingItems.forEach(item => {
                    grid.appendChild(createCard(item, cat));
                });
            } else {
                section.style.display = 'none';
            }
        });
    });

    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        clearSearch.style.display = 'none';
        searchInput.dispatchEvent(new Event('input'));
    });
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
        <span class="toast-icon" aria-hidden="true">✅</span>
        <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-exit');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 2500);
}

function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast error';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.innerHTML = `
        <span class="toast-icon" aria-hidden="true">❌</span>
        <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-exit');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 4000);
}

// ==========================================
// NAVIGATION
// ==========================================
function initNavigation() {
    navList.innerHTML = '';
    const categories = Object.keys(MENU);

    categories.forEach((cat, index) => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        const label = currentLang === 'ar' && MENU[cat].labelAr ? MENU[cat].labelAr : MENU[cat].label;
        li.innerHTML = `
            <button class="nav-link ${cat === activeCategory ? 'active' : ''}" data-category="${cat}">
                ${MENU[cat].emoji} ${label}
            </button>
        `;
        navList.appendChild(li);
    });

    // Event delegation : un seul listener sur le conteneur
    navList.addEventListener('click', (e) => {
        const link = e.target.closest('.nav-link');
        if (link) {
            switchCategory(link.dataset.category);
        }
    });
}

function switchCategory(category) {
    activeCategory = category;

    // Update nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.category === category);
    });

    // Update sections
    document.querySelectorAll('.category-section').forEach(section => {
        section.classList.toggle('active', section.dataset.category === category);
    });
}

// ==========================================
// RENDER CATEGORIES & CARDS
// ==========================================
function renderCategories() {
    content.innerHTML = '';
    const categories = Object.keys(MENU);

    categories.forEach(cat => {
        const section = document.createElement('section');
        section.className = 'category-section';
        section.dataset.category = cat;

        // Les boissons ont une grille spéciale avec emoji plus grand (drinks-grid)
        const gridClass = cat === 'boissons' ? 'grid drinks-grid' : 'grid';
        const label = currentLang === 'ar' && MENU[cat].labelAr ? MENU[cat].labelAr : MENU[cat].label;

        section.innerHTML = `
            <h2 class="section-title">
                <span class="section-emoji">${MENU[cat].emoji}</span>
                ${label}
            </h2>
            <div class="${gridClass}" id="grid-${cat}"></div>
        `;

        content.appendChild(section);

        // Render cards
        renderGrid(cat);
    });

    // Show active category
    switchCategory(activeCategory);
}

function renderGrid(category) {
    const grid = document.getElementById(`grid-${category}`);
    const items = MENU[category].items;

    items.forEach(item => {
        const card = createCard(item, category);
        grid.appendChild(card);
    });
}

function createCard(item, category) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.cardId = item.id; // pour updateCardDisplay()
    if (item.fullWidth) card.classList.add('full-width');

    // Get current price
    let currentPrice = getCurrentPrice(item);
    let displayName = getDisplayName(item);

    // Badge
    let badgeHTML = '';
    if (item.badge) {
        badgeHTML = `<span class="badge ${item.badgeColor}">${item.badge}</span>`;
    }

    // Note
    let noteHTML = '';
    if (item.note) {
        noteHTML = `<div class="card-note">${item.note}</div>`;
    }

    // Toggles - using reusable builder
    let toggleHTML = '';
    if (item.isPizza) {
        const size = pizzaSelections[item.id] || 'P';
        toggleHTML = buildToggleGroup(
            item.id,
            [{value: 'P', label: 'P'}, {value: 'M', label: 'M'}],
            size,
            'setPizzaSize'
        );
    }
    if (item.isPlat && !item.badge) {
        const opt = platSelections[item.id] || 'simple';
        toggleHTML = buildToggleGroup(
            item.id,
            [{value: 'simple', label: 'Simple'}, {value: 'salade', label: '+ Salade', orange: true}],
            opt,
            'setPlatOption'
        );
    }

    // Quantity
    const qty = cart[item.id]?.qty || 0;
    const isOutOfStock = item.stock !== undefined && item.stock <= 0;
    const maxQtyReached = item.stock !== undefined && qty >= item.stock;
    let qtyHTML = '';

    if (isOutOfStock) {
        qtyHTML = `<div style="color:var(--red);font-size:13px;font-weight:600;text-align:center;padding:12px;background:rgba(224,32,32,0.1);border-radius:12px;">ÉPUISÉ</div>`;
    } else if (qty > 0) {
        qtyHTML = `
            <div class="qty-controls">
                <button class="qty-btn qty-minus" onclick="updateCartQty('${item.id}', -1)">−</button>
                <span class="qty-display">${qty}</span>
                <button class="qty-btn qty-plus" ${maxQtyReached ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} onclick="updateCartQty('${item.id}', 1)">+</button>
            </div>
        `;
        card.classList.add('has-qty');
    } else {
        qtyHTML = `<button class="add-btn" onclick="addToCart('${item.id}', '${item.name}', ${currentPrice}, '${displayName}')">+</button>`;
    }

    // Drink emoji
    let emojiHTML = '';
    if (item.emoji && category === 'boissons') {
        emojiHTML = `<span class="drink-emoji">${item.emoji}</span>`;
        badgeHTML = ''; // No badge for drinks
        card.classList.add('drink-card');
    }

    // Image
    let imageHTML = '';
    if (item.image) {
        imageHTML = `<img src="${item.image}" alt="${item.name}" class="card-image" loading="lazy" />`;
    }

    card.innerHTML = `
        ${imageHTML}
        ${emojiHTML}
        <div class="card-header">
            <div class="card-name">${item.name}</div>
            ${noteHTML}
            ${badgeHTML}
        </div>
        <div class="price-container">
            <span class="price">${currentPrice} dh</span>
        </div>
        ${toggleHTML}
        ${qtyHTML}
    `;

    return card;
}

function getCurrentPrice(item) {
    if (item.isPizza) {
        const size = pizzaSelections[item.id] || 'P';
        return size === 'P' ? item.priceP : item.priceM;
    }
    if (item.isPlat && !item.badge) {
        const opt = platSelections[item.id] || 'simple';
        return opt === 'simple' ? item.priceSimple : item.priceSalade;
    }
    return item.price;
}

function getDisplayName(item) {
    let name = item.name;
    if (item.isPizza) {
        const size = pizzaSelections[item.id] || 'P';
        name += ` (${size === 'P' ? 'P' : 'M'})`;
    }
    if (item.isPlat && !item.badge) {
        const opt = platSelections[item.id] || 'simple';
        if (opt === 'salade') name += ' + Salade';
    }
    return name;
}

// Reusable toggle group builder
function buildToggleGroup(itemId, options, selected, onChangeFn) {
    return `
        <div class="toggle-group">
            ${options.map(opt => `
                <button class="toggle-btn${opt.orange ? ' orange' : ''} ${opt.value === selected ? 'active' : ''}"
                        onclick="${onChangeFn}('${itemId}', '${opt.value}')">
                    ${opt.label}
                </button>
            `).join('')}
        </div>
    `;
}

// ==========================================
// CART FUNCTIONS
// ==========================================
function addToCart(id, name, price, displayName) {
    if (!isShopOpen) return;

    // Check stock if defined
    const category = findCategoryByItemId(id);
    if (category) {
        const item = MENU[category].items.find(i => i.id === id);
        if (item && item.stock !== undefined && item.stock >= 0) {
            const currentQty = cart[id] ? cart[id].qty : 0;
            if (currentQty + 1 > item.stock) {
                showToast('❌ Stock insuffisant');
                return;
            }
        }
    }

    if (cart[id]) {
        cart[id].qty++;
    } else {
        cart[id] = { id, name, price, qty: 1, displayName };
    }
    updateCardDisplay(id);
    renderCartBar();
    saveCartToStorage();
    showToast(`${displayName || name} ${TRANSLATIONS[currentLang].added_to_cart}`);
}

function updateCartQty(id, delta) {
    if (!cart[id]) return;

    // Vérifier le stock si augmentation
    if (delta > 0) {
        const category = findCategoryByItemId(id);
        if (category) {
            const item = MENU[category].items.find(i => i.id === id);
            if (item && item.stock !== undefined && item.stock >= 0) {
                if (cart[id].qty + delta > item.stock) {
                    showToast('❌ Stock insuffisant');
                    return;
                }
            }
        }
    }

    cart[id].qty += delta;
    if (cart[id].qty <= 0) {
        delete cart[id];
    }

    updateCardDisplay(id);
    renderCartBar();
    renderOrderSummary();
    saveCartToStorage();
}

function removeFromCart(id) {
    if (cart[id]) {
        delete cart[id];
        updateCardDisplay(id);
        renderCartBar();
        renderOrderSummary();
        saveCartToStorage();
        showToast('Article supprimé');
    }
}

function changeQty(id, delta) {
    updateCartQty(id, delta);
}

function updateCardDisplay(id) {
    const category = findCategoryByItemId(id);
    if (!category) return;

    const item = MENU[category].items.find(i => i.id === id);
    const grid = document.getElementById(`grid-${category}`);

    // Find existing card
    const oldCard = Array.from(grid.children).find(card =>
        card.querySelector(`[onclick*="'${id}'"]`) || card.dataset.cardId === id
    );

    if (oldCard && item) {
        const newCard = createCard(item, category);
        newCard.dataset.cardId = id;
        oldCard.replaceWith(newCard);
    }
}

function findCategoryByItemId(id) {
    for (const key of Object.keys(MENU)) {
        if (MENU[key].items.some(item => item.id === id)) {
            return key;
        }
    }
    return null;
}

function getTotalItems() {
    return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
}

function getTotalPrice() {
    return Object.values(cart).reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function clearCart() {
    cart = {};
    renderCartBar();
    // Re-render all cards
    Object.keys(MENU).forEach(category => {
        const grid = document.getElementById(`grid-${category}`);
        grid.innerHTML = '';
        renderGrid(category);
    });
    saveCartToStorage();
}

// ==========================================
// ORDER HISTORY
// ==========================================
function initHistory() {
    historyBtn.addEventListener('click', openHistoryModal);
    historyClose.addEventListener('click', closeHistoryModal);
    historyOverlay.addEventListener('click', closeHistoryModal);
}

function openHistoryModal() {
    renderOrderHistory();
    historyModal.classList.add('active');
}

function closeHistoryModal() {
    historyModal.classList.remove('active');
}

function saveOrderToHistory(orderData) {
    let history = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDER_HISTORY) || '[]');
    orderData.timestamp = new Date().toISOString();
    orderData.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    history.unshift(orderData);
    // Limit to last 50 orders
    if (history.length > 50) history = history.slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.ORDER_HISTORY, JSON.stringify(history));
}

// ==========================================
// ADMIN
// ==========================================
// ==========================================
// ADMIN AUTHENTICATION
// ==========================================
function isAdminAuthenticated() {
    const session = sessionStorage.getItem(ADMIN_CONFIG.sessionKey);
    if (!session) return false;
    try {
        const sessionData = JSON.parse(session);
        return sessionData.authenticated && sessionData.expires > Date.now();
    } catch (e) {
        console.warn('Admin session parse error:', e);
        return false;
    }
}

function setAdminSession() {
    const sessionData = {
        authenticated: true,
        expires: Date.now() + ADMIN_CONFIG.sessionDurationMs
    };
    sessionStorage.setItem(ADMIN_CONFIG.sessionKey, JSON.stringify(sessionData));
}

function clearAdminSession() {
    sessionStorage.removeItem(ADMIN_CONFIG.sessionKey);
}

async function verifyAdminPassword(password) {
    try {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex === ADMIN_CONFIG.passwordHash;
    } catch (error) {
        console.error('Password verification error:', error);
        // Fallback for older browsers without crypto.subtle
        return false;
    }
}

function showLoginModal() {
    if (loginError) loginError.style.display = 'none';
    if (loginForm) loginForm.reset();
    if (adminPasswordInput) adminPasswordInput.focus();
    if (loginModal) loginModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideLoginModal() {
    if (loginModal) loginModal.classList.remove('active');
    document.body.style.overflow = '';
}

function handleAdminLogin(e) {
    e.preventDefault();
    const password = adminPasswordInput.value;
    if (!password) return;

    // Disable button during verification
    if (loginSubmitBtn) {
        loginSubmitBtn.disabled = true;
        loginSubmitBtn.textContent = 'Vérification...';
    }

    verifyAdminPassword(password).then(isValid => {
        // Re-enable button
        if (loginSubmitBtn) {
            loginSubmitBtn.disabled = false;
            loginSubmitBtn.innerHTML = '<span data-i18n="login">Se connecter</span>';
        }

        if (isValid) {
            setAdminSession();
            hideLoginModal();
            openAdminModal();
            if (adminStatus) adminStatus.textContent = '';
            showToast(TRANSLATIONS[currentLang].admin_connected || 'Connecté', 'success');
        } else {
            if (loginError) {
                loginError.textContent = 'Mot de passe incorrect';
                loginError.style.display = 'block';
            }
            if (adminPasswordInput) {
                adminPasswordInput.value = '';
                adminPasswordInput.focus();
            }
            // Clear session on failed attempt? Optional
            clearAdminSession();
        }
    });
}

function closeLoginModal() {
    hideLoginModal();
}

function initAdmin() {
    // Show admin button if ?admin=1 in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === '1' && adminBtn) {
        adminBtn.style.display = 'flex';
    }

    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            if (isAdminAuthenticated()) {
                openAdminModal();
            } else {
                showLoginModal();
            }
        });
    }

    // Login modal events
    if (loginForm) loginForm.addEventListener('submit', handleAdminLogin);
    if (loginOverlay) loginOverlay.addEventListener('click', closeLoginModal);
    if (loginClose) loginClose.addEventListener('click', closeLoginModal);

    // Admin modal events
    if (adminClose) adminClose.addEventListener('click', closeAdminModal);
    if (adminOverlay) adminOverlay.addEventListener('click', closeAdminModal);
    if (adminSaveBtn) adminSaveBtn.addEventListener('click', saveMenuFromEditor);
    if (adminResetBtn) adminResetBtn.addEventListener('click', resetMenu);
    if (adminLogoutBtn) adminLogoutBtn.addEventListener('click', () => {
        clearAdminSession();
        closeAdminModal();
        showToast(TRANSLATIONS[currentLang].admin_disconnected || 'Déconnecté', 'info');
    });
}

function openAdminModal() {
    // Security: verify authentication before showing admin
    if (!isAdminAuthenticated()) {
        showLoginModal();
        return;
    }
    menuEditor.value = JSON.stringify(MENU, null, 2);
    adminStatus.textContent = '';
    adminModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAdminModal() {
    adminModal.classList.remove('active');
    document.body.style.overflow = '';
}

async function saveMenuFromEditor() {
    try {
        const newMenu = JSON.parse(menuEditor.value);
        localStorage.setItem('lacasadepoulet_menu_override', JSON.stringify(newMenu));
        MENU = newMenu;
        renderCategories();
        closeAdminModal();
        showToast('Menu sauvegardé et rechargé !');
    } catch (e) {
        adminStatus.textContent = '❌ JSON invalide: ' + e.message;
        adminStatus.style.color = '#ff6b6b';
        showError('JSON invalide: ' + e.message);
        setTimeout(() => {
            adminStatus.textContent = '';
            adminStatus.style.color = '';
        }, 5000);
    }
}

function resetMenu() {
    if (confirm('Réinitialiser le menu aux valeurs par défaut ? Cette action ne peut être annulée.')) {
        localStorage.removeItem('lacasadepoulet_menu_override');
        MENU = DEFAULT_MENU;
        renderCategories();
        closeAdminModal();
        showToast('Menu réinitialisé aux valeurs par défaut');
    }
}

function renderOrderHistory() {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDER_HISTORY) || '[]');

    if (history.length === 0) {
        historyList.innerHTML = `<div style="text-align:center;color:rgba(255,255,255,0.4);padding:40px;">Aucune commande antérieure</div>`;
        return;
    }

    let html = '<div style="display:flex;flex-direction:column;gap:12px;">';
    history.forEach(order => {
        const date = new Date(order.timestamp).toLocaleDateString(currentLang === 'ar' ? 'ar-MA' : 'fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        const itemsList = order.items.map(i => `${i.qty}× ${i.displayName || i.name}`).join(', ');

        html += `
            <div style="background:rgba(255,255,255,0.05);padding:16px;border-radius:16px;border:1px solid rgba(255,255,255,0.1)">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                    <span style="font-size:11px;color:var(--white-muted)">#${order.id}</span>
                    <span style="font-size:11px;color:var(--green-light)">${date}</span>
                </div>
                <div style="font-size:13px;color:var(--white-dim);margin-bottom:8px;line-height:1.4">${itemsList}</div>
                <div style="display:flex;justify-content:space-between;align-items:center">
                    <span style="font-family:'Bebas Neue';font-size:20px;color:var(--yellow)">${order.total} dh</span>
                    <span style="font-size:11px;padding:4px 10px;background:rgba(245,196,0,0.1);color:var(--yellow);border-radius:100px">${TRANSLATIONS[currentLang]['mode_' + order.mode] || order.mode}</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    historyList.innerHTML = html;
}

function renderCartBar() {
    const totalItems = getTotalItems();
    const total = getTotalPrice();

    if (totalItems === 0) {
        bottomBar.classList.remove('visible');
        if (floatingCallBtn) floatingCallBtn.classList.remove('lifted');
        return;
    }

    bottomBar.classList.add('visible');
    if (floatingCallBtn) floatingCallBtn.classList.add('lifted');
    cartCount.textContent = totalItems;
    totalPrice.textContent = `${total} dh`;

    // Preview text - mobile friendly
    const items = Object.values(cart).slice(0, 3);
    let previewText = items.map(item => `${item.displayName || item.name} x${item.qty}`).join(' · ');
    const moreCount = Object.keys(cart).length - 3;

    if (moreCount > 0) {
        // Mobile: show shorter text
        if (window.innerWidth <= 480) {
            previewText = items.map(item => `${item.name} x${item.qty}`).join(' · ');
        }
        previewText += ` +${moreCount}`;
    }

    cartPreview.textContent = previewText;

    // Scroll preview to end on mobile
    setTimeout(() => {
        cartPreview.scrollLeft = cartPreview.scrollWidth;
    }, 100);
}

// ==========================================
// TOGGLE FUNCTIONS
// ==========================================
function setPizzaSize(id, size) {
    pizzaSelections[id] = size;
    const category = findCategoryByItemId(id);
    const item = MENU[category].items.find(i => i.id === id);

    if (item) {
        updateCardDisplay(id);
        if (cart[id]) {
            cart[id].price = size === 'P' ? item.priceP : item.priceM;
            cart[id].displayName = `${item.name} (${size === 'P' ? 'P' : 'M'})`;
            renderCartBar();
            saveCartToStorage();
        }
        saveCartToStorage(); // Save pizza selection even if not in cart yet
    }
}

function setPlatOption(id, option) {
    platSelections[id] = option;
    const category = findCategoryByItemId(id);
    const item = MENU[category].items.find(i => i.id === id);

    if (item) {
        updateCardDisplay(id);
        if (cart[id]) {
            cart[id].price = option === 'simple' ? item.priceSimple : item.priceSalade;
            cart[id].displayName = item.name + (option === 'salade' ? ' + Salade' : '');
            renderCartBar();
            saveCartToStorage();
        }
        saveCartToStorage(); // Save plat selection even if not in cart yet
    }
}

// ==========================================
// MODAL
// ==========================================
function initModal() {
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    orderBtn.addEventListener('click', openModal);

    // Close modal on Escape key
    // Global Escape key handler for all modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal && modal.classList.contains('active')) {
                closeModal();
            } else if (loginModal && loginModal.classList.contains('active')) {
                closeLoginModal();
            } else if (historyModal && historyModal.classList.contains('active')) {
                closeHistoryModal();
            } else if (adminModal && adminModal.classList.contains('active')) {
                closeAdminModal();
            } else if (confirmModal && confirmModal.classList.contains('active')) {
                closeConfirmModal();
            }
        }
    });

    // Custom Confirm Modal Logic
    clearBtn.addEventListener('click', () => {
        confirmModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    const closeConfirmModal = () => {
        confirmModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    confirmCancelBtn.addEventListener('click', closeConfirmModal);
    confirmOverlay.addEventListener('click', (e) => {
        if (e.target === confirmOverlay) closeConfirmModal();
    });

    confirmYesBtn.addEventListener('click', () => {
        clearCart();
        closeConfirmModal();
        showToast(TRANSLATIONS[currentLang].cart_cleared || 'Panier vidé');
    });

    submitBtn.addEventListener('click', sendOrder);
}

function openModal() {
    renderOrderSummary();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Focus first focusable element in modal
    const firstFocusable = modal.querySelector('button:not([disabled]), input:not([disabled]), textarea:not([disabled])');
    if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
    }
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // Return focus to order button
    orderBtn.focus();
}

function renderOrderSummary() {
    const items = Object.values(cart);

    if (items.length === 0) {
        orderSummary.innerHTML = `<div style="text-align:center;color:rgba(255,255,255,0.4);padding:40px;">${TRANSLATIONS[currentLang].empty_cart}</div>`;
        return;
    }

    let html = '';
    items.forEach(item => {
        html += `
            <div class="summary-item" data-item-id="${item.id}">
                <span class="summary-name">${item.displayName || item.name}</span>
                <div class="summary-qty-controls">
                    <button type="button" class="qty-minus" onclick="changeQty('${item.id}', -1)" aria-label="Diminuer quantité">−</button>
                    <span class="qty-display">${item.qty}</span>
                    <button type="button" class="qty-plus" onclick="changeQty('${item.id}', 1)" aria-label="Augmenter quantité">+</button>
                </div>
                <span class="summary-price">${item.price * item.qty} dh</span>
                <button type="button" class="summary-remove" onclick="removeFromCart('${item.id}')" aria-label="Supprimer ${item.displayName || item.name}" title="Supprimer">×</button>
            </div>
        `;
    });

    const total = getTotalPrice();
    html += `
        <div class="summary-item">
            <span class="summary-name">TOTAL</span>
            <span></span>
            <span class="summary-price">${total} dh</span>
        </div>
    `;

    orderSummary.innerHTML = html;
}

// ==========================================
// FORM VALIDATION
// ==========================================
function initFormValidation() {
    const inputs = [nameInput, phoneInput, districtInput, addressInput];

    inputs.forEach(input => {
        input.addEventListener('input', validateForm);
    });

    gpsBtn.addEventListener('click', requestGPS);

    // Initial state for address optional label
    updateAddressOptionalLabel();
    updatePhoneRequirement();
}

function validateForm() {
    // Validate name (requis)
    validateInput(nameInput);

    // Validate district (optionnel - ne bloque pas)
    validateInput(districtInput);

    // Validate phone if required (for emporter/livraison)
    validateInput(phoneInput);
    const phoneValid = !phoneInput.required || (phoneInput.value.trim() && /^[0-9]{10}$/.test(phoneInput.value.replace(/\s/g, '')));

    // Check if form is complete
    const nameValid = nameInput.value.trim() !== '';
    // districtValid est maintenant toujours true (champ optionnel)
    const districtValid = true; // Quartier optionnel

    submitBtn.disabled = !(nameValid && districtValid && phoneValid);
}

// ==========================================
// MOBILE OPTIMIZATIONS
// ==========================================
function initMobileOptimizations() {
    // Prevent zoom on double tap for buttons
    document.querySelectorAll('button, .nav-link').forEach(el => {
        el.addEventListener('touchend', (e) => {
            if (!el.hasAttribute('data-prevent-zoom')) {
                // e.preventDefault(); // Removed to allow normal scrolling and clicking
                // el.click();
            }
        }, {passive: true});
    });

    // Smooth scroll to active category on nav click
    navList.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const category = link.dataset.category;
            const section = document.querySelector(`.category-section[data-category="${category}"]`);
            if (section) {
                // Scroll avec marge pour la nav sticky
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Auto-close keyboard on submit
    submitBtn.addEventListener('click', () => {
        document.activeElement.blur();
    });

    // Improve tap targets for small screens
    if (window.innerWidth <= 480) {
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.style.minWidth = '32px';
            btn.style.minHeight = '32px';
        });
    }
}

function validateInput(input) {
    if (input.value.trim()) {
        input.classList.remove('invalid');
        input.classList.add('valid');
    } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
    }
}

// ==========================================
// TABLE SELECTION
// ==========================================
function initTableSelection() {
    const tableBtns = document.querySelectorAll('.table-btn');

    tableBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove selected class and aria-checked from all buttons
            tableBtns.forEach(b => {
                b.classList.remove('selected');
                b.setAttribute('aria-checked', 'false');
            });

            // Add selected class and aria-checked to clicked button
            btn.classList.add('selected');
            btn.setAttribute('aria-checked', 'true');

            // Store selected table
            selectedTable = btn.dataset.table;
            saveCartToStorage();
        });
    });

}

// ==========================================
// ORDER MODE SELECTION
// ==========================================
function initOrderModeSelection() {
    const modeBtns = document.querySelectorAll('.mode-btn');

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            modeBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-checked', 'false');
            });

            // Add active class to clicked button
            btn.classList.add('active');
            btn.setAttribute('aria-checked', 'true');

            // Store selected mode
            orderMode = btn.dataset.mode;
            saveCartToStorage();
            updateTableButtonsState();
            updatePhoneRequirement();
            validateForm();
        });
    });

    // Restore UI based on loaded orderMode (from loadCartFromStorage)
    const activeBtn = document.querySelector(`.mode-btn[data-mode="${orderMode}"]`);
    if (activeBtn) {
        modeBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-checked', 'false');
        });
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-checked', 'true');
    }

    // Set initial state for table buttons
    updateTableButtonsState();
    updatePhoneRequirement();
}

function updateTableButtonsState() {
    const tableBtns = document.querySelectorAll('.table-btn');
    const tableContainer = document.querySelector('.table-selection');
    const seatLabel = document.querySelector('label[data-i18n="seat"]');

    if (orderMode === 'surplace') {
        tableContainer.style.opacity = '1';
        tableContainer.style.pointerEvents = 'auto';
        tableBtns.forEach(btn => btn.disabled = false);
        if (seatLabel) seatLabel.style.opacity = '1';
    } else {
        tableContainer.style.opacity = '0.5';
        tableContainer.style.pointerEvents = 'none';
        tableBtns.forEach(btn => btn.disabled = true);
        if (seatLabel) seatLabel.style.opacity = '0.5';
        // Clear selection if was selected
        if (selectedTable) {
            selectedTable = null;
            tableBtns.forEach(btn => btn.classList.remove('selected'));
            saveCartToStorage();
        }
    }
}

function updateAddressOptionalLabel() {
    addressOptional.textContent = '(optionnel)';

    if (gpsData) {
        addressInput.placeholder = 'Optionnel: précisez si besoin...';
    } else {
        addressInput.placeholder = 'Ex: Rue des Fleurs, en face de la pharmacie...';
    }
}

function updatePhoneRequirement() {
    const phoneOptional = document.getElementById('phoneOptional');
    const phoneFormGroup = phoneInput ? phoneInput.closest('.form-group') : null;
    if (!phoneInput || !phoneFormGroup) {
        console.warn('[DEBUG] phoneInput or form-group not found!');
        return;
    }

    if (orderMode === 'surplace') {
        phoneInput.required = false;
        phoneFormGroup.style.display = 'block';
        if (phoneOptional) phoneOptional.style.display = 'inline';
    } else if (orderMode === 'livraison') {
        // Livraison : téléphone obligatoire
        phoneInput.required = true;
        phoneFormGroup.style.display = 'block';
        if (phoneOptional) phoneOptional.style.display = 'none';
    } else {
        // Emporter : téléphone optionnel mais visible
        phoneInput.required = false;
        phoneFormGroup.style.display = 'block';
        if (phoneOptional) phoneOptional.style.display = 'inline';
    }
}

// ==========================================
// GPS
// ==========================================
function requestGPS() {
    if (!navigator.geolocation) {
        setGpsError('GPS non supporté par ce navigateur');
        return;
    }

    // Check if page is served over HTTPS (required for geolocation on mobile)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        setGpsError('HTTPS requis pour le GPS');
        return;
    }

    setGpsLoading();

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude.toFixed(6);
            const lng = position.coords.longitude.toFixed(6);
            gpsData = {
                lat,
                lng,
                link: `https://maps.google.com/?q=${lat},${lng}`
            };
            setGpsSuccess();
            updateAddressOptionalLabel();
            validateForm();
        },
        (error) => {
            let msg = 'Position non disponible';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    msg = 'Accès GPS refusé';
                    break;
                case error.POSITION_UNAVAILABLE:
                    msg = 'Position indétectable';
                    break;
                case error.TIMEOUT:
                    msg = 'Délai GPS dépassé';
                    break;
            }
            setGpsError(msg);
            gpsData = null;
            updateAddressOptionalLabel();
            validateForm();
        },
        {
            timeout: 15000,
            enableHighAccuracy: true,
            maximumAge: 60000 // Cache position for 1 min
        }
    );
}

function setGpsLoading() {
    gpsBtn.classList.add('loading');
    gpsBtn.classList.remove('success', 'error');
    gpsBtn.innerHTML = '<div class="spinner"></div> Localisation en cours...';
}

function setGpsSuccess() {
    gpsBtn.classList.remove('loading');
    gpsBtn.classList.add('success');
    gpsBtn.innerHTML = '<span class="gps-icon">✅</span><span class="gps-text">Position acquise !</span>';

    // Calculate distance from restaurant
    const lat = parseFloat(gpsData.lat);
    const lng = parseFloat(gpsData.lng);
    const distance = calculateDistance(lat, lng, CONFIG.restaurantLat, CONFIG.restaurantLng);
    gpsData.distance = distance;

    // Calculate delivery fee if in livraison mode
    if (orderMode === 'livraison') {
        const fee = calculateDeliveryFee(distance);
        gpsData.fee = fee;
        const freeDelivery = distance <= CONFIG.freeDeliveryKm;

        gpsInfo.style.display = 'block';
        gpsInfo.innerHTML = `
            📍 Distance: ${distance.toFixed(1)} km
            ${freeDelivery ? ' ✅ Livraison gratuite !' : `💰 Frais: ${fee} dh`}
        `;
    } else {
        // gpsData.fee = 0;
        gpsInfo.style.display = 'block';
        gpsInfo.innerHTML = `📍 Distance du restaurant: ${distance.toFixed(1)} km`;
    }
}

function setGpsError(msg) {
    gpsBtn.classList.remove('loading');
    gpsBtn.classList.add('error');
    gpsBtn.innerHTML = `<span class="gps-icon">❌</span><span class="gps-text">${msg}</span>`;
    gpsInfo.style.display = 'none';
    showError('GPS: ' + msg);
}

// Haversine formula to calculate distance between two coordinates in km
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(deg) {
    return deg * (Math.PI / 180);
}

function calculateDeliveryFee(distance) {
    if (distance <= CONFIG.freeDeliveryKm) {
        return 0;
    }
    const extraKm = distance - CONFIG.freeDeliveryKm;
    return Math.ceil(extraKm * CONFIG.deliveryFeePerKm);
}

// ==========================================
// ORDER SUBMISSION
// ==========================================
function buildWhatsAppMessage() {
    const name = nameInput.value.trim();
    const district = districtInput.value.trim();
    const address = addressInput.value.trim();
    const specialInst = specialInstructionsInput.value.trim();
    const total = getTotalPrice();

    // Translate order mode
    const modeLabels = {
        surplace: currentLang === 'ar' ? 'في المكان' : 'Sur place',
        emporter: currentLang === 'ar' ? 'للإخذ' : 'À emporter',
        livraison: currentLang === 'ar' ? 'توصيل' : 'Livraison'
    };

    let msg = `🚨 NOUVELLE COMMANDE 🚨\n\n`;
    msg += `👤 Client : ${name}\n`;
    msg += `🏘️ Quartier : ${district}\n`;
    msg += `🛒 Mode : ${modeLabels[orderMode]}\n`;

    if (selectedTable) {
        msg += `💺 Table : Table ${selectedTable}\n`;
    }

    if (address) {
        msg += `📍 Adresse : ${address}\n`;
    }

    if (gpsData) {
        msg += `🗺️ GPS : ${gpsData.link}\n`;
    }

    if (specialInst) {
        msg += `📝 Instructions : ${specialInst}\n`;
    }

    msg += `\n━━━━━━━━━━\n`;
    msg += `🧾 Détails :\n`;

    Object.values(cart).forEach(item => {
        msg += `${item.displayName || item.name} × ${item.qty} — ${item.price * item.qty} MAD\n`;
    });

    msg += `━━━━━━━━━━\n`;

    // If delivery, include delivery fee
    if (orderMode === 'livraison' && gpsData && gpsData.fee !== undefined) {
        msg += `🚚 Frais de livraison : ${gpsData.fee} MAD\n`;
        msg += `💳 TOTAL GÉNÉRAL : ${total + gpsData.fee} MAD\n`;
    } else {
        msg += `💰 TOTAL : ${total} MAD\n`;
    }

    msg += `━━━━━━━━━━\n\n`;
    msg += `Merci pour votre commande ! 🙏`;

    return encodeURIComponent(msg);
}

function sendOrder(e) {
    e.preventDefault();
    if (!isShopOpen) return;

    // Check if cart is empty
    if (getTotalItems() === 0) {
        showToast('⚠️ Votre panier est vide');
        return;
    }

    // Disable button to prevent double submission
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<div class="spinner" style="width:18px;height:18px;border-width:2px;"></div> Envoi...`;

    const message = buildWhatsAppMessage();
    const phoneNumber = CONFIG.whatsappNumber;
    const url = `https://wa.me/${phoneNumber}?text=${message}`;

    try {
        // Save order to history before clearing
        const orderData = {
            items: Object.values(cart).map(item => ({...item})),
            total: getTotalPrice(),
            mode: orderMode,
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            district: districtInput.value.trim(),
            address: addressInput.value.trim(),
            specialInstructions: specialInstructionsInput.value.trim()
        };
        saveOrderToHistory(orderData);

        // Décrementer les stocks
        Object.values(cart).forEach(cartItem => {
            const category = findCategoryByItemId(cartItem.id);
            if (category) {
                const menuItem = MENU[category].items.find(i => i.id === cartItem.id);
                if (menuItem && menuItem.stock !== undefined) {
                    menuItem.stock = Math.max(0, (menuItem.stock || 0) - cartItem.qty);
                }
            }
        });
        // Sauvegarder MENU modifié dans localStorage
        localStorage.setItem('lacasadepoulet_menu_override', JSON.stringify(MENU));
        // Mettre à jour les cartes des articles commandés (perf: pas besoin de tout rerender)
        orderData.items.forEach(item => {
            updateCardDisplay(item.id);
        });

        // Open WhatsApp
        window.open(url, '_blank');

        // Reset everything
        closeModal();
        clearCart();
    } catch (error) {
        console.error('Order failed:', error);
        showError('Erreur lors de l\'envoi. Réessayez.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }

    // Vider aussi le localStorage complètement après commande
    localStorage.removeItem('lacasadepoulet_cart');
    localStorage.removeItem('lacasadepoulet_pizza_sizes');
    localStorage.removeItem('lacasadepoulet_plat_options');
    localStorage.removeItem('lacasadepoulet_table');
    localStorage.removeItem('lacasadepoulet_order_mode');

    // Reset form
    nameInput.value = '';
    districtInput.value = '';
    addressInput.value = '';
    gpsBtn.classList.remove('success', 'loading', 'error');
    gpsBtn.innerHTML = '<span class="gps-icon">📍</span><span class="gps-text">Partager ma position GPS</span>';
    gpsData = null;

    // Reset table selection
    selectedTable = null;
    document.querySelectorAll('.table-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Reset order mode to default
    orderMode = 'surplace';
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === 'surplace') {
            btn.classList.add('active');
        }
    });

    // Reset table selection and state
    updateTableButtonsState();

    updateAddressOptionalLabel();
    validateForm();

    // Re-enable button after delay
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }, 2000);

    // Show success toast
    showToast('✅ Commande envoyée avec succès !');
}
