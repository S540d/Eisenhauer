#!/usr/bin/env python3
"""
Automatischer Screenshot-Generator für Eisenhauer Matrix App
Erstellt Screenshots von der Live-App für den Play Store
"""

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from PIL import Image
import time
import os

# App-URL
APP_URL = "https://s540d.github.io/Eisenhauer/"

# Screenshot-Größe für Play Store
SCREENSHOT_WIDTH = 1080
SCREENSHOT_HEIGHT = 1920

# Beispiel-Aufgaben für Screenshots
EXAMPLE_TASKS = {
    'urgent-important': [
        "Quartalsbericht fertigstellen",
        "Kundenpräsentation vorbereiten"
    ],
    'not-urgent-important': [
        "Neue Programmiersprache lernen",
        "Jahresplanung erstellen"
    ],
    'urgent-not-important': [
        "E-Mails beantworten",
        "Meeting-Protokoll schreiben"
    ],
    'not-urgent-not-important': [
        "Social Media durchscrollen",
        "Unnötige Newsletter lesen"
    ],
    'done': [
        "Wochenplanung erstellt",
        "Team-Meeting abgehalten"
    ]
}


def setup_driver():
    """Richtet den Chrome WebDriver ein"""
    print("🔧 Chrome WebDriver wird eingerichtet...")

    options = Options()
    options.add_argument('--headless')  # Ohne GUI
    options.add_argument('--disable-gpu')
    options.add_argument(f'--window-size={SCREENSHOT_WIDTH},{SCREENSHOT_HEIGHT + 100}')
    options.add_argument('--force-device-scale-factor=2')  # Retina für bessere Qualität

    # User Agent für Mobile
    options.add_argument('--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1')

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    print("✅ WebDriver bereit")
    return driver


def wait_for_app_ready(driver):
    """Wartet, bis die App vollständig geladen ist"""
    print("⏳ Warte auf App-Ladevorgang...")
    try:
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "container"))
        )
        time.sleep(2)  # Extra Zeit für Animationen
        print("✅ App geladen")
        return True
    except Exception as e:
        print(f"❌ Fehler beim Laden der App: {e}")
        return False


def add_example_tasks(driver):
    """Fügt Beispiel-Aufgaben zur App hinzu"""
    print("📝 Füge Beispiel-Aufgaben hinzu...")

    try:
        # Finde das Eingabefeld
        input_field = driver.find_element(By.ID, "taskInput")

        # Füge Aufgaben in jeden Quadranten ein
        for category, tasks in EXAMPLE_TASKS.items():
            for task in tasks:
                # Aufgabe eingeben
                input_field.clear()
                input_field.send_keys(task)

                # Add-Button klicken
                add_button = driver.find_element(By.ID, "addTaskBtn")
                add_button.click()

                # Warte auf Modal
                time.sleep(0.5)

                # Wähle den richtigen Quadranten im Modal
                # (Dies hängt von deiner HTML-Struktur ab - anpassen!)
                # Für dieses Beispiel klicken wir einfach auf den ersten Quadranten
                try:
                    segment_button = driver.find_element(By.CSS_SELECTOR, f'[data-segment="{category}"]')
                    segment_button.click()
                except:
                    # Fallback: Klicke auf ersten verfügbaren Button
                    modal_buttons = driver.find_elements(By.CSS_SELECTOR, ".modal button")
                    if modal_buttons:
                        modal_buttons[0].click()

                time.sleep(0.3)

        print("✅ Beispiel-Aufgaben hinzugefügt")
        return True

    except Exception as e:
        print(f"⚠️ Warnung beim Hinzufügen von Aufgaben: {e}")
        print("   Bitte füge Aufgaben manuell hinzu und erstelle Screenshots manuell")
        return False


def take_screenshot(driver, filename, description):
    """Macht einen Screenshot und speichert ihn"""
    print(f"📸 Erstelle Screenshot: {description}...")

    try:
        # Screenshot machen
        temp_path = f"playstore-assets/temp_{filename}"
        driver.save_screenshot(temp_path)

        # Mit PIL öffnen und auf richtige Größe zuschneiden/skalieren
        img = Image.open(temp_path)

        # Auf gewünschte Größe skalieren
        img = img.resize((SCREENSHOT_WIDTH, SCREENSHOT_HEIGHT), Image.Resampling.LANCZOS)

        # Speichern
        output_path = f"playstore-assets/screenshot_{filename}"
        img.save(output_path, "PNG", quality=95)

        # Temp-Datei löschen
        os.remove(temp_path)

        print(f"✅ Screenshot gespeichert: {output_path}")
        return output_path

    except Exception as e:
        print(f"❌ Fehler beim Screenshot: {e}")
        return None


