import { useState, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import { Alert } from 'react-native';

/**
 * Custom hook to handle quiz state and actions
 */
export function useQuizState(initialTimerDuration = 300) {
  const {
    currentQuiz,
    isLoading,
    currentQuestion,
    selectedAnswers,
    timerDuration,
    quizFinished,
    fetchQuiz,
    startQuiz,
    submitAnswer,
    finishQuiz
  } = useQuiz();

  const [selected, setSelected] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  
  // Reset local selected state when current question changes
  useEffect(() => {
    setSelected(null);
  }, [currentQuestion]);
  
  // Reset local state when currentQuiz changes (new quiz loaded)
  useEffect(() => {
    // Only reset if we have a quiz and it has changed
    setSelected(null);
    setShowResults(false);
  }, [currentQuiz]);
  
  // If we don't have a quiz, fetch one
  useEffect(() => {
    if (!currentQuiz && !isLoading) {
      fetchQuiz();
    }
  }, []);
  
  // Calculate score when quiz is finished
  useEffect(() => {
    if (quizFinished && currentQuiz) {
      let correctCount = 0;
      selectedAnswers.forEach((answer, index) => {
        if (answer === currentQuiz.questions[index].correctOptionIndex) {
          correctCount++;
        }
      });
      setScore(correctCount);
      setShowResults(true);
    }
  }, [quizFinished, currentQuiz, selectedAnswers]);
  
  // Handle quiz start
  const handleStartQuiz = () => {
    startQuiz();
    setQuizStarted(true);
    setShowResults(false);
  };
  
  // Handle answer selection
  const handleSelectAnswer = (index) => {
    setSelected(index);
  };
  
  // Handle next question
  const handleNextQuestion = () => {
    if (selected === null) {
      Alert.alert("Select an answer", "Please select an answer before continuing.");
      return;
    }
    
    submitAnswer(selected);
    
    // If this is the last question, finish the quiz
    if (currentQuiz && currentQuestion === currentQuiz.questions.length - 1) {
      finishQuiz();
    }
  };
  
  // Handle skip question
  const handleSkipQuestion = () => {
    if (currentQuiz && currentQuestion < currentQuiz.questions.length - 1) {
      submitAnswer(null); // Submit null for skipped
    } else {
      finishQuiz();
    }
  };
  
  // Handle quiz timeout
  const handleQuizTimeout = () => {
    Alert.alert("Time's up!", "Your quiz time has ended.", [
      { text: "See Results", onPress: () => finishQuiz() }
    ]);
  };
  
  // Reset quiz state
  const resetQuiz = () => {
    setQuizStarted(false);
    setShowResults(false);
    setScore(0);
    setSelected(null);
    finishQuiz(true); // Use a reset flag
    fetchQuiz();
  };

  return {
    // Context values
    currentQuiz,
    isLoading,
    currentQuestion,
    selectedAnswers,
    timerDuration,
    quizFinished,
    
    // Local state
    selected,
    showResults,
    score,
    quizStarted,
    
    // Methods
    handleStartQuiz,
    handleSelectAnswer,
    handleNextQuestion,
    handleSkipQuestion,
    handleQuizTimeout,
    resetQuiz,
    fetchQuiz
  };
}
