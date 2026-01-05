# Google OAuth2 Authorization Test Pages

This folder contains two simple Google OAuth2 authorization frontend pages for debugging.

## File Description

1. **google-oauth.html** - Full-featured version, including:
   - Uses Google Identity Services library
   - Supports getting Access Token (for calling Google APIs)
   - Displays user information (name, email, avatar)
   - Logout functionality
   - Error handling

2. **google-oauth-simple.html** - Simplest version, only for quick testing:
   - Uses Google's One Tap login
   - Only gets ID Token
   - Displays basic user information

## Usage Steps

### 1. Get Google OAuth2 Client ID

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing project
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. If using for the first time, you need to configure the **OAuth consent screen** first:
   - User type select **External** (testing phase)
   - Fill in the application name (e.g., charityx-service)
   - Add your test email as a test user
6. Application type select **Web application**
7. **Important Configuration**:
   - **Authorized JavaScript origins**:
     - `http://localhost:8080` (if using local server)
     - `http://localhost` (if using port 80)
     - `http://127.0.0.1:8080` (you can also add this)
     - Your actual production domain (e.g., `https://yourdomain.com`)
   - **Authorized redirect URIs**:
     - For Google Identity Services, redirect URIs usually don't need to be configured
     - But if using traditional OAuth flow, you can add: `http://localhost:8080/callback`

### 2. Configure Client ID

Open the HTML file, find the following location and replace it with your Client ID:

```javascript
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
```

Or in `google-oauth-simple.html`:

```html
data-client_id="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
```

### 3. Run Tests

**Using Local Server (Recommended)**

Using Python:
```bash
cd auth
python3 -m http.server 8080
```

Using Node.js:
```bash
cd auth
npx http-server -p 8080
```

Then visit: `http://localhost:8080/google-oauth.html`

## Common Error Resolution

### ❌ Error 400: invalid_request

This error is usually because the **Authorized JavaScript origins** are not configured correctly. Solution:

1. **Check current page URL**:
   - Open browser console (F12), check the full URL of the current page
   - For example: `http://localhost:8080/google-oauth-simple.html`

2. **Configure in Google Cloud Console**:
   - Go to **APIs & Services** → **Credentials**
   - Click your OAuth 2.0 Client ID
   - In **Authorized JavaScript origins**, add:
     - `http://localhost:8080` (Note: **Do not** include path, only protocol+domain+port)
     - If using other ports, also add corresponding origins
   - **Save** changes (may need to wait a few minutes to take effect)

3. **Ensure using HTTP server**:
   - ❌ Cannot directly double-click to open HTML file (file:// protocol)
   - ✅ Must use local server to run

4. **Check if Client ID is correct**:
   - Ensure the Client ID in the HTML file exactly matches the one in Google Cloud Console

### ❌ Other Common Issues

- **"This app isn't verified"**: This is normal because the app is still in testing phase, click "Continue" to proceed
- **CORS errors**: Ensure authorized JavaScript origins are configured correctly
- **Button not displaying**: Check network connection, ensure `accounts.google.com` is accessible

## Notes

1. **Client ID Configuration**: Must replace with your actual Client ID, otherwise it won't work
2. **Authorized Domain**: Ensure correct authorized JavaScript origins are configured in Google Cloud Console (**only include protocol+domain+port, do not include path**)
3. **Must use HTTP server**: Cannot directly open HTML file, must access through HTTP server
4. **HTTPS**: Production environment recommends using HTTPS
5. **Access Token**: If you need to call Google APIs, use the OAuth 2.0 flow in `google-oauth.html`
6. **Configuration Effective Time**: Google Cloud Console configuration changes may take a few minutes to take effect

## Debugging Tips

1. Open browser developer tools (F12) to view Console logs
2. Check Network tab to view API requests
3. If encountering CORS errors, ensure authorized domain is correctly configured in Google Cloud Console
