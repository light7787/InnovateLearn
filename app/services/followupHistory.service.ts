// 🔥 Follow-up history service (clean + future-proof)

import { getValidAccessToken } from '../auth/auth.service';
// import { API_BASE } from '@/constants/env';

// ✅ STRICT TYPE (same as UI expects)
export type FollowUpType =
  | 'Reschedule TR Call'
  | 'Schedule TR Call'
  | 'Booking Call';

// ✅ CLEAN MODEL (UI-friendly)
export interface FollowUpHistoryItem {
  id: string;
  remark: string;
  dateTime: string;
  type: FollowUpType;
}

export const getFollowUpHistory = async (
  opportunityId: string
): Promise<FollowUpHistoryItem[]> => {
  try {
    // ======================================================
    // 🔥 TEMP DUMMY DATA (REMOVE WHEN BACKEND READY)
    // ======================================================
    const dummyResponse = [
      {
        followUpDateTime: '2026-02-10T10:30:00',
        followUpFeedback: 'Customer asked to follow up later',
        followUpType: 'Booking Call',
      },
      {
        followUpDateTime: '2026-02-12T11:00:00',
        followUpFeedback: 'Discussed pricing details',
        followUpType: 'Reschedule TR Call',
      },
    ];

    const data = dummyResponse;

    // ======================================================
    // ✅ SAFE MAPPING (IMPORTANT FIX)
    // ======================================================
    const mapped: FollowUpHistoryItem[] = data.map((item, index) => {
      let mappedType: FollowUpType = 'Booking Call'; // default fallback

      if (item.followUpType === 'Reschedule TR Call') {
        mappedType = 'Reschedule TR Call';
      } else if (item.followUpType === 'Schedule TR Call') {
        mappedType = 'Schedule TR Call';
      } else if (item.followUpType === 'Booking Call') {
        mappedType = 'Booking Call';
      }

      return {
        id: `FU-${index}`,
        remark: item.followUpFeedback,
        dateTime: item.followUpDateTime,
        type: mappedType,
      };
    });

    return mapped;

    // ======================================================
    // 🚀 REAL API (UNCOMMENT WHEN BACKEND READY)
    // ======================================================
    /*
    const token = await getValidAccessToken();

    const res = await fetch(
      `${API_BASE}/followup-history?opportunityId=${opportunityId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const json = await res.json();

    if (!json?.isSuccess) return [];

    return json.data.map((item: any, index: number) => {
      let mappedType: FollowUpType = 'Booking Call';

      if (item.followUpType === 'Reschedule TR Call') {
        mappedType = 'Reschedule TR Call';
      } else if (item.followUpType === 'Schedule TR Call') {
        mappedType = 'Schedule TR Call';
      } else if (item.followUpType === 'Booking Call') {
        mappedType = 'Booking Call';
      }

      return {
        id: `FU-${index}`,
        remark: item.followUpFeedback,
        dateTime: item.followUpDateTime,
        type: mappedType,
      };
    });
    */
  } catch (err) {
    console.error('❌ FollowUpHistory error:', err);
    return [];
  }
};