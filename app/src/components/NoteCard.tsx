// app/src/components/NoteCard.tsx
//
// 노트 카드 — 기록장 한 장. 모든 카드의 바탕

import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { noteCardStyle } from '../theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function NoteCard({ children, style }: Props) {
  return <View style={[noteCardStyle, style]}>{children}</View>;
}
