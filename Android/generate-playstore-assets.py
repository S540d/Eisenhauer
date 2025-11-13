#!/usr/bin/env python3
"""
Play Store Assets Generator für Eisenhauer Matrix App - Version 2.0
Erstellt Feature Graphic im App-Design-Stil
"""

from PIL import Image, ImageDraw, ImageFont
import os
import sys

# App-Farben (exakt aus style.css)
GRADIENT_START = (102, 126, 234)  # #667eea
GRADIENT_END = (118, 75, 162)     # #764ba2
TEXT_WHITE = (255, 255, 255)
TEXT_DARK = (31, 41, 55)          # #1f2937
CARD_BG = (255, 255, 255)

# Quadranten-Farben (exakt aus App)
Q1_COLOR = (239, 68, 68)    # #ef4444 - Rot - Do!
Q2_COLOR = (16, 185, 129)   # #10b981 - Grün - Schedule!
Q3_COLOR = (245, 158, 11)   # #f59e0b - Orange - Delegate!
Q4_COLOR = (107, 114, 128)  # #6b7280 - Grau - Ignore!


def create_gradient_background(width, height, color_start, color_end):
    """Erstellt einen diagonalen Gradient-Hintergrund wie in der App"""
    base = Image.new('RGB', (width, height), color_start)
    top = Image.new('RGB', (width, height), color_end)

    mask = Image.new('L', (width, height))
    mask_data = []

    for y in range(height):
        for x in range(width):
            # Diagonaler Gradient
            mask_data.append(int(255 * ((x + y) / (width + height))))

    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base


def load_fonts():
    """Lädt Schriftarten oder verwendet Fallback"""
    try:
        # macOS
        return {
            'title': ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 56),
            'subtitle': ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28),
            'matrix_title': ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20),
            'matrix_label': ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 14)
        }
    except:
        try:
            # Linux
            return {
                'title': ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 56),
                'subtitle': ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28),
                'matrix_title': ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20),
                'matrix_label': ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
            }
        except:
            # Fallback
            default = ImageFont.load_default()
            return {
                'title': default,
                'subtitle': default,
                'matrix_title': default,
                'matrix_label': default
            }


