import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { Card } from 'react-native-paper';

type StatsCardProps = {
  title: string;
  value: string;
};

const StatsCard = ({ title, value }: StatsCardProps) => {
  return (
    <Card className="rounded-lg bg-white shadow-md p-6 m-6 mt-4 w-[45%] h-[45%] mb-4 flex flex-col justify-center items-center">
      <Card.Content className="flex flex-col justify-center items-center">
        <Text className="text-3xl font-bold  ">
          {value}
        </Text>
        <Text className="text-gray-600 text-xl font-medium  ">
          {title}
        </Text>
      </Card.Content>
    </Card>
  );
};

const StatsDashboard = () => {
  const statsData = [
    { title: 'Total Enquiries', value: '1,245' },
    { title: 'Test Rides', value: '876' },
    { title: 'Follow Ups', value: '543' },
    { title: 'Bookings', value: '321' },
    { title: 'Retails', value: '210' },
    { title: 'Pending', value: '89' },
  ];

  return (
    <ScrollView contentContainerClassName="flex-row flex-wrap justify-between p-2">
      {statsData.map((stat, index) => (
        <StatsCard key={index} title={stat.title} value={stat.value} />
      ))}
    </ScrollView>
  );
};

export default StatsDashboard;