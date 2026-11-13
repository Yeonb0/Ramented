// app/src/components/Button.tsx
//
// 버튼 ② — 아래 테두리만 두꺼운 손그림 버튼. 누르면 눌려 들어간다
// 모양은 theme/components.ts 의 getButtonStyle 이 정한다

import React from 'react';
import { Pressable, View } from 'react-native';
import { getButtonStyle, type ButtonVariant } from '../theme';
import { Text } from './Text';

type Props = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
};

export function Button({ label, onPress, variant = 'primary' }: Props) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {({ pressed }) => {
        const S = getButtonStyle(variant, pressed);
        return (
          <View style={S.container}>
            <Text variant="body" weight="bold" style={{ color: S.labelColor }}>
              {label}
            </Text>
          </View>
        );
      }}
    </Pressable>
  );
}
