import React, { useState, useRef, useCallback } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';

export function Accordion({ title, children }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const isMeasured = useRef(false);

  const handleLayout = useCallback((event) => {
    const measuredHeight = event.nativeEvent.layout.height;
    if (!isMeasured.current && measuredHeight > 0) {
      console.log('[Accordion] Content measured height:', measuredHeight);
      setContentHeight(measuredHeight);
      isMeasured.current = true;
    }
  }, []);

  const toggleAccordion = useCallback(() => {
    if (!isMeasured.current || contentHeight <= 0) {
      console.warn('[Accordion] Toggle prevented. Measured:', isMeasured.current, 'Height:', contentHeight);
      return;
    }

    const expanding = !isExpanded;
    setIsExpanded(expanding);
    console.log('[Accordion] Toggling state to:', expanding ? 'Expanded' : 'Collapsed');

    Animated.timing(animatedHeight, {
      toValue: expanding ? contentHeight : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
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
      {!isMeasured.current && (
        <View style={measurementStyle} onLayout={handleLayout} pointerEvents="none">
          {children}
        </View>
      )}

      <TouchableOpacity onPress={toggleAccordion} activeOpacity={0.8}>
        {title}
      </TouchableOpacity>

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