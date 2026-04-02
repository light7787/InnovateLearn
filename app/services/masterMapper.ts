import AsyncStorage from '@react-native-async-storage/async-storage';

type MasterItem = {
  label?: string;
  lable?: string;
  value: number;
  LeadSourceValue?: number;
};

const getMasters = async () => {
  const mastersRaw = await AsyncStorage.getItem('masters');
  if (!mastersRaw) throw new Error('Masters not found');
  return JSON.parse(mastersRaw);
};

export const mapLeadSource = async (leadSource: string): Promise<number> => {
  const masters = await getMasters();
  const match = masters?.leadSource?.find(
    (item: MasterItem) =>
      (item.label || item.lable)?.toLowerCase() === leadSource.toLowerCase()
  );
  if (!match) throw new Error(`Lead source not found: ${leadSource}`);
  return match.value; // number e.g. 192
};

export const mapSecondarySource = async (
  secondarySource: string,
  leadSourceValue: number  // ← number, not string
): Promise<number> => {
  const masters = await getMasters();
  const match = masters?.leadSecondarySource?.find(
    (item: MasterItem) =>
      (item.label || item.lable)?.toLowerCase() === secondarySource.toLowerCase() &&
      item.LeadSourceValue === leadSourceValue
  );
  if (!match) throw new Error(`Secondary source not found: ${secondarySource}`);
  return match.value; // number e.g. 1
};