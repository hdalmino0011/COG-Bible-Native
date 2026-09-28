const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

// --- 1. Patched TextToSpeechPlugin.swift ---
const patchedTtsSwiftContent = `import Foundation
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

// --- 2. Patched LocalNotificationsHandler.swift ---
const patchedLnotHandlerSwiftContent = `import Foundation
import Capacitor
import UserNotifications

public class LocalNotificationsHandler: NSObject, NotificationHandlerProtocol {
    public weak var plugin: CAPPlugin?

    public func requestPermissions(with completion: ((Bool, Error?) -> Void)? = nil) {
        let center = UNUserNotificationCenter.current()
        center.requestAuthorization(options: [.badge, .alert, .sound]) { (granted, error) in
            completion?(granted, error)
        }
    }

    public func checkPermissions(with completion: ((UNAuthorizationStatus) -> Void)? = nil) {
        let center = UNUserNotificationCenter.current()
        center.getNotificationSettings { settings in
            completion?(settings.authorizationStatus)
        }
    }

    public func willPresent(notification: UNNotification) -> UNNotificationPresentationOptions {
        if #available(iOS 14.0, *) {
            return [.badge, .sound, .banner, .list]
        } else {
            return [.badge, .sound, .alert]
        }
    }

    public func didReceive(response: UNNotificationResponse) {
        var data: [String: Any] = [
            "actionId": response.actionIdentifier
        ]
        var notificationData: [String: Any] = [
            "id": response.notification.request.identifier,
            "title": response.notification.request.content.title,
            "body": response.notification.request.content.body
        ]
        let extra = response.notification.request.content.userInfo
        notificationData["extra"] = extra
        data["notification"] = notificationData
        self.plugin?.notifyListeners("localNotificationActionPerformed", data: data)
    }
}
`;

// --- 3. Patched LocalNotificationsPlugin.swift ---
const patchedLnotPluginSwiftContent = `import Foundation
import Capacitor
import UserNotifications

