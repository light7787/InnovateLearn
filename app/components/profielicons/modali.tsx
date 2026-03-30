import * as React from "react";
import Svg, { Circle, Rect } from "react-native-svg";
const Modali = () => (
  <Svg width={18} height={18} viewBox="0 0 48 48">
    <Circle fill="#00405D" cx={24} cy={24} r={21} />
    <Rect x={22} y={22} fill="#ffffff" width={4} height={11} />
    <Circle fill="#ffffff" cx={24} cy={16.5} r={2.5} />
  </Svg>
);

export default Modali;