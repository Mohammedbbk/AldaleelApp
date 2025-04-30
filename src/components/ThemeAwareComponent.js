import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../ThemeProvider';

/**
 * ThemeAwareComponent provides a set of theme-aware styles and colors
 * that can be used throughout the application to ensure consistent theming.
 */
export const ThemeAwareComponent = {
  // Common style generator for various components
  getStyles: (isDarkMode) => {
    return StyleSheet.create({
      // Container styles
      container: {
        backgroundColor: isDarkMode ? '#111827' : '#FFFFFF',
      },
      safeArea: {
        flex: 1,
        backgroundColor: isDarkMode ? '#111827' : '#FFFFFF',
      },
      card: {
        backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
        borderColor: isDarkMode ? '#374151' : '#E5E7EB',
        shadowColor: isDarkMode ? '#000000' : '#000000',
        shadowOpacity: isDarkMode ? 0.3 : 0.1,
      },
      
      // Text styles
      title: {
        color: isDarkMode ? '#F9FAFB' : '#111827',
        fontWeight: 'bold',
      },
      subtitle: {
        color: isDarkMode ? '#D1D5DB' : '#4B5563',
      },
      body: {
        color: isDarkMode ? '#E5E7EB' : '#1F2937',
      },
      caption: {
        color: isDarkMode ? '#9CA3AF' : '#6B7280',
      },
      
      // Input styles
      input: {
        backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
        borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
        color: isDarkMode ? '#F9FAFB' : '#111827',
      },
      
      // Button styles
      primaryButton: {
        // Color comes from theme color
      },
      secondaryButton: {
        backgroundColor: isDarkMode ? '#4B5563' : '#E5E7EB',
      },
      disabledButton: {
        backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
      },
      
      // Separator
      separator: {
        backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
      },
    });
  },
  
  // Common colors
  getColors: (isDarkMode) => {
    return {
      background: isDarkMode ? '#111827' : '#FFFFFF',
      surface: isDarkMode ? '#1F2937' : '#F9FAFB',
      text: isDarkMode ? '#F9FAFB' : '#111827',
      textSecondary: isDarkMode ? '#D1D5DB' : '#4B5563',
      border: isDarkMode ? '#374151' : '#E5E7EB',
      disabled: isDarkMode ? '#6B7280' : '#9CA3AF',
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
      info: '#3B82F6',
    };
  }
};

/**
 * Custom hook to use theme-aware styles and colors
 */
export const useThemeAwareStyles = () => {
  const { isDarkMode, colors } = useTheme();
  
  return {
    styles: ThemeAwareComponent.getStyles(isDarkMode),
    colors: {
      ...ThemeAwareComponent.getColors(isDarkMode),
      primary: colors.primary,
      secondary: colors.secondary,
    },
    isDarkMode,
  };
};

/**
 * Theme wrapper component to provide consistent styling for child components
 */
export const ThemedView = ({ children, style, ...props }) => {
  const { styles } = useThemeAwareStyles();
  
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
};

/**
 * Theme wrapper component for text
 */
export const ThemedText = ({ children, variant = 'body', style, ...props }) => {
  const { styles } = useThemeAwareStyles();
  
  const getTextStyle = () => {
    switch (variant) {
      case 'title':
        return styles.title;
      case 'subtitle':
        return styles.subtitle;
      case 'caption':
        return styles.caption;
      case 'body':
      default:
        return styles.body;
    }
  };
  
  return (
    <Text style={[getTextStyle(), style]} {...props}>
      {children}
    </Text>
  );
}; 