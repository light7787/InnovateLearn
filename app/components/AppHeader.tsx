import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ViewProps, 
  Animated,
  Dimensions,
  AppState
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Typography from '@/constants/typography';
import { Dropdownsmall } from './inputdropdown2';
import BackIcon from './HomeScreen/backicon';

interface HeaderComponentProps extends ViewProps {
  title: string;
  onBackPress: () => void;
  showDropdown?: boolean;
  dropdownOptions?: string[];
  selectedValue?: string;
  onDropdownSelect?: (value: string) => void;
  noTopPadding?: boolean;
  noback?: boolean;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  title,
  onBackPress,
  showDropdown = false,
  dropdownOptions = [],
  selectedValue,
  onDropdownSelect,
  noTopPadding = false,
  noback = false,
  ...props
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showConnectedBar, setShowConnectedBar] = useState(false);
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const connectedBarAnim = useRef(new Animated.Value(-50)).current;

  // Network checking function
  const checkInternetConnection = async (): Promise<boolean> => {
    try {
      // Try to fetch from a reliable endpoint with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache'
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const checkNetworkStatus = async () => {
  const connected = await checkInternetConnection();

  // Only trigger if there's a state change
  if (isConnected !== connected) {
    requestAnimationFrame(() => {
      setIsConnected(connected);
    });

    // Trigger animations separately (green bar in case of reconnect)
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
            requestAnimationFrame(() => {
              setShowConnectedBar(false);
            });
          });
        }, 2000);
      });
    }
  }
};


  // Check network when app becomes active
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        checkNetworkStatus();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isConnected]);

  // Initial network check when component mounts
  useEffect(() => {
    checkNetworkStatus();
  }, []);

  // Periodic network check (less frequent than previous version)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    // Only start interval checking if we have an initial state
    if (isConnected !== null) {
      interval = setInterval(checkNetworkStatus, 1000); // Check every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected]);

  useEffect(() => {
    if (isConnected === false) {
      // Show offline bar
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (isConnected === true) {
      // Hide offline bar
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected, slideAnim]);

  const renderConnectionBars = () => {
    return (
      <>
        {/* Offline Bar */}
        <Animated.View
          style={[
            styles.connectionBar,
            styles.offlineBar,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[Typography.status,styles.connectionBarText]}>No Internet Connection</Text>
        </Animated.View>

        {/* Connected Bar */}
        {showConnectedBar && (
          <Animated.View
            style={[
              styles.connectionBar,
              styles.onlineBar,
              {
                transform: [{ translateY: connectedBarAnim }],
              },
            ]}
          >
            <Text style={[Typography.status,styles.connectionBarText]}>Internet Available</Text>
          </Animated.View>
        )}
      </>
    );
  };

  return (
    <>
      {/* Connection Status Bars */}
      {renderConnectionBars()}
      
      {/* Main Header */}
      <View
        style={[
          styles.headerContainer,
          !noTopPadding && styles.defaultTopPadding
        ]}
        {...props}
      >
        {!noback && (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <BackIcon />
          </TouchableOpacity>
        )}

        <Text style={[Typography.headline4, styles.headerTitle]}>
          {title}
        </Text>

        {showDropdown && dropdownOptions.length > 0 && selectedValue && onDropdownSelect && (
          <View style={styles.headerRight}>
            <Dropdownsmall
              value={selectedValue}
              onSelect={onDropdownSelect}
              options={dropdownOptions}
            />
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 4,
    backgroundColor: '#F7FBFD',
  },
  defaultTopPadding: {
    paddingTop: 48,
  },
  backButton: {
    paddingVertical: 8
  },
  backButtonText: {
    fontSize: 24,
    color: '#2196F3',
    fontWeight: '500',
  },
  headerTitle: {
    color: '#333',
    flex: 1,
    marginLeft: 20,
  },
  headerRight: {
    minWidth: 80,
  },
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
    backgroundColor: '#FF6B6B', // Red background for offline
  },
  onlineBar: {
    backgroundColor: '#4ECDC4', // Green background for online
  },
  connectionBarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HeaderComponent;