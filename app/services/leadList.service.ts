import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '@/constants/env';

const USE_MOCK = true;

type ListType = 'T' | 'F' | 'A';

type Params = {
  listType: ListType;
  filterType: string;
  fromDate?: string | null;
  toDate?: string | null;
  pageNumber?: number;
  pageSize?: number;
};

export const getLeadList = async ({
  listType,
  filterType,
  fromDate = null,
  toDate = null,
  pageNumber = 1,
  pageSize = 20,
}: Params) => {
  try {
    const profileRaw = await AsyncStorage.getItem('userProfile');
    const locationCode = await AsyncStorage.getItem('locationCode');
    const token = await AsyncStorage.getItem('authToken');

    if (!profileRaw) throw new Error('User profile missing');

    const profile = JSON.parse(profileRaw);

    const payload = {
      userName: profile.UserName,
      dealerCode: profile.UserId,
      branchCode: locationCode,
      listType,
      filterType,
      fromDate,
      toDate,
      pageNumber,
      pageSize,
    };

    let data;

    // 🧪 MOCK
    if (USE_MOCK) {
      await new Promise(res => setTimeout(res, 500));

      data = {
        isSuccess: true,
        data: {
          totalRecords: 3,
          records: [
            {
              opportunityNo: 'OPP-1001',
              customerName: 'Ravi Kumar',
              phoneNo: '9876543210',
              opportunityType: 'HOT',
              testRide: {
                testRideType: 'HTR',
                scheduledTestRideSlot: '10:30 AM - 11:30 AM',
                testRideStatus: 'SCHEDULED',
              },
              followUp: null,
            },
          ],
        },
      };

      console.log('🧪 MOCK LEAD LIST');
    } else {
      const res = await fetch(`${API_BASE}/lead-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          client_id: 'YOUR_CLIENT_ID',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      data = await res.json();
    }

    if (!data?.isSuccess) {
      throw new Error(data?.errorList?.[0]?.message || 'Failed');
    }

    return data.data.records;
  } catch (error) {
    console.error('🚨 LeadList error:', error);
    throw error;
  }
};