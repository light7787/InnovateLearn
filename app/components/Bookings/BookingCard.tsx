// src/components/TestRideDetailsCard.tsx
import Typography from '@/constants/typography';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef } from 'react';
import { Linking, Pressable, Text, TouchableOpacity, View } from 'react-native';
import WhatsappIcon from '../Whatsapp';
import { Divider } from 'react-native-paper';
import CardDetialsIcon from '../carddetails';
import { ENV } from '@/constants/env';


interface TestRideDetailsCardProps {
 orderId?: string;
 orderIdFromComment?:string;
 orderStatus?: string;
 leadName: string;
 remainingAmount: number;
 phoneNumber?: string;
 comments?: any[]; // optional for now
}


const TestRideDetailsCard: React.FC<TestRideDetailsCardProps> = ({
 orderId,
 orderIdFromComment,
 orderStatus,
 leadName,
 remainingAmount,
 phoneNumber,
 comments   // fallback
}) => {
 // Navigation protection ref
 const isNavigatingRef = useRef(false);


 const getStatusColor = (status: string): string => {
   switch (status) {
     case 'Booking Confirmed':
       return '#15CA5D';
     case 'Payment Pending':
       return '#FFA500';
     case 'Invoicing': 
       return '#FFA500';
     case 'RTO Registration in Process':
       return '#007DB6';
     case 'Ready for Delivery':
       return '#15CA5D';
     default:
       return '#007DB6';
   }
 };


 const resolvedStatus = orderStatus ?? 'Booking Confirmed';
 const resolvedOrderId = orderId ?? '001';


 // Protected handler for phone call
 const handleCallWithNavigation = () => {
   if (isNavigatingRef.current) return;
  
   isNavigatingRef.current = true;
  
   // Call the original handler
   handleCall();
  
   // Reset navigation flag after delay
   setTimeout(() => {
     isNavigatingRef.current = false;
   }, 1000); // Adjust as needed
 };


 const handleCall = () => {
   Linking.openURL(`tel:${9876521390}`);
 };


 // Protected handler for WhatsApp
 const handleWhatsAppWithNavigation = () => {
   if (isNavigatingRef.current) return;
  
   isNavigatingRef.current = true;
  
   // Call the original handler
   handleWhatsApp();
  
   // Reset navigation flag after delay
   setTimeout(() => {
     isNavigatingRef.current = false;
   }, 1000); // Adjust as needed
 };


 // Function to open WhatsApp
 const handleWhatsApp = () => {
   Linking.openURL(`https://wa.me/+91${phoneNumber}`);
 };


 // Protected handler for view details navigation
 const handleViewDetailsWithNavigation = () => {
   if (isNavigatingRef.current) return;
  
   isNavigatingRef.current = true;
   ENV === 'dev'&&console.log('Navigating to bookings comment with orderId:', orderIdFromComment);
   // Navigate to bookings comment
    ENV === 'dev'&&console.log(resolvedOrderId)
    ENV === 'dev'&&console.log(orderIdFromComment)
router.push({
 pathname: '/bookings/comment',
 params: {
   orderId: resolvedOrderId,
   leadName: leadName,
   comments: JSON.stringify(comments || []),
   oId:orderIdFromComment
 },
});
  
   // Reset navigation flag after delay
   setTimeout(() => {
     isNavigatingRef.current = false;
   }, 1000); // Adjust as needed
 };


 return (
   <Pressable
     className="w-88 flex flex-col gap-4 p-4 bg-river-blue-2 rounded-2xl overflow-hidden"
     onPress={handleViewDetailsWithNavigation}
   >
     {/* Lead Info Section */}
     <View className="flex flex-col gap-1 w-full">
       <View className="flex flex-row justify-between items-center pb-3">
         <Text style={Typography.headline4} className="text-river-blue-6 flex-1 mr-2">
            {leadName}
         </Text>
         <View className="flex flex-row items-center gap-4">
           <TouchableOpacity onPress={handleCallWithNavigation}>
             <Text
               className="text-river-blue-5 "
               style={[Typography.copy2,{letterSpacing:1.2}]}
             >
               {phoneNumber}
             </Text>
           </TouchableOpacity>
           <TouchableOpacity onPress={handleWhatsAppWithNavigation}>
             <WhatsappIcon />
           </TouchableOpacity>
         </View>
       </View>


       <Divider style={{ backgroundColor: '#61AFD2', height: 1 }} />


       <View className="flex flex-row justify-between items-start relative">
         <View className="flex flex-col items-center pr-16 gap-1 flex-1 pt-4">
           <Text style={Typography.headline6B} className="text-river-blue-6">
             {resolvedOrderId}
           </Text>
           <Text style={Typography.copy2} className="text-river-blue-5 ">
             Order ID
           </Text>
         </View>


         {/* Vertical divider positioned to align with Order Status text */}
         <View className="absolute left-36 top-0 w-[1px] h-[64px] bg-river-blue-4" />


         <View className="flex flex-col items-center gap-1 flex-1 pt-4">
           <Text style={Typography.headline6B} className="text-river-blue-6">
             {remainingAmount.toLocaleString('en-IN')} INR
           </Text>
           <Text style={Typography.copy2} className="text-river-blue-5">
             Remaining Amount
           </Text>
         </View>
       </View>
     </View>


     {/* Status Section */}
     <View className="flex flex-row justify-between items-center pl-0 pt-4 gap-6 ">
       <Text style={Typography.subline2} className="text-river-blue-6 ">
         Order Status:
       </Text>
       <View
         className="flex flex-row items-center justify-center py-1.5 px-4 rounded-full w-60 "
         style={{ backgroundColor: getStatusColor(resolvedStatus) }}
       >
         <Text style={[Typography.subline2, { color: 'white' }]}>
           {resolvedStatus}
         </Text>
       </View>
     </View>


     {/* View Details Footer */}
     <TouchableOpacity
       onPress={handleViewDetailsWithNavigation}
       className="flex flex-row items-center justify-end gap-4"
     >
       <Text
         style={Typography.subline2}
         className="font-semibold text-river-blue-6"
       >
         View details
       </Text>
       <CardDetialsIcon/>
     </TouchableOpacity>
   </Pressable>
 );
};


export default TestRideDetailsCard;