def create_feature_graphic():
    """Erstellt die Feature Graphic (1024x500px) im App-Stil"""
    print("📐 Erstelle Feature Graphic (1024x500px) im App-Design...")

    # Canvas erstellen
    width, height = 1024, 500
    img = create_gradient_background(width, height, GRADIENT_START, GRADIENT_END)
    draw = ImageDraw.Draw(img, 'RGBA')

    # Schriftarten laden
    fonts = load_fonts()

    # === LINKE SEITE: Text & Icon ===
    left_section_width = 480

    # App-Icon laden
    icon_path = "../icons/icon-192x192.png"
    icon_size = 70
    if os.path.exists(icon_path):
        try:
            icon = Image.open(icon_path).convert('RGBA')
            icon = icon.resize((icon_size, icon_size), Image.Resampling.LANCZOS)

            # Runde Maske für Icon
            mask = Image.new('L', (icon_size, icon_size), 0)
            mask_draw = ImageDraw.Draw(mask)
            mask_draw.ellipse((0, 0, icon_size, icon_size), fill=255)

            icon_pos = (40, 60)
            img.paste(icon, icon_pos, mask)
        except Exception as e:
            print(f"⚠️ Warnung: Icon konnte nicht geladen werden: {e}")

    # Haupttext: "Eisenhauer" und "Matrix"
    title_x = 130
    title_y = 65

    # "Eisenhauer"
    title_text = "Eisenhauer"
    draw.text((title_x + 2, title_y + 2), title_text, font=fonts['title'], fill=(0, 0, 0, 80))
    draw.text((title_x, title_y), title_text, font=fonts['title'], fill=TEXT_WHITE)

    # "Matrix"
    matrix_text_y = title_y + 48
    draw.text((title_x + 2, matrix_text_y + 2), "Matrix", font=fonts['title'], fill=(0, 0, 0, 80))
    draw.text((title_x, matrix_text_y), "Matrix", font=fonts['title'], fill=TEXT_WHITE)

    # Untertitel
    subtitle_lines = [
        "Prioritäten richtig setzen.",
        "Produktiv arbeiten."
    ]
    subtitle_y = 200
    for i, line in enumerate(subtitle_lines):
        y = subtitle_y + (i * 36)
        draw.text((42, y + 1), line, font=fonts['subtitle'], fill=(0, 0, 0, 70))
        draw.text((40, y), line, font=fonts['subtitle'], fill=(255, 255, 255, 240))

    # === RECHTE SEITE: Matrix-Card ===
    card_x = left_section_width + 50
    card_y = 50
    card_width = 430
    card_height = 400

    # Schatten
    shadow_offset = 6
    draw.rounded_rectangle(
        [card_x + shadow_offset, card_y + shadow_offset,
         card_x + card_width + shadow_offset, card_y + card_height + shadow_offset],
        radius=20,
        fill=(0, 0, 0, 50)
    )

    # Weiße Card
    draw.rounded_rectangle(
        [card_x, card_y, card_x + card_width, card_y + card_height],
        radius=20,
        fill=CARD_BG
    )

    # Matrix Header
    header_text = "Die 4 Quadranten"
    header_bbox = draw.textbbox((0, 0), header_text, font=fonts['matrix_title'])
    header_width = header_bbox[2] - header_bbox[0]
    header_x = card_x + (card_width - header_width) // 2
    header_y = card_y + 25
    draw.text((header_x, header_y), header_text, font=fonts['matrix_title'], fill=TEXT_DARK)

    # 2x2 Matrix
    matrix_padding = 25
    matrix_top = card_y + 70
    quadrant_width = (card_width - matrix_padding * 3) // 2
    quadrant_height = (card_height - 90 - matrix_padding * 3) // 2

    # Quadranten-Daten
    quadrants = [
        (Q1_COLOR, "Do!", "Dringend &\nWichtig"),
        (Q2_COLOR, "Schedule!", "Nicht dringend\n& Wichtig"),
        (Q3_COLOR, "Delegate!", "Dringend &\nNicht wichtig"),
        (Q4_COLOR, "Ignore!", "Weder dringend\nnoch wichtig")
    ]

    positions = [
        (card_x + matrix_padding, matrix_top),  # Top-left
        (card_x + matrix_padding * 2 + quadrant_width, matrix_top),  # Top-right
        (card_x + matrix_padding, matrix_top + quadrant_height + matrix_padding),  # Bottom-left
        (card_x + matrix_padding * 2 + quadrant_width, matrix_top + quadrant_height + matrix_padding)  # Bottom-right
    ]

    for (color, title, description), (x, y) in zip(quadrants, positions):
        # Farbiger Quadrant
        draw.rounded_rectangle(
            [x, y, x + quadrant_width, y + quadrant_height],
            radius=12,
            fill=color
        )

        # Titel (z.B. "Do!")
        title_bbox = draw.textbbox((0, 0), title, font=fonts['matrix_title'])
        title_w = title_bbox[2] - title_bbox[0]
        title_x = x + (quadrant_width - title_w) // 2
        title_y = y + 20

        # Titel mit Schatten
        draw.text((title_x + 1, title_y + 1), title, font=fonts['matrix_title'], fill=(0, 0, 0, 70))
        draw.text((title_x, title_y), title, font=fonts['matrix_title'], fill=TEXT_WHITE)

        # Beschreibung (mehrzeilig, zentriert)
        desc_lines = description.split('\n')
        desc_y = y + 50

        for line in desc_lines:
            line_bbox = draw.textbbox((0, 0), line, font=fonts['matrix_label'])
            line_w = line_bbox[2] - line_bbox[0]
            line_x = x + (quadrant_width - line_w) // 2

            # Vermeidung von Überlauf: Text kürzen falls zu lang
            if line_w > quadrant_width - 10:
                # Text ist zu lang, kürze ihn
                while line_w > quadrant_width - 10 and len(line) > 0:
                    line = line[:-1]
                    line_bbox = draw.textbbox((0, 0), line, font=fonts['matrix_label'])
                    line_w = line_bbox[2] - line_bbox[0]
                    line_x = x + (quadrant_width - line_w) // 2

            # Mit Schatten
            draw.text((line_x + 1, desc_y + 1), line, font=fonts['matrix_label'], fill=(0, 0, 0, 50))
            draw.text((line_x, desc_y), line, font=fonts['matrix_label'], fill=(255, 255, 255, 230))
            desc_y += 20

    # Speichern
    output_path = "playstore-assets/feature-graphic.png"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG", quality=95)
    print(f"✅ Feature Graphic erstellt: {output_path}")
    return output_path


def create_app_icon():
    """Erstellt das App-Icon für Play Store (512x512px)"""
    print("📱 Erstelle App-Icon (512x512px)...")

    icon_path = "../icons/icon-512x512.png"
    if os.path.exists(icon_path):
        icon = Image.open(icon_path)
        icon = icon.resize((512, 512), Image.Resampling.LANCZOS)

        output_path = "playstore-assets/app-icon-512.png"
        icon.save(output_path, "PNG", quality=95)
        print(f"✅ App-Icon erstellt: {output_path}")
        return output_path
    else:
        print(f"⚠️ Icon nicht gefunden: {icon_path}")
        return None


