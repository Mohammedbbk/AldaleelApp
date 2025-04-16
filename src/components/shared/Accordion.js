import React, { useState, useRef, useCallback } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';

export function Accordion({ title, children }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const isMeasured = useRef(false);

  const handleLayout = useCallback((event) => {
    if (!isMeasured.current && event.nativeEvent.layout.height > 0) {
      setContentHeight(event.nativeEvent.layout.height);
      isMeasured.current = true;
    }
  }, []);

  const toggleAccordion = useCallback(() => {
    if (!isMeasured.current || contentHeight <= 0) return;

    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 0 : contentHeight,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsExpanded(!isExpanded);
    });
  }, [isExpanded, contentHeight, animatedHeight]);

  const measurementStyle = {
    opacity: 0,
    position: 'absolute',
    zIndex: -1,
    width: '100%',
  };

  return (
    <View
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded }}
      accessibilityHint="Toggle to expand or collapse content"
    >
      {/* Measurement View */}
      {!isMeasured.current && (
        <View style={measurementStyle} onLayout={handleLayout} pointerEvents="none">
          <View className="bg-white border-t border-neutral-300">{children}</View>
        </View>
      )}

      {/* Clickable Header */}
      <TouchableOpacity onPress={toggleAccordion} activeOpacity={0.8}>
        {title}
      </TouchableOpacity>

      {/* Animated Content */}
      <Animated.View
        style={{ height: animatedHeight, overflow: 'hidden' }}
        className="bg-white border-t border-neutral-300"
      >
        {children}
      </Animated.View>
    </View>
  );
}

export default Accordion;