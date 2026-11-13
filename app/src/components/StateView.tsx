// app/src/components/StateView.tsx
//
// 지도 화면의 불러오는 중 (U3) · 실패 + 다시 시도 (U4)

import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme';
import { Button } from './Button';
import { NoteCard } from './NoteCard';
import { Text } from './Text';

type Props = {
  kind: 'loading' | 'error';
  onRetry?: () => void;
};

export function StateView({ kind, onRetry }: Props) {
  if (kind === 'loading') {
    return (
      <View style={styles.center} accessibilityRole="progressbar">
        <ActivityIndicator color={colors.ink} />
        <Text variant="body" color="textSecondary" style={styles.gap}>
          지도를 펼치는 중
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <NoteCard style={styles.card}>
        <Text variant="subtitle" weight="bold">
          지도를 불러오지 못했어요
        </Text>
        {onRetry && (
          <View style={styles.gap}>
            <Button label="다시 시도" variant="secondary" onPress={onRetry} />
          </View>
        )}
      </NoteCard>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    alignItems: 'center',
  },
  gap: {
    marginTop: spacing.md,
  },
});
