import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Typography from '@/constants/typography';
import HeaderComponent from '@/app/components/AppHeader';
import BikeIcon from '@/app/components/Notification/notificationicon';
import FileIcon from '@/app/components/Notification/notificationicon2';
import { getValidAccessToken } from '../auth/auth.service';
import { API_BASE, ENV } from '@/constants/env';

const NOTIFICATION_KEY = 'userNotifications';
const POLLING_INTERVAL = 4 * 60 * 1000; // 4 minutes

interface NotificationItem {
  id: string;
  iconType: 'shield' | 'document';
  title: string;
  message: string;
  time: string;
  iconColor: string;
  timestamp: number;
}

const toISTString = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchNotifications(); // Initial call

    intervalRef.current = setInterval(() => {
      fetchNotifications();
    }, POLLING_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = await getValidAccessToken();
      const profile = await AsyncStorage.getItem('userProfile');
      if (!profile) throw new Error('Missing user profile');

      const { UserId } = JSON.parse(profile);
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const payload = {
        UserId,
        FilterDate: 'TODAY',
      };

      const [testRideRes, followUpRes] = await Promise.all([
        fetch(`${API_BASE}/api/data/EventTestDrive`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        }),
        fetch(`${API_BASE}/api/data/EventFollowUp`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        }),
      ]);

      const testRides = await testRideRes.json();
      const followUps = await followUpRes.json();
      const now = Date.now();
      const upcoming: NotificationItem[] = [];

      // 🚲 Test Ride Notifications — 1hr before
      for (const ride of testRides?.Data || []) {
        if (!ride.ScheduleDateTime) continue;
        const scheduled = new Date(ride.ScheduleDateTime).getTime();
        const triggerTime = scheduled - 60 * 60 * 1000;

        if (now >= triggerTime && now - triggerTime <= 24 * 60 * 60 * 1000) {
          upcoming.push({
            id: `ride-${ride.TestDriveId}`,
            iconType: 'shield',
            title: 'Upcoming Test Ride',
            message: `Test ride with ${ride.LeadName} at ${toISTString(scheduled).split(',')[1].trim()}`,
            time: toISTString(triggerTime),
            iconColor: '#0066CC',
            timestamp: triggerTime,
          });
        }
      }

      // ☎️ Follow-up Notifications — 15min before
      for (const followUp of followUps?.Data || []) {
        if (!followUp.FollowUpDate) continue;
        const scheduled = new Date(followUp.FollowUpDate).getTime();
        const triggerTime = scheduled - 15 * 60 * 1000;

        if (now >= triggerTime && now - triggerTime <= 24 * 60 * 60 * 1000) {
          upcoming.push({
            id: `follow-${followUp.FollowUpId}`,
            iconType: 'document',
            title: 'Upcoming Follow-up',
            message: `Follow-up with ${followUp.LeadName} at ${toISTString(scheduled).split(',')[1].trim()}`,
            time: toISTString(triggerTime),
            iconColor: '#6B7280',
            timestamp: triggerTime,
          });
        }
      }

      // 🔐 Save to AsyncStorage
      await AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(upcoming));
      setNotifications(upcoming);

       ENV === 'dev'&&console.log('✅ Refreshed Notifications:', JSON.stringify(upcoming, null, 2));
    } catch (error) {
       ENV === 'dev'&&console.error('⚠️ Error fetching notifications:', error);
      const cached = await AsyncStorage.getItem(NOTIFICATION_KEY);
      if (cached) {
        const data = JSON.parse(cached) as NotificationItem[];
        const now = Date.now();
        const valid = data.filter(n => now - n.timestamp <= 24 * 60 * 60 * 1000);
        setNotifications(valid);
         ENV === 'dev'&&console.log('📦 Loaded notifications from cache');
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-river-blue-1">
      <HeaderComponent
        title="Notifications"
        onBackPress={() => router.back()}
        showDropdown={false}
        noTopPadding={true}
      />

      <ScrollView className="flex-1 px-2">
        <View className="space-y-4">
          {notifications.length === 0 ? (
            <Text className="text-center text-gray-500 mt-10" style={Typography.copy1}>
              No notifications in the last 24 hours.
            </Text>
          ) : (
            notifications.map((notification, index) => (
              <View
                key={notification.id}
                className={`bg-river-blue-1 rounded-lg ${
                  index < notifications.length - 1 ? 'border-b border-b-gray-200' : ''
                } py-4 px-3`}
              >
                <View className="flex-row items-start">
                  <View className="flex-shrink-0 mt-1 mr-4">
                    {notification.iconType === 'shield' ? <BikeIcon /> : <FileIcon />}
                  </View>
                  <View className="flex-1 ml-1">
                    <Text
                      className="text-base font-semibold text-[#00405D] mb-1 mt-1"
                      style={Typography.subline1}
                    >
                      {notification.title}
                    </Text>
                    <Text
                      className="text-sm text-river-blue-5 mb-3 leading-relaxed"
                      style={Typography.copy1}
                    >
                      {notification.message}
                    </Text>
                    <Text className="text-xs text-river-blue-4" style={Typography.copy2}>
                      {notification.time}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsPage;
