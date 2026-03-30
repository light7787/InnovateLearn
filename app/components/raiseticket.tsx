import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
const Raiseticket = () => (
  <Svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
   
  >
    <Circle cx={16} cy={16} r={16} fill="#00405D" />
    <Path
      d="M22 14.6667H17.3333V10H14.6667V14.6667H10V17.3333H14.6667V22H17.3333V17.3333H22V14.6667Z"
      fill="#F7FBFD"
    />
  </Svg>
);
export default Raiseticket;
