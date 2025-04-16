import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export function DetailItem({ label, value }) {
  const { t } = useTranslation();

  return (
    <View 
      className="flex-row p-2.5"
      accessible={true}
      accessibilityLabel={`${label || ''}: ${value || ''}`}
      accessibilityRole="text"
    >
      {label && <Text className="text-sm text-neutral-500 mb-1">{label}</Text>}
      {value && <Text className="text-base font-medium text-neutral-700">{value}</Text>}
    </View>
  );
}

export default DetailItem;