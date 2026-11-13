// app/styleguide.tsx
//
// 개발용 스타일가이드 — 토큰과 기록장 부품을 실제 렌더로 늘어놓는다
// 시안 대신 이 화면이 "앱에 들어가는 그대로"의 기준이다. 개발 빌드에서만 열린다

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import {
  borderWidth,
  colors,
  palette,
  radius,
  spacing,
  touchTarget,
} from '../src/theme';
import { contrastRatio, ContrastPairs } from '../src/theme/contrast';
import { buildMarkerSvg } from '../src/map/markerSvg';
import { Button } from '../src/components/Button';
import { NoteCard } from '../src/components/NoteCard';
import { PreviewSheet } from '../src/components/PreviewSheet';
import { Ribbon } from '../src/components/Ribbon';
import { StateView } from '../src/components/StateView';
import { Text } from '../src/components/Text';

// 시드 30곳 중 가장 긴 이름 (지점명은 따로)
const LongName = '한창희천하일면';
const Markers = [buildMarkerSvg({ variant: 'default' }), buildMarkerSvg({ variant: 'selected' })];
const noop = () => {};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="title" weight="extraBold">
        {title}
      </Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function Swatch({ hex, label }: { hex: string; label: string }) {
  return (
    <View style={styles.swatch}>
      <View style={[styles.chip, { backgroundColor: hex }]} />
      <Text variant="caption" color="textSecondary">
        {label}
      </Text>
    </View>
  );
}

export default function Styleguide() {
  if (!__DEV__) return <Redirect href="/" />;

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: '스타일가이드' }} />

      <Section title="국물 팔레트">
        {Object.entries(palette).map(([family, Stops]) => (
          <View key={family} style={styles.row}>
            {Object.entries(Stops).map(([stop, hex]) => (
              <Swatch key={stop} hex={hex} label={`${family}.${stop}`} />
            ))}
          </View>
        ))}
      </Section>

      <Section title="의미 토큰">
        <View style={styles.row}>
          {Object.entries(colors).map(([key, hex]) => (
            <Swatch key={key} hex={hex} label={key} />
          ))}
        </View>
      </Section>

      <Section title="대비">
        {ContrastPairs.map((p) => (
          <Text key={p.name} variant="footnote">
            {p.name} : {contrastRatio(p.fg, p.bg).toFixed(2)} (기준 {p.min})
          </Text>
        ))}
      </Section>

      <Section title="노트 카드 · 리본">
        <NoteCard>
          <View style={styles.ribbonOnCard}>
            <Ribbon label="토리파이탄 쇼유" />
          </View>
          <Text variant="body">카드 · 시트의 제목은 리본 띠에 쓴다.</Text>
        </NoteCard>
        <View style={styles.gap}>
          <Ribbon label={LongName} />
        </View>
      </Section>

      <Section title="버튼">
        <View style={styles.row}>
          <Button label="기록 남기기" onPress={noop} />
          <Button label="다시 시도" variant="secondary" onPress={noop} />
        </View>
      </Section>

      <Section title="마커">
        <View style={[styles.row, styles.mapTone]}>
          {Markers.map((m, i) => (
            <SvgXml key={i} xml={m.svg} width={m.width} height={m.height} />
          ))}
        </View>
      </Section>

      <Section title="미리보기 시트">
        <View style={styles.sheetStack}>
          <PreviewSheet name="멘야산다이메" branch="홍대점" tone="open" label="영업 중 · 정기 영업시간 기준" />
          <PreviewSheet name="소월옥" tone="stop" label="브레이크 타임 · 정기 영업시간 기준" />
          <PreviewSheet name={LongName} branch="망원점" tone="unknown" label="모름" />
        </View>
      </Section>

      <Section title="상태">
        <View style={styles.stateBox}>
          <StateView kind="loading" />
        </View>
        <View style={styles.stateBox}>
          <StateView kind="error" onRetry={noop} />
        </View>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: colors.paperRaised },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  section: { marginBottom: spacing.xxl },
  sectionBody: { marginTop: spacing.md, gap: spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, alignItems: 'flex-end' },
  swatch: { alignItems: 'center', gap: spacing.xs },
  chip: {
    width: touchTarget.min,
    height: touchTarget.min,
    borderRadius: radius.sm,
    borderWidth: borderWidth.inner,
    borderColor: colors.ink,
  },
  ribbonOnCard: { marginBottom: spacing.md },
  gap: { marginTop: spacing.lg },
  mapTone: { backgroundColor: palette.paitan[20], padding: spacing.lg },
  sheetStack: { gap: spacing.xxl, paddingTop: spacing.xl },
  stateBox: {
    height: touchTarget.min * 5,
    borderWidth: borderWidth.divider,
    borderColor: colors.divider,
  },
});
