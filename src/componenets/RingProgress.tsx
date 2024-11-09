import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type RingProgressProps = {
  radius?: number;
  strokeWidth?: number;
  progress: number;
};
const color = "#EE0F55";

const RingProgress = ({
  radius = 100,
  strokeWidth = 35,
  progress,
}: RingProgressProps) => {
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;

  const fill = useSharedValue(0.4);

  useEffect(() => {
    fill.value = withTiming(progress, {duration: 1500});
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: [circumference * fill.value, circumference],
  }));
  return (
    <View
      style={{
        width: radius * 2,
        height: radius * 2,
        alignSelf: "center",
        // backgroundColor: "green",
      }}
    >
      <Svg>
        {/* Background */}
        <Circle
          cx={radius}
          cy={radius}
          r={innerRadius}
          //   fill= {'blue'}
          strokeWidth={strokeWidth}
          stroke={color}
          opacity={0.2}
        />
        {/* Front */}
        <AnimatedCircle
          animatedProps={animatedProps}
          r={innerRadius}
          cx={radius}
          cy={radius}
          originX={radius}
          originY={radius}
          //   fill= {'blue'}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeLinecap="round"
          rotation={-90}
        />
      </Svg>
    </View>
  );
};

export default RingProgress;
