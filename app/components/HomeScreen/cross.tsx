import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";
const Delete = () => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
  
  >
    <Rect width={16} height={16} rx={8} fill="#00405D" />
    <Path
      d="M5.33341 11.3337L4.66675 10.667L7.33342 8.00033L4.66675 5.33366L5.33341 4.66699L8.00008 7.33366L10.6667 4.66699L11.3334 5.33366L8.66675 8.00033L11.3334 10.667L10.6667 11.3337L8.00008 8.66699L5.33341 11.3337Z"
      fill="#F7FBFD"
    />
  </Svg>
);
export default Delete;
