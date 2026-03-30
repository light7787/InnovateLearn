import Typography from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getValidAccessToken } from "../auth/auth.service";
import { useLocalSearchParams } from "expo-router";

import Constants from "expo-constants";
import { API_BASE, ENV } from "@/constants/env";

interface CommentItem {
  Order__c: string;
  oId: string;
  Id: string;
  Description__c: string;
  CreatedDate: string;
}


const invalidateBookingsCache = async () => {
    try {
      const token = await getValidAccessToken();
      const profile = await AsyncStorage.getItem('userProfile');
      if (!profile) return;

      const { UserId } = JSON.parse(profile);
      
      // Call the cache invalidation endpoint
      await fetch(`${API_BASE}/api/data/invalidate-cache`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserId,
          cacheKey: 'bookings'
        }),
      });
      
      ENV === 'dev'&&console.log('🗑️ Bookings cache invalidated');
    } catch (error) {
      ENV === 'dev'&&console.error('❌ Failed to invalidate bookings cache:', error);
    }
  };

const FollowUpIndividual = () => {
  // const API_BASE = Constants.expoConfig?.extra?.API_BASE;
  ENV === 'dev'&&console.log("API_BASE:", API_BASE);
  const { oId, comments = "[]", orderId } = useLocalSearchParams();
  ENV === 'dev'&&console.log("oId:", oId);

  const [comment, setComment] = useState("");

  const [commentHistory, setCommentHistory] = useState<CommentItem[]>(() => {
    try {
      const parsed = JSON.parse(
        typeof comments === "string" ? comments : comments[0]
      );
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      ENV === 'dev'&&console.warn("Invalid comment JSON:", e);
      return [];
    }
  });
  ENV === 'dev'&&console.log(commentHistory);
  const isSubmitActive = comment.trim().length > 0;

  // Animated value for submit button
  const submitAnim = useRef<Animated.Value>(new Animated.Value(0)).current;

  // Animation function
  const animatePress = (
    animValue: Animated.Value,
    toValue: number,
    duration: number = 150
  ): void => {
    Animated.timing(animValue, {
      toValue,
      duration,
      useNativeDriver: false,
    }).start();
  };

  // Interpolate colors for Submit button
  const submitBgColor: Animated.AnimatedInterpolation<string> =
    submitAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [isSubmitActive ? "#00405D" : "#CEE9F5", "yellow"],
    });

  const submitTextColor: Animated.AnimatedInterpolation<string> =
    submitAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [isSubmitActive ? "#FFFFFF" : "#61AFD2", "#000000"],
    });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    if (
      !isSubmitActive ||
      !orderId ||
      typeof orderId !== "string" ||
      isSubmitting
    )
      return;

    setIsSubmitting(true); // start processing

    try {
      const token = await getValidAccessToken();
      const userProfile = await AsyncStorage.getItem("userProfile");

      if (!userProfile) throw new Error("User profile not found");

      const { UserId } = JSON.parse(userProfile);
      const orderIdFromComment = oId;
      if (!isSubmitActive || !orderIdFromComment) return;

      const payload = {
        UserId,
        OrderId: orderIdFromComment,
        Comments: comment.trim(),
      };

      ENV === 'dev'&&console.log("🚀 Submitting comment:", payload);

      const res = await fetch(`${API_BASE}/api/data/OrderComments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      await invalidateBookingsCache()    ;
      if (!res.ok)
        throw new Error(data?.StatusMessage || "Failed to submit comment");

      setCommentHistory((prev) => [
        ...prev,
        {
          Id: Date.now().toString(),
          Description__c: comment.trim(),
          Order__c: orderId,
          CreatedDate: new Date().toISOString(),
          oId: typeof oId === "string" ? oId : oId?.[0] || "",
        },
      ]);

      setComment("");

      router.push({
        pathname: "/components/SplashProps",
        params: {
          title: "Payment comment submitted",
          subtitle: "Your payment comment has been recorded successfully",
          showSubtitle: "true",
          navigateTo: "/bookings",
          delay: "2500",
        },
      });
    } catch (err: any) {
      ENV === 'dev'&&console.error("❌ Error submitting comment:", err.message || err);
    } finally {
      setIsSubmitting(false); // end processing
    }
  };

  const handleCancel = (): void => {
    setComment("");
    router.back();
  };

  return (
    <View className="flex-1 bg-[#E6F4FA]">
      <View className="w-full max-w-[390px] mx-auto px-6 py-8">
        {/* Main Content */}
        <ScrollView
          contentContainerStyle={{
            paddingTop: 16, // Reduced from 56 to bring content higher
            paddingBottom: 24,
          }}
        >
          {/* Comment Section */}
          <View className="mb-6">
            <Text
              style={[
                Typography.headline4,
                { color: "#00405D", marginBottom: 28 },
              ]}
            >
              Comment
            </Text>
            <View className="flex-col gap-2">
              <Text style={[Typography.headline4, { color: "#00405D" }]}>
                Payment Comment from last Interaction with Customer
              </Text>
              <TextInput
                style={[
                  Typography.copy1,
                  {
                    height: 213,
                    padding: 16,
                    backgroundColor: "#CEE9F5",
                    borderRadius: 24,
                    color: "#007DB6",
                    textAlignVertical: "top",
                  },
                ]}
                // placeholder="Enter your com"
                multiline
                textAlignVertical="top"
                value={comment}
                onChangeText={setComment}
              />
              <View className="flex-row gap-4 pt-2">
                {/* Animated Submit Button */}
                <TouchableOpacity
                  activeOpacity={1}
                  onPressIn={() =>
                    isSubmitActive &&
                    !isSubmitting &&
                    animatePress(submitAnim, 1)
                  }
                  onPressOut={() =>
                    isSubmitActive &&
                    !isSubmitting &&
                    animatePress(submitAnim, 0)
                  }
                  onPress={handleSubmit}
                  disabled={!isSubmitActive || isSubmitting}
                  style={{ flex: 1 }}
                >
                  <Animated.View
                    style={{
                      height: 48,
                      borderRadius: 24,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: submitBgColor,
                      opacity: isSubmitting ? 0.6 : 1, // dim while processing
                    }}
                  >
                    <Animated.Text
                      style={[Typography.headline5, { color: submitTextColor }]}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Animated.Text>
                  </Animated.View>
                </TouchableOpacity>
                {/* Cancel Button (keeping original style) */}
                <TouchableOpacity
                  className="flex-1 h-12 rounded-3xl border border-[#007DB6] justify-center items-center"
                  onPress={handleCancel}
                >
                  <Text style={[Typography.headline5, { color: "#007DB6" }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Comments History Section */}
          <View className="mt-6 mb-8">
            <View className="flex-row items-center justify-between p-3 px-6 bg-[#CEE9F5] rounded-3xl border border-[#007DB6]">
              <Text style={[Typography.headline4, { color: "#007DB6" }]}>
                Comments History
              </Text>
              <Ionicons name="chevron-down" size={24} color="#2563eb" />
            </View>
            {commentHistory.length > 0 ? (
              <View className="mt-4 bg-[#CEE9F5] rounded-2xl p-4 px-4">
                {commentHistory.map((item, index) => (
                  <View key={item.Id || index} className="pt-2">
                    <Text
                      style={[
                        Typography.headline4,
                        { color: "#007DB6", marginBottom: 16 },
                      ]}
                    >
                      {new Date(item.CreatedDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                    <View className="h-px bg-[#007DB6] mb-6" />
                    <Text
                      style={[
                        Typography.headline6B,
                        { color: "#007DB6", marginBottom: 4 },
                      ]}
                    >
                      {item.Description__c || "No Comment"}
                    </Text>
                    <Text style={[Typography.copy2, { color: "#61AFD2" }]}>
                      Comment
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text
                style={[Typography.copy2, { color: "#007DB6", marginTop: 16 }]}
              >
                No previous comments found.
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default FollowUpIndividual;
