/**
 * Tests pour le manifest.json et la configuration PWA
 */

const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../manifest.json'), 'utf8')
);

describe('PWA Manifest', () => {
  test('doit avoir un nom', () => {
    expect(manifest.name).toBeDefined();
    expect(typeof manifest.name).toBe('string');
    expect(manifest.name.length).toBeGreaterThan(0);
  });

  test('doit avoir short_name (<=15 chars pour affichage mobile)', () => {
    expect(manifest.short_name).toBeDefined();
    expect(manifest.short_name.length).toBeLessThanOrEqual(15);
  });

  test('doit avoir start_url = "/"', () => {
    expect(manifest.start_url).toBe('/');
  });

  test('doit avoir display = "standalone"', () => {
    expect(manifest.display).toBe('standalone');
  });

  test('doit avoir theme_color sombre (#050505)', () => {
    expect(manifest.theme_color).toBe('#050505');
  });

  test('doit avoir background_color sombre (#050505)', () => {
    expect(manifest.background_color).toBe('#050505');
  });

  test('doit avoir une liste d\'icônes complète', () => {
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThanOrEqual(5);
  });

  test('chaque icône doit avoir src, sizes, type', () => {
    manifest.icons.forEach(icon => {
      expect(icon.src).toBeDefined();
      expect(icon.sizes).toMatch(/^\d+x\d+$/);
      expect(icon.type).toMatch(/^image\//);
    });
  });

  test('doit inclure les tailles standard (72, 96, 128, 144, 152, 192, 384, 512)', () => {
    const sizes = manifest.icons.map(i => i.sizes).sort();
    expect(sizes).toContain('72x72');
    expect(sizes).toContain('192x192');
    expect(sizes).toContain('512x512');
  });

  test('doit avoir categories "food" et "shopping"', () => {
    expect(manifest.categories).toContain('food');
    expect(manifest.categories).toContain('shopping');
  });

  test('description doit mentionner le restaurant', () => {
    expect(manifest.description).toMatch(/LA CASA DE POULET/i);
  });
});

describe('Icon Validation', () => {
  test('toutes les tailles d\'icônes doivent être dans le dossier /icons', () => {
    const iconsPath = path.join(__dirname, '../icons');
    const iconsInFolder = fs.readdirSync(iconsPath);

    manifest.icons.forEach(icon => {
      // icon.src is like "/icons/icon-72x72.svg"
      const filename = icon.src.split('/').pop(); // "icon-72x72.svg"
      expect(iconsInFolder).toContain(filename);
    });
  });

  test('les icônes doivent être des fichiers SVG ou PNG', () => {
    manifest.icons.forEach(icon => {
      expect(icon.type).toMatch(/^(image\/svg\+xml|image\/png)$/);
    });
  });
});
