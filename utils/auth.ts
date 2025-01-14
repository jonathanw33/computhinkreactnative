import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { storage } from '../context/auth';  // Adjust path as needed

const auth0ClientId = '35VyC5zTT00MnLgiW1qoO8sCRYA6pnnK';
const auth0Domain = 'dev-yyxwjv0qx8jvs6dy.us.auth0.com';

export const login = async () => {
  try {
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'your-app-scheme'
    });

    const request = new AuthSession.AuthRequest({
      clientId: auth0ClientId,
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
      scopes: ['openid', 'profile', 'email', 'read:current_user', 'update:current_user_metadata'],
      extraParams: {
        audience: `https://${auth0Domain}/api/v2/`
      }
    });

    const response = await request.promptAsync({
      authorizationEndpoint: `https://${auth0Domain}/authorize`,
    });
    
    if (response.type === 'success') {
      const { access_token } = response.params;
      // Store token with Bearer prefix
      const tokenWithBearer = `Bearer ${access_token}`;
      await SecureStore.setItemAsync('auth_token', tokenWithBearer);
      return tokenWithBearer;
    }
    return null;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const storeToken = async (token: string, expiresIn: string | number) => {
  const expiresAt = new Date().getTime() + parseInt(expiresIn.toString()) * 1000;
  await storage.setItem('auth_token', token);
  await storage.setItem('token_expiry', expiresAt.toString());
};


export const getValidToken = async () => {
  const token = await storage.getItem('auth_token');
  const expiryStr = await storage.getItem('token_expiry');
  
  if (!token || !expiryStr) return null;
  
  const expiresAt = parseInt(expiryStr);
  const now = new Date().getTime();
  
  // Return token if it's still valid (with 5 min buffer)
  if (expiresAt - now > 300000) {
    return token;
  }
  
  return null;
};



export const getAccessTokenSilently = async () => {
  try {
    // First try to get a valid stored token
    const validToken = await getValidToken();
    if (validToken) {
      return validToken;
    }

    // If no valid token, request a new one
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'your-app-scheme'
    });

    const request = new AuthSession.AuthRequest({
      clientId: auth0ClientId,
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
      scopes: ['openid', 'profile', 'email', 'read:current_user', 'update:current_user_metadata'],
      extraParams: {
        audience: `https://${auth0Domain}/api/v2/`
      }
    });

    const response = await request.promptAsync({
      authorizationEndpoint: `https://${auth0Domain}/authorize`,
    });

    if (response.type === 'success') {
      const { access_token, expires_in } = response.params;
      await storeToken(access_token, expires_in);
      return access_token;
    }
    return null;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

export const getManagementApiToken = async () => {
  try {
    const tokenResponse = await fetch(`https://${auth0Domain}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: auth0ClientId,
        audience: `https://${auth0Domain}/api/v2/`,
        scope: 'read:users update:users'
      })
    });

    const { access_token } = await tokenResponse.json();
    return access_token;
  } catch (error) {
    console.error('Error getting management token:', error);
    return null;
  }
};

export const logout = async () => {
  try {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_info');
    
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'your-app-scheme'
    });

    const logoutUrl = `https://${auth0Domain}/v2/logout?` +
      `client_id=${auth0ClientId}` +
      `&returnTo=${encodeURIComponent(redirectUri)}`;

    await WebBrowser.openBrowserAsync(logoutUrl);
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const getUserInfo = async (token: string) => {
  try {
    const response = await fetch(`https://${auth0Domain}/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};