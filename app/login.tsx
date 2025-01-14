import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../context/auth';

WebBrowser.maybeCompleteAuthSession();

const auth0ClientId = '35VyC5zTT00MnLgiW1qoO8sCRYA6pnnK';
const auth0Domain = 'dev-yyxwjv0qx8jvs6dy.us.auth0.com';

const discovery = {
  authorizationEndpoint: `https://${auth0Domain}/authorize`,
  tokenEndpoint: `https://${auth0Domain}/oauth/token`,
};

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: auth0ClientId,
      redirectUri: makeRedirectUri({
        scheme: 'your-app-scheme'
      }),
      responseType: 'token',
      scopes: ['openid', 'profile', 'email'],
    },
    discovery
  );

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await promptAsync();
      
      if (response?.type === 'success') {
        const { access_token } = response.params;
        // Store token with Bearer prefix
        const tokenWithBearer = `Bearer ${access_token}`;
        
        // Get user profile
        const userInfoResponse = await fetch(`https://${auth0Domain}/userinfo`, {
          headers: {
            Authorization: tokenWithBearer
          }
        });
        
        const userInfo = await userInfoResponse.json();
        
        // Store token with Bearer prefix
        await login(tokenWithBearer, userInfo);
        
        router.replace('/(tabs)/');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#622eab', '#181818']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={['#7b42d1', '#622eab']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Signing in...' : 'Sign in with Auth0'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fefefe',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(254, 254, 254, 0.7)',
    marginBottom: 40,
  },
  inputContainer: {
    gap: 20,
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#181818',
    borderRadius: 12,
    padding: 15,
    color: '#fefefe',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  loginButton: {
    height: 55,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fefefe',
    fontSize: 18,
    fontWeight: '600',
  },
  registerLink: {
    alignItems: 'center',
  },
  registerText: {
    color: 'rgba(254, 254, 254, 0.7)',
    fontSize: 16,
  },
  registerHighlight: {
    color: '#622eab',
    fontWeight: '600',
  },
});