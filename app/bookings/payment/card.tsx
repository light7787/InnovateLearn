// app/screens/CardPaymentScreen.tsx
import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Linking,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import { TextField } from "@/app/components/input";
import Typography from "@/constants/typography";
import AnimatedButtonsFooter from "@/app/components/footerbtn";
import WhatsappIcon from "@/app/components/Whatsapp";

import { API_BASE, ENV } from "@/constants/env";
import { getValidAccessToken } from "@/app/auth/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendLog } from "@/app/logger";

type MethodInfo = { paymentMethod?: string; cardType?: string | null };
export default function CardPaymentScreen() {
  const [amount, setAmount] = useState("2500"); // rupees as string
  const [paymentLink, setPaymentLink] = useState("");
  const [linkId, setLinkId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    firstName,
    lastName,
    phone,
    email,
    vehicleColor,
    leadId,
    followupId,
    testrideId,
  } = useLocalSearchParams<{
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    vehicleColor?: string | string[];
    leadId?: string;
    followupId?: string;
    testrideId?: string;
  }>();

  // ===== Helpers you already have (trimmed) =====
  const documentStorageKey = `testride_docs_${testrideId}`;

  const clearSavedDocuments = async () => {
    try {
      await AsyncStorage.removeItem(documentStorageKey);
       ENV === 'dev'&&console.log("🗑️ Cleared saved documents for testride:", testrideId);
    } catch (error) {
       ENV === 'dev'&&console.error("Error clearing saved documents:", error);
    }
  };

  const updateTestDriveStatus = async (token: string): Promise<boolean> => {
    try {
      const userProfile = await AsyncStorage.getItem("userProfile");
      if (!userProfile) throw new Error("User profile not found");
      const { UserId } = JSON.parse(userProfile);

      if (!testrideId || !UserId) {
         ENV === 'dev'&&console.error("Missing testrideId or userId for status update");
        return false;
      }

      const formatDateForAPI = (): string => {
        return new Date().toISOString().split("T")[0];
      };

      const formatTimeForAPI = (): string => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
      };

      const payload = {
        UserId,
        TestDriveId: testrideId,
        TestDriveStatus: "Completed",
        TestDriveDate: formatDateForAPI(),
        TestDriveTime: formatTimeForAPI(),
        StartTestDrive: false,
        CompleteTestDrive: true,
      };

       ENV === 'dev'&&console.log("🔄 Updating test ride status:", payload);

      const response = await fetch(`${API_BASE}/api/data/UpdateTestDrive`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`API error ${response.status}`);

      const result = await response.json();
      if (result.StatusCode === 200) {
        await clearSavedDocuments();
        return true;
      } else {
        throw new Error(result.StatusMessage || "Failed to complete test ride");
      }
    } catch (error) {
       ENV === 'dev'&&console.error("❌ Failed to update test ride status:", error);
      return false;
    }
  };

  const updateFollowUpStatus = async () => {
    try {
       ENV === 'dev'&&console.log("Updating follow-up status for ID:", followupId);
      const userProfile = await AsyncStorage.getItem("userProfile");
      if (!userProfile) throw new Error("User profile not found");
      const { UserId } = JSON.parse(userProfile);

      const requestBody = {
        UserId,
        FollowUpId: followupId,
        FollowUpStatusCompleted: true,
      };

      const token = await getValidAccessToken();
      const response = await fetch(`${API_BASE}/api/data/UpdateFollowUp`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (response.ok && responseData.StatusCode === 200) {
         ENV === 'dev'&&console.log("Follow-up updated successfully:", responseData);
        return { success: true, data: responseData };
      } else {
         ENV === 'dev'&&console.error("Follow-up API Error:", responseData);
        return {
          success: false,
          error:
            responseData.StatusMessage || "Failed to update follow-up status",
        };
      }
    } catch (error) {
       ENV === 'dev'&&console.error("Follow-up Network Error:", error);
      return {
        success: false,
        error: "Network error occurred while updating follow-up",
      };
    }
  };

  // ===== Generate Card Payment Link (now includes dealerCode) =====
  const handleSendPaymentLink = async () => {
    setLoading(true);
    try {
      const userProfile = await AsyncStorage.getItem('userProfile');
      const {  DealerCode } = JSON.parse(userProfile || '{}');

      const response = await fetch(`${API_BASE}/api/payment/create-link/card`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount), // RUPEES
          method: "card",
          dealerCode: DealerCode || "UNKNOWN",
          customer: {
            name: `${firstName || "Customer"} ${lastName || ""}`.trim(),
            contact: phone || "9112345678",
            email: email || "customer@example.com",
          },
        }),
      });

      const data = await response.json();

      if (response.ok && data.paymentLink && data.linkId) {
        setPaymentLink(data.paymentLink);
        setLinkId(data.linkId);
        setQrCode(
          `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
            data.paymentLink
          )}&size=200x200`
        );
      } else {
        Alert.alert("Error", data.error || "Failed to generate link.");
      }
    } catch (err) {
      Alert.alert("Network error", "Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!linkId) return;

      try {
        const res = await fetch(`${API_BASE}/api/payment/status/${linkId}`);
        const text = await res.text();
        let data;

        try {
      
          data = JSON.parse(text);
      
        } catch {
      
           ENV === 'dev'&&console.error("❌ Status API returned non-JSON:", text.slice(0, 200));
      
          return; // skip this tick
      
        }
       

        if (data.status === "paid") {
          const transactionId = data.razorpay_payment_id;
          if (!transactionId || !transactionId.startsWith("pay_")) {
             ENV === 'dev'&&console.error("❌ Missing Razorpay payment id in status payload");
            return;
          }
        
          // Get authoritative fee/tax from Razorpay (via your backend proxy)
          const details = await fetchPaymentDetails(transactionId);
        
          // Normalize method & card type from either poll payload or details
          const paymentMethod = (data.payment_method || details?.method) as PayMethod | undefined;
          const cardType = (data.card_type ?? details?.card?.type ?? null) as CardKind | null | undefined;
        
          const feeRs = paiseToRs(details?.fee); // Razorpay values are in paise
          const taxRs = paiseToRs(details?.tax);
        
          clearInterval(interval);
          await handleConfirm(transactionId, { paymentMethod, cardType }, { feeRs, taxRs });
        
          if (followupId) await updateFollowUpStatus();
          if (testrideId) {
            const token = await getValidAccessToken();
            if (token) {
              const ok = await updateTestDriveStatus(token);
              if (!ok)  ENV === 'dev'&&console.warn("⚠️ Test ride status update failed");
            }
          }
        }
        
      } catch (err) {
         ENV === 'dev'&&console.error("Polling error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [linkId]);

  const fetchPaymentDetails = async (paymentId: string) => {
    const res = await fetch(`${API_BASE}/api/payment/details/${paymentId}`);
    const text = await res.text();
   
    let data;
    try {
      data = JSON.parse(text);
       ENV === 'dev'?console.log("Data",data):  sendLog('info', `🚀 Payment details : ${JSON.stringify(data)}`);
    } catch {
       ENV === 'dev'&&console.error("❌ Expected JSON but got:", text.slice(0, 200));
      throw new Error("Backend did not return JSON");
    }
   
    if (!res.ok) throw new Error(data?.error || "Failed to fetch payment details");
  
    return data;
    
  };
  
  // Utility to convert paise -> rupees with 2 decimals
  const paiseToRs = (p: number | undefined | null) =>
    +(((p || 0) as number) / 100).toFixed(2);

  // ===== Confirm: create order, then trigger transfer =====
  // ---- Types (keep near your other types) ----
type CardKind = "credit" | "debit";
type PayMethod = "card" | "upi" | "paylater" | "netbanking" | "wallet";

type MethodInfo = {
  paymentMethod?: PayMethod;
  cardType?: CardKind | null;
};

type Charges = {
  feeRs: number; // rupees
  taxRs: number; // rupees
};

type CreateOrderResponse = {
  StatusCode: number;
  StatusMessage?: string;
  [k: string]: unknown;
};

type TransferResponse =
  | { success: true; [k: string]: unknown }
  | { success?: false; error?: string; [k: string]: unknown };

// ---- Function ----
const handleConfirm = async (
  transactionId: string,
  methodInfo?: MethodInfo,
  charges?: Charges
): Promise<void> => {
  try {
    // 1) Read profile
    const userProfileRaw = await AsyncStorage.getItem("userProfile");
    if (!userProfileRaw) throw new Error("User profile not found");

    const { UserId, DealerCode } = JSON.parse(userProfileRaw) as {
      UserId?: string;
      DealerCode?: string;
    };

    if (!UserId) throw new Error("Missing UserId in profile");
    if (!DealerCode)  ENV === 'dev'&&console.warn("⚠️ DealerCode missing in profile");

    // 2) Normalize color
    const colorKey = Array.isArray(vehicleColor)
      ? (vehicleColor[0] as string)
      : (vehicleColor ?? "");
    const colorMap: Record<string, string> = {
      "Spring Yellow": "Spring Yellow",
      "Monsoon Blue": "Monsoon Blue",
      "Summer Red": "Summer Red",
      "Storm Grey": "Storm Grey",
      "Winter White": "Winter White",
    };
    const normalizedColor = colorMap[colorKey] ?? "";

    // 3) Friendly payment mode label (optional for UX/reporting)
    let paymentModeText: string = "Card";
    switch (methodInfo?.paymentMethod) {
      case "card":
        if (methodInfo.cardType === "debit") paymentModeText = "Debit Card";
        else if (methodInfo.cardType === "credit") paymentModeText = "Credit Card";
        else paymentModeText = "Card";
        break;
      case "upi":
        paymentModeText = "UPI";
        break;
      case "paylater":
        paymentModeText = "PayLater";
        break;
      case "netbanking":
        paymentModeText = "Netbanking";
        break;
      case "wallet":
        paymentModeText = "Wallet";
        break;
      default:
        paymentModeText = "Card";
    }

    // 4) Create order in your backend (Salesforce)
    const token = await getValidAccessToken();
    if (!token) throw new Error("Auth token not available");

    const orderPayload = {
      userId: UserId,
      opportunityId: leadId,
      paymentStatus: "SUCCESS",
      transactionId,                       // pay_...
      paymentMode: paymentModeText,        // normalized text
      paymentGateway: "Razorpay",
      orderAmount: Number(amount),         // rupees
      VehicleColor: normalizedColor,
      timestamp: new Date().toISOString(),
      gatewayResponseMessage: "Payment processed successfully",
      customerDetails: {
        name: `${firstName || ""} ${lastName || ""}`.trim(),
        email: email ?? null,
        phone: phone ?? null,
      },
    };

     ENV === 'dev'?console.log("🚀 Creating order with payload:", orderPayload)  : sendLog('info', `🚀 Creating order with payload: ${JSON.stringify(orderPayload)}`);

    const orderRes = await fetch(`${API_BASE}/api/data/CreateOrder`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    const orderData = (await orderRes.json()) as CreateOrderResponse;
    if (!orderRes.ok || orderData?.StatusCode !== 200) {
      throw new Error(orderData?.StatusMessage || "Order creation failed");
    }

    // 5) Use authoritative Razorpay fee/tax (already in rupees via `charges`)
    const amtRs = Number(amount);
    const feeRs = Number.isFinite(charges?.feeRs) ? +(charges!.feeRs).toFixed(2) : 0;
    const taxRs =  0;
    const finalToDealer = +(amtRs - feeRs - taxRs).toFixed(2);

     ENV === 'dev'&&console.log({
      amtRs,
      paymentMethod: methodInfo?.paymentMethod,
      cardType: methodInfo?.cardType,
      feeRs,
      taxRs,
      finalToDealer,
    });

    // 6) Trigger transfer/settlement to dealer
    try {
      const transferRes = await fetch(`${API_BASE}/api/payment/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealerCode: DealerCode ?? "UNKNOWN",
          paymentDetails: {
            id: transactionId, // pay_...
            amount: amtRs,     // RUPEES
            fee: feeRs,        // RUPEES from Razorpay details
            tax: taxRs,        // RUPEES from Razorpay details
          },
        }),
      });

      const transferData = (await transferRes.json()) as TransferResponse;
      if (!transferRes.ok) {
         ENV === 'dev'&&console.error("❌ Transfer failed:", transferData);
      } else {
         ENV === 'dev'&&console.log("✅ Transfer successful:", transferData);
      }
    } catch (transferErr) {
       ENV === 'dev'&&console.error("❌ Transfer API call failed:", transferErr);
    }

    // 7) Success UI
    router.push({
      pathname: "/components/SplashProps",
      params: {
        title: "Booking Created Successfully",
        subtitle: "Thank you for booking your ride with River Indie.",
        showSubtitle: "true",
        navigateTo: "/bookings",
        delay: "2500",
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : typeof err === "string" ? err : "Unknown error";
     ENV === 'dev'&&console.error("❌ Salesforce Order Error:", message, err);
    Alert.alert("Order creation failed", message || "Try again later");
  }
};


  const handleWhatsAppShare = () => {
    if (!paymentLink) return;
    const message = `Please complete your payment by clicking this link: ${paymentLink}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-river-blue-1 px-4 pt-6">
        <Text className="mb-4 text-river-blue-6" style={Typography.headline4}>
          Card Payment
        </Text>

        <Text className="mb-2" style={Typography.copy1}>
          Enter amount (INR)
        </Text>

        <TextField
          value={amount}
          onChangeText={(text) => {
            const digitsOnly = text.replace(/[^0-9]/g, "");
            setAmount(digitsOnly);
          }}
        />

        <TouchableOpacity
          onPress={handleSendPaymentLink}
          className="mt-6 bg-river-blue-6 p-4 rounded-full shadow-sm"
          disabled={loading}
        >
          <Text className="text-white text-center" style={Typography.copy1}>
            {loading ? "Generating..." : "Generate Payment QR"}
          </Text>
        </TouchableOpacity>

        {qrCode ? (
          <View className="mt-6 items-center">
            <View className="bg-white p-6 rounded-2xl shadow-lg mb-4">
              <Image
                source={{ uri: qrCode }}
                style={{ width: 200, height: 200 }}
                className="rounded-lg"
              />
            </View>

            <Text
              className="mt-2 text-river-blue-4 text-center mb-4"
              style={Typography.copy1}
            >
              Scan this QR code to pay
            </Text>

            <TouchableOpacity
              className="bg-river-blue-6 px-6 py-3 rounded-full flex-row items-center shadow-sm"
              onPress={handleWhatsAppShare}
            >
              <WhatsappIcon />
              <Text className="text-white text-center font-medium ml-2">
                Share via WhatsApp
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* IMPORTANT: do NOT pass linkId to confirm.
            Payment confirmation happens ONLY after polling returns pay_ id */}
        <AnimatedButtonsFooter
          handleCreateEnquiry={() => {}}
          handleCancel={() => router.back()}
          Typography={Typography}
          disableCreateEnquiry={true}
          createEnquiryText="Confirm"
          cancelText="Cancel"
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
