import React, { useEffect } from 'react';
import { useAuth } from '../../context/auth';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Pressable,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  withSpring,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


const { width, height } = Dimensions.get('window');

interface Feature {
  title: string;
  description: string;
  colors: readonly [string, string];
}

const features: Feature[] = [
  {
    title: "Algorithm Design",
    description: "Explore the fundamentals of algorithmic thinking",
    colors: ["#7B42D1", "#622EAB"] as const,
  },
  {
    title: "Interactive Quiz",
    description: "Test your knowledge with dynamic quizzes",
    colors: ["#2E8BC0", "#145DA0"] as const,
  },
  {
    title: "Maze Solver",
    description: "Visualize pathfinding algorithms in action",
    colors: ["#FF6B6B", "#EE5253"] as const,
  },
];

export default function Home() {
  const scrollY = useSharedValue(0);
  const backgroundProgress = useSharedValue(0);
  const { signOut } = useAuth();  // Change from logout to signOut


  useEffect(() => {
    backgroundProgress.value = withRepeat(
      withTiming(1, { duration: 5000 }),
      -1,
      true
    );
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const features: Feature[] = [
    {
      title: "Algorithm Design",
      description: "Explore the fundamentals of algorithmic thinking",
      colors: ["#7B42D1", "#622EAB"] as const,
    },
    {
      title: "Interactive Quiz",
      description: "Test your knowledge with dynamic quizzes",
      colors: ["#2E8BC0", "#145DA0"] as const,
    },
    {
      title: "Maze Solver",
      description: "Visualize pathfinding algorithms in action",
      colors: ["#FF6B6B", "#EE5253"] as const,
    },
  ];

  const Card = ({ feature }: { feature: Feature }) => {
    const pressed = useSharedValue(1);
    const randomOffset = useSharedValue(Math.random() * 10 - 5);
    
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { scale: pressed.value },
          { translateY: withSpring(randomOffset.value) },
          { 
            rotateX: `${interpolate(
              pressed.value,
              [1, 0.95],
              [0, 10]
            )}deg` 
          },
          { 
            rotateY: `${interpolate(
              pressed.value,
              [1, 0.95],
              [0, 5]
            )}deg` 
          }
        ],
        shadowOpacity: interpolate(
          pressed.value,
          [0.95, 1],
          [0.5, 0.2]
        ),
      } as ViewStyle;
    });
  
    // Floating animation
    useEffect(() => {
      const interval = setInterval(() => {
        randomOffset.value = Math.random() * 10 - 5;
      }, 3000);
  
      return () => clearInterval(interval);
    }, []);
  
    const handlePress = () => {
      switch (feature.title) {
        case "Algorithm Design":
          router.push('/(tabs)/material');
          break;
        case "Interactive Quiz":
          router.push('/(tabs)/quiz');
          break;
        case "Maze Solver":
          router.push('/(tabs)/maze-solver');
          break;
      }
    };
  
    const onPressIn = () => {
      pressed.value = withSpring(0.95, { damping: 15 });
    };
  
    const onPressOut = () => {
      pressed.value = withSpring(1, { damping: 15 });
    };
  
    return (
      <Pressable 
        onPressIn={onPressIn} 
        onPressOut={onPressOut}
        onPress={handlePress}
      >
        <Animated.View style={[styles.card, animatedStyle]}>
          <LinearGradient
            colors={feature.colors}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{feature.title}</Text>
              <Text style={styles.cardDescription}>
                {feature.description}
              </Text>
            </View>
            <View style={styles.cardIcon}>
              <Ionicons 
                name={
                  feature.title === "Algorithm Design" ? "code-slash" :
                  feature.title === "Interactive Quiz" ? "checkmark-circle" :
                  "grid"
                } 
                size={24} 
                color="#ffffff" 
              />
            </View>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>


  <Animated.View style={styles.header}>
      <LinearGradient
        colors={["#622eab", "#181818"]}
        style={styles.headerGradient}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Welcome Back</Text>
            <Text style={styles.headerSubtitle}>Ready to explore algorithms?</Text>
          </View>
          <TouchableOpacity 
            onPress={async () => {
              try {
                await signOut();
                router.replace('/login');  // Add router navigation
              } catch (error) {
                console.error('Error signing out:', error);
              }
            }}
            style={styles.logoutButton}
          >
            <Ionicons name="log-out-outline" size={24} color="#fefefe" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardsContainer}>
          {features.map((feature, index) => (
            <Card key={index} feature={feature} />
          ))}
        </View>


      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  container: {
    flex: 1,
    backgroundColor: '#161616',
  },
  backgroundAnimation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  header: {
    height: 200,
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fefefe',
  },
  headerSubtitle: {
    fontSize: 18,
    color: 'rgba(254, 254, 254, 0.7)',
    marginTop: 8,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  cardsContainer: {
    padding: 20,
    gap: 20,
  },
  card: {
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    margin: 2, // For shadow visibility
  },
  cardGradient: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fefefe',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  cardDescription: {
    fontSize: 16,
    color: 'rgba(254, 254, 254, 0.8)',
    lineHeight: 22,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStart: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fefefe',
    marginBottom: 20,
  },
  startButton: {
    height: 55,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fefefe',
    fontSize: 18,
    fontWeight: '600',
  },
});