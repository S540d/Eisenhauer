# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# ---------------------------------------------------------------------------
# TWA entry points
# ---------------------------------------------------------------------------
# MainActivity extends LauncherActivity and is referenced from AndroidManifest.
# AGP keeps manifest-declared components automatically; this is explicit because
# the class name is also part of the published app's public surface.
-keep class com.sven4321.eisenhauer.MainActivity { *; }

# androidbrowserhelper resolves the TWA launcher and its callbacks partly via
# reflection, so its classes stay fully kept. This is a small library; unlike
# the blanket androidx rule below it does not meaningfully block optimization.
-keep class com.google.androidbrowserhelper.** { *; }

# CustomTabsService/CustomTabsCallback are bound across process boundaries and
# resolved by name, so androidx.browser stays kept even though the AAR ships
# consumer rules.
-keep class androidx.browser.** { *; }

# ---------------------------------------------------------------------------
# Attributes
# ---------------------------------------------------------------------------
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exception

# ---------------------------------------------------------------------------
# AndroidX (Issue #367)
# ---------------------------------------------------------------------------
# NOTE: `-keep class androidx.** { *; }` was removed here.
#
# That rule protected every class and every member of AndroidX from shrinking,
# optimization and obfuscation. Since AndroidX makes up the bulk of this TWA's
# code, it left R8 with almost nothing to remove or inline — which is why the
# Play Console reported that R8 optimization was not taking effect.
#
# It was also redundant: AndroidX AARs ship their own consumer ProGuard rules
# (`proguard.txt`), which AGP applies automatically. The entry points this app
# actually needs are covered by the targeted rules above.
#
# Do NOT reintroduce a blanket androidx keep to silence a crash. If something
# breaks at runtime, add a narrow rule for the specific class instead.

# TODO(#367): narrow this once a clean release build shows which warnings are
# actually emitted. Kept broad for now so the build does not fail on unrelated
# missing-class warnings from transitive dependencies.
-dontwarn androidx.**

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
# Remove logging in release builds
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}
