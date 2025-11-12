# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# Keep TWA classes
-keep class com.google.androidbrowserhelper.** { *; }
-keep class androidx.browser.** { *; }

# Keep MainActivity
-keep class com.sven4321.eisenhauer.MainActivity { *; }

# Keep standard Android classes
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exception

# AndroidX
-dontwarn androidx.**
-keep class androidx.** { *; }

# Remove logging in release builds
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}
