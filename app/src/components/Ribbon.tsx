// app/src/components/Ribbon.tsx
//
// 리본 — 양 끝이 V자로 파인 제목 띠
// 글자 폭에 맞춰 늘어나도록 onLayout 으로 실제 크기를 재고, 그 크기로 path 를 그린다
// 글자 크기를 키운 기기에서도 잘리지 않게 높이는 최소값만 정하고 내용에 따라 커진다

import React, { useState } from 'react';
import { View, StyleSheet, type LayoutChangeEvent } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { ribbon, ribbonPath } from '../theme';
import { Text } from './Text';

type Props = {
  label: string;
  numberOfLines?: number;
};

export function Ribbon({ label, numberOfLines = 1 }: Props) {
  const [Size, setSize] = useState<{ w: number; h: number } | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ w: width, h: height });
  };

  const Inset = ribbon.strokeWidth / 2;

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      {Size && (
        <Svg style={StyleSheet.absoluteFill} width={Size.w} height={Size.h}>
          <G x={Inset} y={Inset}>
            <Path
              d={ribbonPath(Size.w - ribbon.strokeWidth, Size.h - ribbon.strokeWidth)}
              fill={ribbon.fill}
              stroke={ribbon.stroke}
              strokeWidth={ribbon.strokeWidth}
              strokeLinejoin="round"
            />
          </G>
        </Svg>
      )}
      <Text
        variant="subtitle"
        weight="bold"
        color="onRibbon"
        numberOfLines={numberOfLines}
        style={styles.label}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    minHeight: ribbon.height,
    justifyContent: 'center',
    paddingHorizontal: ribbon.paddingHorizontal,
  },
  label: {
    textAlign: 'center',
  },
});
