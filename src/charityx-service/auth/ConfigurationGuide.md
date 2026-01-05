# Google OAuth2 Error Quick Resolution Guide

## 🔴 Error 1: Error 401: invalid_client - "no registered origin"

**This is the most common error!** It indicates that the current domain being accessed is not registered as an authorized JavaScript origin in Google Cloud Console.

## 🔴 Error 2: Error 400: invalid_request

This error is also because the **Authorized JavaScript origins** are not correctly configured in Google Cloud Console.

## ✅ Resolution Steps (5 minutes)

### 🔍 Step 1: Confirm the current domain being accessed

1. Open your test page (e.g., `http://localhost:8080/google-oauth-simple.html`)
2. The page will display the current domain (in the debug information area)
3. Or press `F12` to open the console and check the domain information in the logs
4. **Remember this domain**, for example: `http://localhost:8080`

### Step 2: Open Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. **Select the correct project** (charityx-service)
3. Go to **APIs & Services** → **Credentials**

### Step 3: Find and edit OAuth 2.0 Client ID

1. In the credentials list, find your OAuth 2.0 Client ID
   - Client ID should end with `.apps.googleusercontent.com`
   - For example: `989858908741-eqi3l3s0229bp8asri2nnkpasum02l30.apps.googleusercontent.com`
2. Click **Edit** (pencil icon ✏️)

### Step 4: Configure Authorized JavaScript Origins ⚠️ Most Critical!

In the **Authorized JavaScript origins** section:

1. Click the **+ Add URI** button
2. Enter the domain you confirmed in step 1, for example:
   ```
   http://localhost:8080
   ```
3. **Important format requirements**:
   - ✅ Only include: `protocol://domain:port`
   - ✅ Example: `http://localhost:8080`
   - ❌ **Do not** include path: `http://localhost:8080/google-oauth-simple.html` (Wrong!)
   - ❌ **Do not** include trailing slash: `http://localhost:8080/` (Wrong!)

4. **Recommended: Add multiple common origins** (configure once):
   ```
   http://localhost:8080
   http://localhost
   http://127.0.0.1:8080
   http://127.0.0.1
   ```

### Step 5: Save and wait for it to take effect

1. Click the **Save** button at the bottom of the page
2. ⏰ **Wait 2-5 minutes** for the configuration to take effect (Google needs time to sync)
3. Refresh your test page
4. Try logging in again

### Step 6: Verify configuration

If configured correctly, you should see:
- ✅ Google login button displays normally
- ✅ Clicking it opens the authorization window normally
- ✅ No more "no registered origin" error

## 🔍 How to check the current page URL?

**Method 1: View page debug information**
- Open the test page, the bottom of the page will display "Current Domain"

**Method 2: View browser console**
1. Open browser developer tools (press `F12`)
2. Switch to the **Console** tab
3. Check the logs, which will show detailed configuration information
4. Or run: `console.log(window.location.origin)`

**Method 3: View address bar**
- Address bar shows: `http://localhost:8080/google-oauth-simple.html`
- Extract the domain part: `http://localhost:8080` (This is what you need to add to Authorized JavaScript origins)

## 📝 Complete Configuration Example

In Google Cloud Console, your configuration should look like this:

**Authorized JavaScript origins**:
```
http://localhost:8080
http://localhost
http://127.0.0.1:8080
```

**Authorized redirect URIs** (usually not needed for Google Identity Services):
```
(Can be left empty, or add)
http://localhost:8080/callback
```

## ⚠️ Common Errors and Solutions

### Error 1: Including path
- ❌ `http://localhost:8080/google-oauth.html` (Wrong!)
- ✅ `http://localhost:8080` (Correct!)

### Error 2: Using file:// protocol
- ❌ Directly double-click to open HTML file (`file:///Users/...`)
- ✅ Use local server to run (`http://localhost:8080`)

### Error 3: Configuration not taking effect
- ⏰ Wait 2-5 minutes after saving (Google needs time to sync)
- 🔄 Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- 🕵️ Test in incognito mode (exclude cache issues)
- 🔁 Completely close browser and reopen

### Error 4: Selected wrong project
- Ensure the correct project is selected in Google Cloud Console
- Project name should be: `charityx-service`
- Check if Client ID matches

### Error 5: Client ID mismatch
- Ensure the Client ID in the HTML file exactly matches the one in Google Cloud Console
- Check for spaces or extra characters

## 🚀 Quick Test Commands

```bash
# Enter auth directory
cd auth

# Start local server (Python 3)
python3 -m http.server 8080

# Or use Node.js
npx http-server -p 8080

# Then access in browser
# http://localhost:8080/google-oauth-simple.html
```

## 📞 If it still doesn't work

1. Check browser console (F12) error messages
2. Confirm Client ID is correct
3. Confirm you're using HTTP server, not directly opening the file
4. Wait for configuration to take effect (may take 5-10 minutes)
5. Try using incognito mode


