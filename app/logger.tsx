import { API_BASE } from "@/constants/env";
import AsyncStorage from "@react-native-async-storage/async-storage";
 
const LOG_ENDPOINT = `${API_BASE}/api/data/mobileLogs`;
 
export async function sendLog(
  level: "info" | "warn" | "error",
  message: unknown  
) {
  try {
   
    let safeMessage: string;
 
    if (message instanceof Error) {
      safeMessage = message.message;
    } else if (typeof message === "string") {
      safeMessage = message;
    } else {
      safeMessage = JSON.stringify(message);
    }
 
    // get userId from AsyncStorage
    const userProfile = await AsyncStorage.getItem("userProfile");
    let userId = "unknown";
 
    if (userProfile) {
      try {
        const parsed = JSON.parse(userProfile) as { UserId?: string };
        userId = parsed.UserId || "unknown";
      } catch {
        // ignore parse error
      }
    }
 
    await fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        level,
        message: safeMessage,
      }),
    });
  } catch {
    // ignore network/storage errors
  }
}