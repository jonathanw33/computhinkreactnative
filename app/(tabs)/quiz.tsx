import { AntDesign } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Pressable,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';

// Interfaces
interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

interface QuizResultsProps {
  questions: Question[];
  answers: { [key: number]: number };
  onTryAgain: () => void;
}

interface Styles {
  container: ViewStyle;
  mainContainer: ViewStyle;
  headerContainer: ViewStyle;
  headerGradient: ViewStyle; 
  optionGradient: ViewStyle;  
  navButtonGradient: ViewStyle;  
  title: TextStyle;
  counterWrapper: ViewStyle;
  counter: TextStyle;
  progressBar: ViewStyle;
  progressFill: ViewStyle;
  contentContainer: ViewStyle;
  question: TextStyle;
  optionsContainer: ViewStyle;
  option: ViewStyle;
  selectedOption: ViewStyle;
  optionText: TextStyle;
  selectedOptionText: TextStyle;
  navigationContainer: ViewStyle;
  navButton: ViewStyle;
  navButtonText: TextStyle;  
  prevButton: ViewStyle;
  nextButton: ViewStyle;
  prevButtonText: TextStyle;
  nextButtonText: TextStyle;
  disabledButton: ViewStyle;
  disabledButtonText: TextStyle;
  resultsContainer: ViewStyle;
  resultTitle: TextStyle;
  resultsList: ViewStyle;
  resultItem: ViewStyle;
  resultQuestion: TextStyle;
  resultAnswer: ViewStyle;
  correctAnswer: ViewStyle;
  incorrectAnswer: ViewStyle;
  answerText: TextStyle;
  correctAnswerText: TextStyle;
  scoreContainer: ViewStyle;
  scoreText: TextStyle;
  tryAgainButton: ViewStyle;
  tryAgainText: TextStyle;
}

const { width, height } = Dimensions.get('window');