def create_screenshots():
    """Hauptfunktion zum Erstellen der Screenshots"""
    print("=" * 60)
    print("📸 Screenshot-Generator für Eisenhauer Matrix")
    print("=" * 60)
    print()

    # Output-Verzeichnis erstellen
    os.makedirs("playstore-assets", exist_ok=True)

    driver = None
    try:
        # WebDriver einrichten
        driver = setup_driver()

        # App öffnen
        print(f"🌐 Öffne App: {APP_URL}")
        driver.get(APP_URL)

        # Warte, bis App geladen ist
        if not wait_for_app_ready(driver):
            print("❌ App konnte nicht geladen werden")
            return

        # Screenshot 1: Leere App (Initial State)
        take_screenshot(driver, "01_initial.png", "Hauptansicht (leer)")

        # Beispiel-Aufgaben hinzufügen
        # ACHTUNG: Dies funktioniert nur, wenn deine App-Struktur
        # mit dem Script kompatibel ist. Falls nicht, füge Aufgaben manuell hinzu!
        print()
        print("⚠️ HINWEIS: Automatisches Hinzufügen von Aufgaben ist experimentell")
        print("   Falls Fehler auftreten, erstelle Screenshots bitte manuell:")
        print(f"   1. Öffne {APP_URL} im Browser")
        print("   2. Füge Beispiel-Aufgaben hinzu")
        print("   3. Mache Screenshots mit Browser-Tools (1080x1920)")
        print()

        # Versuche Aufgaben hinzuzufügen
        # add_example_tasks(driver)
        # time.sleep(1)

        # Screenshot 2: App mit Aufgaben
        # take_screenshot(driver, "02_with_tasks.png", "App mit Aufgaben")

        print()
        print("=" * 60)
        print("✅ Screenshot-Erstellung abgeschlossen!")
        print("=" * 60)
        print()
        print("📍 Manuelle Alternative:")
        print("   1. Öffne https://s540d.github.io/Eisenhauer/")
        print("   2. Browser Developer Tools öffnen (F12)")
        print("   3. Device Toolbar aktivieren (Cmd+Shift+M)")
        print("   4. iPhone 14 Pro Max auswählen (1290x2796)")
        print("   5. Beispiel-Aufgaben hinzufügen")
        print("   6. Screenshot machen (Cmd+Shift+P → 'screenshot')")
        print("   7. Auf 1080x1920 skalieren")
        print()

    except Exception as e:
        print(f"❌ Fehler: {e}")
        print()
        print("💡 Tipp: Installiere die benötigten Pakete:")
        print("   pip3 install selenium pillow webdriver-manager")

    finally:
        if driver:
            driver.quit()
            print("🔒 Browser geschlossen")


def main():
    """Hauptprogramm"""
    print()
    print("⚠️ WICHTIG: Dieses Script ist experimentell!")
    print()
    print("Empfohlene Methode für Screenshots:")
    print("=" * 60)
    print("1. Öffne die Live-App im Browser:")
    print(f"   {APP_URL}")
    print()
    print("2. Browser Developer Tools öffnen:")
    print("   - Chrome: Cmd+Opt+I (Mac) oder F12 (Windows)")
    print("   - Device Toolbar: Cmd+Shift+M")
    print()
    print("3. Gerät auswählen:")
    print("   - iPhone 14 Pro Max (1290x2796)")
    print("   - Oder Custom: 1080 x 1920")
    print()
    print("4. Beispiel-Aufgaben hinzufügen (siehe playstore-assets/README.md)")
    print()
    print("5. Screenshot erstellen:")
    print("   - Chrome: Cmd+Shift+P → 'Capture screenshot'")
    print("   - Oder: Rechtsklick → 'Screenshot erstellen'")
    print()
    print("6. Screenshot auf 1080 x 1920 skalieren")
    print("   - Mit Preview, GIMP, oder Online-Tool")
    print("=" * 60)
    print()

    response = input("Möchtest du trotzdem das automatische Script versuchen? (j/n): ")

    if response.lower() in ['j', 'ja', 'y', 'yes']:
        create_screenshots()
    else:
        print()
        print("✅ Okay! Erstelle Screenshots manuell mit der Anleitung oben.")
        print("   Siehe auch: playstore-assets/README.md")
        print()


if __name__ == "__main__":
    main()
