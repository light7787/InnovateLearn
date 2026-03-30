import React, { useState, useEffect, useRef } from 'react';
import { Animated, Text, AppState, StyleSheet } from 'react-native';
import Typography from '@/constants/typography';

const ConnectionStatusBar = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showConnectedBar, setShowConnectedBar] = useState(false);
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const connectedBarAnim = useRef(new Animated.Value(-50)).current;

  const checkInternetConnection = async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache',
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  };

  const checkNetworkStatus = async () => {
    const connected = await checkInternetConnection();

    if (isConnected !== connected) {
      requestAnimationFrame(() => {
        setIsConnected(connected);
      });

      if (isConnected === false && connected === true) {
        requestAnimationFrame(() => {
          setShowConnectedBar(true);
          Animated.timing(connectedBarAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();

          setTimeout(() => {
            Animated.timing(connectedBarAnim, {
              toValue: -50,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              requestAnimationFrame(() => setShowConnectedBar(false));
            });
          }, 2000);
        });
      }
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (next) => {
      if (next === 'active') checkNetworkStatus();
    });
    return () => subscription?.remove();
  }, [isConnected]);

  useEffect(() => {
    checkNetworkStatus();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isConnected !== null) {
      interval = setInterval(checkNetworkStatus, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected]);

  useEffect(() => {
    if (isConnected === false) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (isConnected === true) {
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected]);

  return (
    <>
      <Animated.View
        style={[styles.connectionBar, styles.offlineBar, { transform: [{ translateY: slideAnim }] }]}
      >
        <Text style={[Typography.status, styles.connectionBarText]}>
          No Internet Connection
        </Text>
      </Animated.View>

      {showConnectedBar && (
        <Animated.View
          style={[styles.connectionBar, styles.onlineBar, { transform: [{ translateY: connectedBarAnim }] }]}
        >
          <Text style={[Typography.status, styles.connectionBarText]}>
            Internet Available
          </Text>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  connectionBar: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 1000,
  },
  offlineBar: {
    backgroundColor: '#FF6B6B',
  },
  onlineBar: {
    backgroundColor: '#4ECDC4',
  },
  connectionBarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ConnectionStatusBar;