// QuizResults Component
const QuizResults: React.FC<QuizResultsProps> = ({ questions, answers, onTryAgain }) => (
  <ScrollView style={styles.resultsContainer}>
    <Text style={styles.resultTitle}>Quiz Results</Text>
    <View style={styles.resultsList}>
      {questions.map((question, index) => (
        <View key={index} style={styles.resultItem}>
          <Text style={styles.resultQuestion}>{question.question}</Text>
          <View style={[
            styles.resultAnswer,
            answers[index] === question.correct ? styles.correctAnswer : styles.incorrectAnswer
          ]}>
            <Text style={styles.answerText}>
              Your answer: {question.options[answers[index]]}
            </Text>
            {answers[index] !== question.correct && (
              <Text style={styles.correctAnswerText}>
                Correct answer: {question.options[question.correct]}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>

    <View style={styles.scoreContainer}>
      <Text style={styles.scoreText}>
        Score: {questions.filter((q, i) => answers[i] === q.correct).length} out of {questions.length}
      </Text>
    </View>

    <TouchableOpacity
      style={styles.tryAgainButton}
      onPress={onTryAgain}
    >
      <AntDesign name="reload1" size={20} color="#fff" />
      <Text style={styles.tryAgainText}>Try Again</Text>
    </TouchableOpacity>
  </ScrollView>
);

// OptionButton Component
const OptionButton: React.FC<{
  option: string;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ option, isSelected, onSelect }) => {
  const scale = useSharedValue(1);
  const bounce = useSharedValue(1);

  useEffect(() => {
    if (isSelected) {
      bounce.value = withSequence(
        withTiming(1.1, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
    }
  }, [isSelected]);

  const onPressIn = () => {
    scale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * bounce.value },
    ],
  }));

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onSelect}
    >
      <Animated.View style={[styles.option, animatedStyle]}>
        <LinearGradient
          colors={isSelected ? ['#7B42D1', '#622EAB'] : ['#fff', '#f8f8f8']}
          style={styles.optionGradient}
        >
          <Text style={[
            styles.optionText,
            isSelected && styles.selectedOptionText
          ]}>
            {option}
          </Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

// QuizContent Component
const QuizContent: React.FC<{
  currentQuestion: number;
  questions: Question[];
  answers: { [key: number]: number };
  handleAnswer: (index: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
}> = ({ currentQuestion, questions, answers, handleAnswer, handleNext, handlePrevious }) => {
  const progressValue = useSharedValue(0);
  const headerScale = useSharedValue(1);
  const questionSlide = useSharedValue(width);

  useEffect(() => {
    progressValue.value = withTiming((currentQuestion + 1) / questions.length, { duration: 1000 });
    questionSlide.value = withSequence(
      withTiming(width, { duration: 0 }),
      withSpring(0, { damping: 15 })
    );
    headerScale.value = withSequence(
      withTiming(1.05, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  }, [currentQuestion]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  const questionStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: questionSlide.value }],
  }));

  return (
    <View style={styles.mainContainer}>
      <Animated.View style={[styles.headerContainer, headerStyle]}>
        <LinearGradient
          colors={['#7B42D1', '#622EAB']}
          style={styles.headerGradient}
        >
          <Text style={styles.title}>Computational Thinking Quiz</Text>
          <View style={styles.counterWrapper}>
            <Text style={styles.counter}>
              Question {currentQuestion + 1} of {questions.length}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View style={[styles.contentContainer, questionStyle]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.question}>{questions[currentQuestion].question}</Text>
          
          <View style={styles.optionsContainer}>
            {questions[currentQuestion].options.map((option, index) => (
              <OptionButton
                key={index}
                option={option}
                index={index}
                isSelected={answers[currentQuestion] === index}
                onSelect={() => handleAnswer(index)}
              />
            ))}
          </View>
        </ScrollView>
      </Animated.View>

          <View style={styles.navigationContainer}>
      <TouchableOpacity
        onPress={handlePrevious}
        disabled={currentQuestion === 0}
        style={[styles.navButton, styles.prevButton, currentQuestion === 0 && styles.disabledButton]}
      >
        <LinearGradient
          colors={currentQuestion === 0 ? ['#ccc', '#999'] : ['#2E8BC0', '#145DA0']}
          style={styles.navButtonGradient}
        >
          <AntDesign name="left" size={20} color="#fff" />
          <Text style={styles.navButtonText}>Previous</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleNext}
        style={[styles.navButton, styles.nextButton]}
      >
        <LinearGradient
          colors={['#7B42D1', '#622EAB']}
          style={styles.navButtonGradient}
        >
          <Text style={styles.navButtonText}>
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </Text>
          <AntDesign name="right" size={20} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
    </View>
  );
};

