// app/src/components/NoteSheet.tsx
//
// 노트 시트 — 화면 아래에 붙는 기록장 한 장 (미리보기 시트 등)
// 그림자 대신 위 테두리 한 줄로 지도와 분리한다

import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { noteSheetStyle } from '../theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function NoteSheet({ children, style }: Props) {
  return <View style={[noteSheetStyle, style]}>{children}</View>;
}
