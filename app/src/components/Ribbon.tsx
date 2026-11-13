// app/src/components/Ribbon.tsx
//
// 리본 — 제목 띠 (살짝 삐뚤어진 네모)
// 모양은 theme/components.ts 의 ribbonStyle 이 정한다. 글자가 커지면 띠도 같이 커진다

import React from 'react';
import { View } from 'react-native';
import { ribbonStyle } from '../theme';
import { Text } from './Text';

type Props = {
  label: string;
  numberOfLines?: number;
};

export function Ribbon({ label, numberOfLines = 1 }: Props) {
  return (
    <View style={ribbonStyle}>
      <Text
        variant="subtitle"
        weight="bold"
        color="onRibbon"
        numberOfLines={numberOfLines}
        style={{ textAlign: 'center' }}
      >
        {label}
      </Text>
    </View>
  );
}
