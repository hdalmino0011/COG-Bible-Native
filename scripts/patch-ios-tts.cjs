const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

const patchedSwiftContent = `import Foundation
import Capacitor
import AVFoundation

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(TextToSpeechPlugin)
public class TextToSpeechPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "TextToSpeechPlugin"
    public let jsName = "TextToSpeech"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "speak", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openInstall", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getSupportedLanguages", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getSupportedVoices", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isLanguageSupported", returnType: CAPPluginReturnPromise)
    ]
    private static let errorUnsupportedLanguage = "This language is not supported."

    private let implementation = TextToSpeech()

    @objc public func speak(_ call: CAPPluginCall) {
        let text = call.getString("text", "")
        let lang = call.getString("lang", "en-US")
        let rate = call.getFloat("rate", 1.0)
        let pitch = call.getFloat("pitch", 1.0)
        let volume = call.getFloat("volume", 1.0)
        let voice = call.getInt("voice", -1)
        let category = call.getString("category", "ambient")
        let queueStrategy = call.getInt("queueStrategy", 0)

        let isLanguageSupported = implementation.isLanguageSupported(lang)
        guard isLanguageSupported else {
            call.resolve()
            return
        }

        do {
            try implementation.speak(text, lang, rate, pitch, category, volume, voice, queueStrategy, call)
        } catch {
            call.resolve()
        }
    }

    @objc public func stop(_ call: CAPPluginCall) {
        implementation.stop()
        call.resolve()
    }

    @objc public func openInstall(_ call: CAPPluginCall) {
        call.resolve()
    }

    @objc func getSupportedLanguages(_ call: CAPPluginCall) {
        let languages = self.implementation.getSupportedLanguages()
        call.resolve([
            "languages": languages
        ])
    }

    @objc func getSupportedVoices(_ call: CAPPluginCall) {
        let allVoices = AVSpeechSynthesisVoice.speechVoices()
        var res: [[String: Any]] = []

        for voice in allVoices {
            let lang = [
                "default": false,
                "lang": voice.language,
                "localService": true,
                "name": voice.name,
                "voiceURI": voice.identifier
            ] as [String: Any]
            res.append(lang)
        }

        call.resolve([
            "voices": res
        ])
    }

    @objc func isLanguageSupported(_ call: CAPPluginCall) {
        let lang = call.getString("lang", "")
        let isLanguageSupported = self.implementation.isLanguageSupported(lang)
        call.resolve([
            "supported": isLanguageSupported
        ])
    }
}
`;

function findAndPatchFiles(dir, fileName) {
  let patchedCount = 0;
  if (!fs.existsSync(dir)) return 0;

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== '.git') {
          patchedCount += findAndPatchFiles(fullPath, fileName);
        }
      } else if (entry.isFile() && entry.name === fileName) {
        fs.writeFileSync(fullPath, patchedSwiftContent, 'utf8');
        console.log(`[patch-ios-tts] Successfully patched ${fullPath}`);
        patchedCount++;
      }
    }
  } catch (err) {
    // Ignore read errors
  }
  return patchedCount;
}

const defaultPath = path.resolve(
  projectRoot,
  'node_modules/@capacitor-community/text-to-speech/ios/Sources/TextToSpeechPlugin/TextToSpeechPlugin.swift'
);

let totalPatched = 0;
if (fs.existsSync(defaultPath)) {
  fs.writeFileSync(defaultPath, patchedSwiftContent, 'utf8');
  console.log(`[patch-ios-tts] Successfully patched ${defaultPath}`);
  totalPatched++;
}

// Also check node_modules, build, and ios directories
const searchDirs = [
  path.join(projectRoot, 'node_modules/@capacitor-community'),
  path.join(projectRoot, 'ios'),
  path.join(projectRoot, 'build')
];

for (const d of searchDirs) {
  totalPatched += findAndPatchFiles(d, 'TextToSpeechPlugin.swift');
}

console.log(`[patch-ios-tts] Completed. Total TextToSpeechPlugin.swift files patched: ${totalPatched}`);
