import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/test-rides/complete');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      
      <View style={styles.content}>
        {/* The image is not visible in the provided screenshot, but keep it if it's part of the intended animation */}
        <Image
          source={require('../../assets/create.gif')}
          style={styles.image}
          contentFit="cover"
          resizeMode="cover"
        />
        <Text style={styles.title}>TestRide Completed</Text>
      </View>
  
       <Text style={styles.subtitle}>You can see your updated list in Test Rides</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    // Align items horizontally in the center for both content and subtitle
    alignItems: 'center',
    // Distribute space to push content to center and subtitle to bottom
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingBottom: 48, // This padding will be at the very bottom of the screen
  },
  content: {
    // These styles will center the image and title vertically and horizontally within the available space
    flex: 1, // Allow content to take up available space
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center', // Ensure text is centered horizontally
    lineHeight: 22,
    paddingHorizontal: 20,
    // No absolute positioning needed anymore, paddingBottom on container handles the bottom offset
  },
});