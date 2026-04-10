# 🚀 Finkar ➔ Google Play Store Blueprint

I have pushed the required icons, manifest, and security files to your GitHub. You are now ready to generate your Android App Bundle (`.aab`) for the Play Store.

Follow these **4 Steps** exactly in your terminal:

---

### Step 1: Install the Android Build Tool
First, install **Bubblewrap**, the official Google-recommended tool for PWA-to-Android conversion.
```bash
npm i -g @bubblewrap/cli
```

### Step 2: Initialize the Android Project
Run this command to start the configuration. It will pull your updated manifest directly from the web.
```bash
bubblewrap init --manifest=https://getfinkar.com/manifest.json
```
> [!IMPORTANT]
> **During Init**: It will ask you for a **Package Name**. I recommend `com.getfinkar.app`.
> It will also ask to generate a **Signing Key**. Say **YES** and choose a password you will never forget.

### Step 3: Extract your Security Fingerprint
After Step 2, Bubblewrap will show you a **SHA256 Fingerprint**. 
1.  Copy that long string of numbers/letters.
2.  Open the `public/.well-known/assetlinks.json` file I created for you.
3.  Replace `YOUR_SHA256_FINGERPRINT_HERE` with your actual fingerprint.
4.  **Commit and Push** that change to main.

### Step 4: Build the Final App Bundle
Once your `assetlinks.json` is live on the web, run:
```bash
bubblewrap build
```
This will generate a file called **`app-release-bundle.aab`** in your folder.

---

### ✅ Deployment
1.  Go to the [Google Play Console](https://play.google.com/console).
2.  Create a new app.
3.  Upload the **`app-release-bundle.aab`** to your Production track.
4.  **Done!** Your PWA will now be installed as a native Android app.

> [!CAUTION]
> **Keep your `.jks` file safe!** Bubblewrap will generate a file ending in `.jks`. This is your app's permanent signature. If you lose it, you can never update your app again. Back it up to a secure cloud drive.
