// app/src/components/PreviewSheet.tsx
//
// 가게 미리보기 시트 (breadboard P1.2 · U8) — 표시 전용
// 마커를 누르면 지도 아래에 붙는 노트 한 장. 리본에 가게 이름, 아래에 영업 상태 문구
// 문구와 톤은 서버 값을 그대로 받는다. 여기서 영업 여부를 계산하지 않는다
// "가게 보기" (U9) 는 Phase 2 에서 붙인다

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ribbon, spacing, toneColor, type OpenTone } from '../theme';
import { NoteSheet } from './NoteSheet';
import { Ribbon } from './Ribbon';
import { Text } from './Text';

type Props = {
  name: string;
  tone: OpenTone;
  label: string;
};

export function PreviewSheet({ name, tone, label }: Props) {
  return (
    <NoteSheet>
      <View style={styles.ribbonSlot}>
        <Ribbon label={name} numberOfLines={2} />
      </View>
      <Text variant="body" weight="bold" style={[styles.label, { color: toneColor(tone) }]}>
        {label}
      </Text>
    </NoteSheet>
  );
}

const styles = StyleSheet.create({
  // 리본을 시트 위 테두리에 반쯤 걸쳐 놓는다
  ribbonSlot: {
    marginTop: -ribbon.height / 2,
  },
  label: {
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