def create_readme():
    """Erstellt eine README mit Anweisungen"""
    readme_content = """# Play Store Assets

## 📐 Generierte Dateien

### ✅ Feature Graphic (feature-graphic.png)
- **Größe:** 1024 x 500 px
- **Stil:** App-Design mit Gradient-Hintergrund
- **Enthält:** App-Name, Icon und 4 Quadranten-Visualisierung

### ✅ App-Icon (app-icon-512.png)
- **Größe:** 512 x 512 px
- **Verwendung:** Store Listing Icon

## 📸 Screenshots erstellen

### Methode: Browser Developer Tools (Empfohlen)

1. **App öffnen:**
   - Gehe zu https://s540d.github.io/Eisenhauer/

2. **Developer Tools:**
   - Chrome/Edge: F12 oder Cmd+Opt+I (Mac)
   - Device Toolbar: Cmd+Shift+M
   - Gerät: iPhone 14 Pro Max (oder Custom: 1080 x 1920)

3. **Beispiel-Aufgaben hinzufügen:**
   - **Do!**: "Quartalsbericht fertigstellen", "Kundenpräsentation vorbereiten"
   - **Schedule!**: "Neue Programmiersprache lernen", "Jahresplanung erstellen"
   - **Delegate!**: "E-Mails beantworten", "Meeting-Protokoll schreiben"
   - **Ignore!**: "Social Media durchscrollen"

4. **Screenshot erstellen:**
   - Cmd+Shift+P → "Capture screenshot" eingeben
   - Oder Rechtsklick im Viewport → "Screenshot erstellen"

5. **Für Dark Mode:**
   - System Dark Mode aktivieren
   - Seite neu laden
   - Zweiten Screenshot machen

### Benötigte Screenshots (min. 2, max. 8)

1. **Hauptansicht mit allen Quadranten** (PFLICHT)
2. **Dark Mode** (EMPFOHLEN)
3. Optional: Aufgabe hinzufügen, Wiederkehrende Aufgaben

## 🎨 Assets neu generieren

```bash
cd Android
python3 generate-playstore-assets.py
```

## 📤 Upload zum Play Store

1. Öffne [Google Play Console](https://play.google.com/console/)
2. Wähle deine App
3. Gehe zu "Store-Präsenz" → "Store-Eintrag"
4. Lade hoch:
   - Feature Graphic: `feature-graphic.png`
   - App-Icon: `app-icon-512.png`
   - Screenshots: Deine erstellten Screenshots

---

**Letzte Generierung:** Automatisch erstellt
"""

    output_path = "playstore-assets/README.md"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(readme_content)
    print(f"✅ README erstellt: {output_path}")


def main():
    print("=" * 60)
    print("🎨 Play Store Assets Generator v2.0 - Eisenhauer Matrix")
    print("=" * 60)
    print()

    # Prüfe Verzeichnis
    if not os.path.exists("../icons"):
        print("❌ Fehler: Icons-Verzeichnis nicht gefunden!")
        print("   Führe das Script aus dem Android/ Verzeichnis aus:")
        print("   cd Android && python3 generate-playstore-assets.py")
        sys.exit(1)

    created_files = []

    # 1. Feature Graphic
    try:
        path = create_feature_graphic()
        created_files.append(("Feature Graphic", path, "✅"))
    except Exception as e:
        print(f"❌ Fehler beim Erstellen der Feature Graphic: {e}")
        import traceback
        traceback.print_exc()
        created_files.append(("Feature Graphic", None, "❌"))

    print()

    # 2. App-Icon
    try:
        path = create_app_icon()
        if path:
            created_files.append(("App-Icon", path, "✅"))
        else:
            created_files.append(("App-Icon", None, "⚠️"))
    except Exception as e:
        print(f"❌ Fehler beim Erstellen des App-Icons: {e}")
        created_files.append(("App-Icon", None, "❌"))

    print()

    # 3. README
    try:
        create_readme()
        created_files.append(("README", "playstore-assets/README.md", "✅"))
    except Exception as e:
        print(f"❌ Fehler beim Erstellen der README: {e}")

    print()
    print("=" * 60)
    print("📊 Zusammenfassung")
    print("=" * 60)

    for name, path, status in created_files:
        if path:
            print(f"{status} {name:25} → {path}")
        else:
            print(f"{status} {name:25} → Fehler")

    print()
    print("=" * 60)
    print("✅ Fertig!")
    print("=" * 60)
    print()
    print("📍 Nächste Schritte:")
    print("   1. Prüfe die generierten Dateien: open playstore-assets/")
    print("   2. Erstelle Screenshots (siehe playstore-assets/README.md)")
    print("   3. Lade alle Assets in die Play Console hoch")
    print()


if __name__ == "__main__":
    main()
