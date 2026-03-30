import * as React from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Circle, Path } from "react-native-svg";

interface ProfileIconProps {
  onPress?: () => void;
  size?: number;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ 
  onPress, 
  size = 32 
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Default navigation to profile
      router.push('/profile');
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
      >
        <Circle cx={16} cy={16} r={16} fill="#F7FBFD" />
        <Path
          d="M16 7.66699C16.8241 7.66699 17.6297 7.91136 18.3149 8.3692C19.0001 8.82704 19.5342 9.47779 19.8495 10.2391C20.1649 11.0005 20.2474 11.8383 20.0866 12.6465C19.9259 13.4548 19.529 14.1972 18.9463 14.7799C18.3636 15.3627 17.6212 15.7595 16.8129 15.9203C16.0046 16.081 15.1669 15.9985 14.4055 15.6832C13.6441 15.3678 12.9934 14.8337 12.5356 14.1485C12.0777 13.4633 11.8334 12.6577 11.8334 11.8337L11.8375 11.6528C11.8841 10.5801 12.343 9.56681 13.1185 8.82421C13.8941 8.08161 14.9263 7.66705 16 7.66699ZM17.6667 17.667C18.7718 17.667 19.8316 18.106 20.613 18.8874C21.3944 19.6688 21.8334 20.7286 21.8334 21.8337V22.667C21.8334 23.109 21.6578 23.5329 21.3452 23.8455C21.0326 24.1581 20.6087 24.3337 20.1667 24.3337H11.8334C11.3913 24.3337 10.9674 24.1581 10.6548 23.8455C10.3423 23.5329 10.1667 23.109 10.1667 22.667V21.8337C10.1667 20.7286 10.6057 19.6688 11.3871 18.8874C12.1685 18.106 13.2283 17.667 14.3334 17.667H17.6667Z"
          fill="#007DB6"
        />
      </Svg>
    </TouchableOpacity>
  );
};

export default ProfileIcon;
