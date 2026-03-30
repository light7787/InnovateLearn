import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
const CardDetialsIcon = () => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
 
  >
    <G clipPath="url(#clip0_2257_14142)">
      <Path
        d="M6.97199 17L4.95896 14.9863L10.5524 9.39349L-4 9.39349L-4 6.54621L10.5482 6.54622L5.04082 1.03887L7.05385 -0.974874L16 7.97199L6.97199 17Z"
        fill="#00405D"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_2257_14142">
        <Rect
          width={16}
          height={16}
          fill="white"
          transform="matrix(-1 0 0 1 16 0)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default CardDetialsIcon;
