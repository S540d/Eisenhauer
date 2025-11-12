package com.sven4321.eisenhauer;

import android.net.Uri;
import android.os.Bundle;

import androidx.browser.trusted.TrustedWebActivityIntentBuilder;
import com.google.androidbrowserhelper.trusted.TwaLauncher;

/**
 * Main Activity for Eisenhauer Matrix TWA
 *
 * This activity launches the PWA (https://s540d.github.io/Eisenhauer/)
 * as a Trusted Web Activity using Chrome Custom Tabs.
 */
public class MainActivity extends com.google.androidbrowserhelper.trusted.LauncherActivity {

    // PWA URL - Change this if PWA moves to custom domain
    private static final String PWA_URL = "https://s540d.github.io/Eisenhauer/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected Uri getLaunchingUrl() {
        return Uri.parse(PWA_URL);
    }
}
