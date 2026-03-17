import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

type MenuItem = {
  id: string;
  label: string;
  icon: string;
  color: string;
  active?: boolean;
  onPress: () => void;
};

type Props = {
  isDarkMode: boolean;
  items: MenuItem[];
};

export default function FloatingActionMenu({ isDarkMode, items }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    if (menuOpen) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setMenuOpen(false));
    } else {
      setMenuOpen(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const backgroundColor = isDarkMode ? '#2d3748' : '#ffffff';
  const textColor = isDarkMode ? '#f7fafc' : '#1a202c';
  const secondaryTextColor = isDarkMode ? '#a0aec0' : '#718096';

  return (
    <>
      {/* Menu Items */}
      {menuOpen && (
        <BlurView
          intensity={30}
          tint={isDarkMode ? "dark" : "light"}
          style={{
            position: 'absolute',
            bottom: 100,
            right: 20,
            borderRadius: 16,
            overflow: 'hidden',
            width: 200,
            zIndex: 1000,
          }}
        >
          <View style={{ backgroundColor: isDarkMode ? 'rgba(45, 55, 72, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}>
            <View style={{ paddingVertical: 12 }}>
              {items.map((item, index) => (
                <Animated.View
                  key={item.id}
                  style={{
                    opacity: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                    transform: [
                      {
                        translateY: animation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      backgroundColor: item.active ? 
                        (isDarkMode ? 'rgba(66, 153, 225, 0.2)' : 'rgba(66, 153, 225, 0.1)') : 
                        'transparent',
                    }}
                    onPress={() => {
                      item.onPress();
                      if (item.id !== 'weather') {
                        toggleMenu();
                      }
                    }}
                  >
                    <View 
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: item.active ? item.color : 
                          (isDarkMode ? 'rgba(74, 85, 104, 0.3)' : 'rgba(237, 242, 247, 0.8)'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        color: textColor,
                        fontWeight: '600',
                        fontSize: 14,
                      }}>
                        {item.label}
                      </Text>
                      {item.id === 'weather' && (
                        <Text style={{
                          color: secondaryTextColor,
                          fontSize: 11,
                          marginTop: 2,
                        }}>
                          Tap to change layer
                        </Text>
                      )}
                    </View>
                    {item.active && (
                      <View style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: item.color,
                        marginLeft: 8,
                      }} />
                    )}
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        </BlurView>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 100,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: menuOpen ? '#4299e1' : (isDarkMode ? '#2d3748' : '#ffffff'),
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
          zIndex: 1001,
        }}
        onPress={toggleMenu}
      >
        <Animated.View
          style={{
            transform: [
              {
                rotate: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '45deg'],
                }),
              },
            ],
          }}
        >
          <Text style={{ fontSize: 24, color: menuOpen ? '#fff' : (isDarkMode ? '#fff' : '#4299e1') }}>
            {menuOpen ? '✕' : '⚙️'}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </>
  );
}