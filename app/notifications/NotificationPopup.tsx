import AsyncStorage from '@react-native-async-storage/async-storage';
import { getValidAccessToken } from '../auth/auth.service';
import { API_BASE } from '@/constants/env';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  timestamp: number;
  type: 'ride' | 'followup';
}

const NOTIFICATION_KEY = 'userNotifications';

const toISTString = (timestamp: number) =>
  new Date(timestamp).toLocaleString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

export const fetchUpcomingNotifications = async (): Promise<NotificationItem[]> => {
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

  const notifications: NotificationItem[] = [];

  for (const ride of testRides?.Data || []) {
    const scheduled = new Date(ride.ScheduleDateTime).getTime();
    const trigger = scheduled - 60 * 60 * 1000; // 1 hr before
    if (now >= trigger && now - trigger <= 24 * 60 * 60 * 1000) {
      notifications.push({
        id: `ride-${ride.TestDriveId}`,
        title: 'Upcoming Test Ride',
        message: `Hey! You have a Home Test Ride scheduled at ${toISTString(scheduled).split(',')[1].trim()} today.`,
        time: toISTString(trigger),
        timestamp: trigger,
        type: 'ride',
      });
    }
  }

  for (const followUp of followUps?.Data || []) {
    const scheduled = new Date(followUp.FollowUpDate).getTime();
    const trigger = scheduled - 15 * 60 * 1000;
    if (now >= trigger && now - trigger <= 24 * 60 * 60 * 1000) {
      notifications.push({
        id: `follow-${followUp.FollowUpId}`,
        title: 'Upcoming Follow-up',
        message: `Hey! You have a follow-up scheduled at ${toISTString(scheduled).split(',')[1].trim()} today.`,
        time: toISTString(trigger),
        timestamp: trigger,
        type: 'followup',
      });
    }
  }

  return notifications;
};
