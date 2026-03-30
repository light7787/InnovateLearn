// import { useEffect, useRef, useState } from 'react';
// import { fetchUpcomingNotifications, NotificationItem } from '@/services/notification.service';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const POLLING_INTERVAL = 4 * 60 * 1000;

// export const useGlobalNotifications = () => {
//   const [activeNotification, setActiveNotification] = useState<NotificationItem | null>(null);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   const checkForNew = async () => {
//     try {
//       const latest = await fetchUpcomingNotifications();

//       const cached = await AsyncStorage.getItem('userNotifications');
//       const old = cached ? (JSON.parse(cached) as NotificationItem[]) : [];

//       const oldIds = new Set(old.map(n => n.id));
//       const newOnes = latest.filter(n => !oldIds.has(n.id));

//       if (newOnes.length > 0) {
//         setActiveNotification(newOnes[0]); // pick the first one
//       }

//       await AsyncStorage.setItem('userNotifications', JSON.stringify(latest));
//     } catch (err) {
//       console.error('Global Notification Polling Error:', err);
//     }
//   };

//   useEffect(() => {
//     checkForNew();
//     intervalRef.current = setInterval(checkForNew, POLLING_INTERVAL);

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, []);

//   return {
//     activeNotification,
//     dismissNotification: () => setActiveNotification(null),
//   };
// };
