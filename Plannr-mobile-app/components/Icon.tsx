import React from "react"; 
import { ClipPath, Defs, G, LinearGradient, Path, Rect, Stop, Svg } from "react-native-svg";

type IconProps = {
    width: number;
    height: number;
}

const Icon = ({width, height}:IconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 48 48" fill="none">
      <G clipPath="url(#clip0)">
        {/* Background */}
        <Rect width={48} height={48} rx={12} fill="#602c66" />
        <Rect width={48} height={48} fill="url(#paint0_linear)" />

        {/* Main circular shape with brighter gradient */}
        <Path
          d="M33 25.5C33 29.6421 29.6421 33 25.5 33C21.3579 33 18 29.6421 18 25.5H12C12 32.9558 18.0442 39 25.5 39C32.9558 39 39 32.9558 39 25.5C39 18.0442 32.9558 12 25.5 12V18C29.6421 18 33 21.3579 33 25.5Z"
          fill="url(#paint1_linear)"
        />

        {/* Top-left quadrant with more vibrant highlight */}
        <Path
          opacity={0.7}
          d="M16.5 9C16.5 13.1421 13.1421 16.5 9 16.5V22.5C16.4558 22.5 22.5 16.4558 22.5 9H16.5Z"
          fill="url(#paint2_linear)"
        />

        {/* Border with slight glow */}
        <Rect x={1} y={1} width={46} height={46} rx={11} stroke="url(#paint3_linear)" strokeWidth={2} />
      </G>

      <Defs>
        <ClipPath id="clip0">
          <Rect width={48} height={48} rx={12} fill="white" />
        </ClipPath>

        {/* Background subtle shine */}
        <LinearGradient id="paint0_linear" x1={24} y1={0} x2={26} y2={48}>
          <Stop stopColor="white" stopOpacity={0} />
          <Stop offset={1} stopColor="white" stopOpacity={0.18} />
        </LinearGradient>

        {/* Main circular gradient brighter */}
        <LinearGradient id="paint1_linear" x1={25.5} y1={12} x2={25.5} y2={39}>
          <Stop stopColor="white" stopOpacity={0.9} />
          <Stop offset={1} stopColor="white" stopOpacity={0.6} />
        </LinearGradient>

        {/* Top-left quadrant gradient more lively */}
        <LinearGradient id="paint2_linear" x1={15.75} y1={9} x2={15.75} y2={22.5}>
          <Stop stopColor="white" stopOpacity={0.9} />
          <Stop offset={1} stopColor="white" stopOpacity={0.6} />
        </LinearGradient>

        {/* Border subtle glow */}
        <LinearGradient id="paint3_linear" x1={24} y1={0} x2={24} y2={48}>
          <Stop stopColor="white" stopOpacity={0.2} />
          <Stop offset={1} stopColor="white" stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

export default Icon;
