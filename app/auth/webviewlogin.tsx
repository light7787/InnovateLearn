// app/auth/test.tsx
import React, { useRef ,useCallback} from 'react';
import { StyleSheet, View,BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { WebView } from 'react-native-webview';

const CLIENT_ID = '3MVG9CP2Kv.52YFszaAbTBqFxtEvuoKIaUGJmd1XUtnEUD._NAOiFL3mVrJljayw.9gC7XGTp9TIflZ083yk2';
const CALLBACK = 'autocloud://oauth-callback';
const AUTH_URL = 'https://rivermobilityprivatelimited2--riverlms.sandbox.my.site.com/autocloudSite/services/oauth2/authorize';
const SCOPE = 'full refresh_token openid';
const STATE = 'some_random_state';

const authUrl = `${AUTH_URL}?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(CALLBACK)}&scope=${encodeURIComponent(SCOPE)}&state=${STATE}`;

export default function SalesforceLogin() {
  const webViewRef = useRef<WebView>(null);
    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => true; // disables back action
        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => subscription.remove(); // ✅ correct cleanup
      }, [])
    );
  

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: authUrl }}
        style={styles.webView}
        cacheEnabled={false}
        incognito
        sharedCookiesEnabled={false}
        thirdPartyCookiesEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        scalesPageToFit
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webView: { flex: 1 },
});