// Main Component
const ComputationalThinkingQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResult, setShowResult] = useState<boolean>(false);

  const questions: Question[] = [
    {
      id: 1,
      question: 'Which of the following best describes computational thinking?',
      options: [
        'A programming language',
        'A problem-solving approach that uses computer science principles',
        'A type of computer hardware',
        'A software development methodology'
      ],
      correct: 1
    },
    {
      id: 2,
      question: 'What is decomposition in computational thinking?',
      options: [
        'Breaking down complex problems into smaller parts',
        'Creating computer programs',
        'Testing software applications',
        'Designing user interfaces'
      ],
      correct: 0
    },
    {
      id: 3,
      question: 'Which characteristic is NOT typically associated with Hill Climbing algorithm?',
      options: [
        'It can get stuck in local optima',
        'It always finds the global optimum',
        'It is simple to implement',
        'It makes incremental improvements'
      ],
      correct: 1
    },
    {
      id: 4,
      question: 'What is Simulated Annealing?',
      options: [
        'A cooling process for computers',
        'A deterministic search algorithm',
        'A probabilistic local search algorithm inspired by metallurgy',
        'A type of neural network'
      ],
      correct: 2
    },
    {
      id: 5,
      question: 'Which local search algorithm is inspired by natural selection?',
      options: [
        'Hill Climbing',
        'Simulated Annealing',
        'Genetic Algorithm',
        'Tabu Search'
      ],
      correct: 2
    },
    {
      id: 6,
      question: 'What is a key advantage of Tabu Search over basic Hill Climbing?',
      options: [
        'It runs faster',
        'It prevents revisiting recent solutions',
        'It requires less memory',
        'It always finds the global optimum'
      ],
      correct: 1
    },
    {
      id: 7,
      question: 'Pattern recognition in computational thinking helps us to:',
      options: [
        'Write code faster',
        'Identify similarities and common differences in problems',
        'Debug programs more efficiently',
        'Create better user interfaces'
      ],
      correct: 1
    },
    {
      id: 8,
      question: 'Which statement about local search algorithms is true?',
      options: [
        'They always find the best possible solution',
        'They are guaranteed to run in polynomial time',
        'They work by making incremental improvements to a solution',
        'They require a training dataset'
      ],
      correct: 2
    },
    {
      id: 9,
      question: 'Abstraction in computational thinking involves:',
      options: [
        'Writing complex code',
        'Focusing on important details while ignoring irrelevant ones',
        'Creating detailed documentation',
        'Testing all possible scenarios'
      ],
      correct: 1
    },
    {
      id: 10,
      question: 'Algorithm design in computational thinking is important because:',
      options: [
        'It makes the code look professional',
        'It helps create step-by-step solutions to problems',
        'It makes programs run faster',
        'It reduces the need for testing'
      ],
      correct: 1
    }
  ];

  const handleAnswer = (optionIndex: number): void => {
    setAnswers({
      ...answers,
      [currentQuestion]: optionIndex
    });
  };

  const handleNext = (): void => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = (): void => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleTryAgain = (): void => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {!showResult ? (
        <QuizContent 
          currentQuestion={currentQuestion}
          questions={questions}
          answers={answers}
          handleAnswer={handleAnswer}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
        />
      ) : (
        <QuizResults 
          questions={questions}
          answers={answers}
          onTryAgain={handleTryAgain}
        />
      )}
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#161616',
  },
  mainContainer: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#622eab',
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 20,  // Reduced from 24
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10, // Reduced from 16
  },
  counterWrapper: {
    alignSelf: 'flex-start',
  },
  counter: {
    fontSize: 14,  // Reduced from 16
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,  // Reduced from 8
    paddingHorizontal: 12, // Reduced from 16
    borderRadius: 15,
  },
  progressBar: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 1,
    marginTop: 12, // Reduced from 20
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 80, // Add this to ensure content doesn't get hidden behind navigation
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 24,
  },optionsContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  option: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedOption: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  optionText: {
    fontSize: 16,
    color: '#1e293b',
  },
  selectedOptionText: {
    color: '#fff',
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  navButton: {
    width: 140,
    height: 45,
    borderRadius: 8,
    overflow: 'hidden',
  },
  prevButton: {
    backgroundColor: '#fff',
  },
  nextButton: {
    backgroundColor: '#6366f1',
  },
  prevButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6366f1',
  },
  nextButtonText: {
    marginRight: 8,
    fontSize: 16,
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: '#ccc',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  resultsList: {
    gap: 16,
  },
  resultItem: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  resultQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  resultAnswer: {
    padding: 12,
    borderRadius: 6,
  },
  correctAnswer: {
    backgroundColor: '#e6f4ea',
  },
  incorrectAnswer: {
    backgroundColor: '#fce8e6',
  },
  answerText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  correctAnswerText: {
    fontSize: 14,
    color: '#137333',
  },
  scoreContainer: {
    marginTop: 24,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  tryAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 32,
  },
  headerGradient: {
    padding: 15,  // Reduced from 20
    paddingTop: 20, // Reduced from 40
    borderBottomLeftRadius: 20, // Reduced from 30
    borderBottomRightRadius: 20, // Reduced from 30
  },
  optionGradient: {
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  navButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 8,
  },
  tryAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ComputationalThinkingQuiz;