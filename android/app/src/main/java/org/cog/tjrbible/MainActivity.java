package org.cog.tjrbible;

import android.graphics.Color;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    static {
        try {
            System.loadLibrary("smooth_engine");
        } catch (Throwable ignored) {
            // Graceful fallback if native library is absent
        }
    }

    public static native boolean nativeInitPerformanceEngine();
    public static native boolean nativeFastSearch(String text, String query);
    public static native void nativeOptimizeMemory();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        if (getWindow() != null) {
            getWindow().setStatusBarColor(Color.BLACK);
            getWindow().setNavigationBarColor(Color.BLACK);
            getWindow().setBackgroundDrawableResource(android.R.color.black);
        }
        super.onCreate(savedInstanceState);
        try {
            try {
                nativeInitPerformanceEngine();
            } catch (Throwable ignored) {}

            WebView webView = getBridge().getWebView();
            if (webView != null) {
                webView.setBackgroundColor(Color.BLACK);
                WebSettings settings = webView.getSettings();
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);
                settings.setRenderPriority(WebSettings.RenderPriority.HIGH);
                settings.setCacheMode(WebSettings.LOAD_DEFAULT);
                webView.setLayerType(WebView.LAYER_TYPE_HARDWARE, null);
            }
        } catch (Exception ignored) {
        }
    }
}