@objc(LocalNotificationsPlugin)
public class LocalNotificationsPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "LocalNotificationsPlugin"
    public let jsName = "LocalNotifications"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "schedule", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "update", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestPermissions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "checkPermissions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "checkExactNotificationSetting", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "changeExactNotificationSetting", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "cancel", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "cancelAll", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getPending", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getByIds", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getAll", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "registerActionTypes", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "areEnabled", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getDeliveredNotifications", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "removeAllDeliveredNotifications", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "removeDeliveredNotifications", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "removeDeliveredNotificationsById", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "createChannel", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "deleteChannel", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "listChannels", returnType: CAPPluginReturnPromise)
    ]

    private let handler = LocalNotificationsHandler()

    override public func load() {
        self.bridge?.notificationRouter.localNotificationHandler = self.handler
        self.handler.plugin = self
    }

    @objc override public func checkPermissions(_ call: CAPPluginCall) {
        handler.checkPermissions { status in
            let display: String
            switch status {
            case .authorized, .provisional, .ephemeral:
                display = "granted"
            case .denied:
                display = "denied"
            default:
                display = "prompt"
            }
            call.resolve(["display": display])
        }
    }

    @objc override public func requestPermissions(_ call: CAPPluginCall) {
        handler.requestPermissions { granted, _ in
            let display = granted ? "granted" : "denied"
            call.resolve(["display": display])
        }
    }

    @objc public func schedule(_ call: CAPPluginCall) {
        let center = UNUserNotificationCenter.current()
        let notifs = call.getArray("notifications", []) as? [[String: Any]] ?? []

        for notif in notifs {
            let content = UNMutableNotificationContent()
            content.title = notif["title"] as? String ?? ""
            content.body = notif["body"] as? String ?? ""
            content.sound = UNNotificationSound.default

            if let extra = notif["extra"] as? [String: Any] {
                content.userInfo = extra
            }

            let id = "\\(notif["id"] ?? UUID().uuidString)"
            let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
            let request = UNNotificationRequest(identifier: id, content: content, trigger: trigger)

            center.add(request) { _ in }
        }

        call.resolve([
            "notifications": notifs.map { ["id": "\\($0["id"] ?? "")"] }
        ])
    }

    @objc public func update(_ call: CAPPluginCall) {
        schedule(call)
    }

    @objc public func cancel(_ call: CAPPluginCall) {
        let center = UNUserNotificationCenter.current()
        let notifs = call.getArray("notifications", []) as? [[String: Any]] ?? []
        var ids: [String] = []
        for notif in notifs {
            if let id = notif["id"] {
                ids.append("\\(id)")
            }
        }
        if !ids.isEmpty {
            center.removePendingNotificationRequests(withIdentifiers: ids)
        }
        call.resolve()
    }

    @objc public func cancelAll(_ call: CAPPluginCall) {
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
        call.resolve()
    }

    @objc public func getPending(_ call: CAPPluginCall) {
        UNUserNotificationCenter.current().getPendingNotificationRequests { requests in
            let notifications = requests.map { req -> [String: Any] in
                return [
                    "id": req.identifier,
                    "title": req.content.title,
                    "body": req.content.body,
                    "extra": req.content.userInfo
                ]
            }
            call.resolve(["notifications": notifications])
        }
    }

    @objc public func getByIds(_ call: CAPPluginCall) {
        call.resolve(["notifications": []])
    }

    @objc public func getAll(_ call: CAPPluginCall) {
        getPending(call)
    }

    @objc public func registerActionTypes(_ call: CAPPluginCall) {
        call.resolve()
    }

    @objc public func areEnabled(_ call: CAPPluginCall) {
        handler.checkPermissions { status in
            call.resolve(["value": status == .authorized || status == .provisional])
        }
    }

    @objc public func getDeliveredNotifications(_ call: CAPPluginCall) {
        UNUserNotificationCenter.current().getDeliveredNotifications { notifications in
            let res = notifications.map { notif -> [String: Any] in
                return [
                    "id": notif.request.identifier,
                    "title": notif.request.content.title,
                    "body": notif.request.content.body
                ]
            }
            call.resolve(["notifications": res])
        }
    }

    @objc public func removeAllDeliveredNotifications(_ call: CAPPluginCall) {
        UNUserNotificationCenter.current().removeAllDeliveredNotifications()
        call.resolve()
    }

    @objc public func removeDeliveredNotifications(_ call: CAPPluginCall) {
        removeAllDeliveredNotifications(call)
    }

    @objc public func removeDeliveredNotificationsById(_ call: CAPPluginCall) {
        removeAllDeliveredNotifications(call)
    }

    @objc public func checkExactNotificationSetting(_ call: CAPPluginCall) {
        call.resolve(["exactAlarmSetting": "exact"])
    }

    @objc public func changeExactNotificationSetting(_ call: CAPPluginCall) {
        call.resolve(["exactAlarmSetting": "exact"])
    }

    @objc public func createChannel(_ call: CAPPluginCall) {
        call.resolve()
    }

    @objc public func deleteChannel(_ call: CAPPluginCall) {
        call.resolve()
    }

    @objc public func listChannels(_ call: CAPPluginCall) {
        call.resolve(["channels": []])
    }
}
`;

function findAndPatchFiles(dir, fileName, content) {
  let patchedCount = 0;
  if (!fs.existsSync(dir)) return 0;

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== '.git') {
          patchedCount += findAndPatchFiles(fullPath, fileName, content);
        }
      } else if (entry.isFile() && entry.name === fileName) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`[patch-ios] Successfully patched ${fullPath}`);
        patchedCount++;
      }
    }
  } catch (err) {
    // Ignore read errors
  }
  return patchedCount;
}

const targets = [
  { name: 'TextToSpeechPlugin.swift', content: patchedTtsSwiftContent },
  { name: 'LocalNotificationsHandler.swift', content: patchedLnotHandlerSwiftContent },
  { name: 'LocalNotificationsPlugin.swift', content: patchedLnotPluginSwiftContent }
];

const searchDirs = [
  path.join(projectRoot, 'node_modules/@capacitor-community'),
  path.join(projectRoot, 'node_modules/@capacitor'),
  path.join(projectRoot, 'ios'),
  path.join(projectRoot, 'build')
];

let totalPatched = 0;
for (const target of targets) {
  for (const d of searchDirs) {
    totalPatched += findAndPatchFiles(d, target.name, target.content);
  }
}

console.log(`[patch-ios] Completed. Total iOS plugin files patched: ${totalPatched}`);
