import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useQuiz } from "../utils/QuizContext";
import Timer from "../components/Timer";

export default function QuizScreen() {
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
  
  useEffect(() => {
    // Reset local selected state when current question changes
    setSelected(null);
  }, [currentQuestion]);
  
  // Reset quiz started state when quiz is finished
  useEffect(() => {
    if (quizFinished) {
      // Don't reset immediately to allow results to show
      // setQuizStarted(false);
    }
  }, [quizFinished]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      setQuizStarted(false);
    };
  }, []);
  
  // Reset local state when currentQuiz changes (new quiz loaded)
  useEffect(() => {
    // Only reset if we have a quiz and it has changed
    setSelected(null);
    setShowResults(false);
    if (currentQuiz) {
      console.log("New quiz loaded, resetting local state");
    }
  }, [currentQuiz]);
  
  // If we don't have a quiz, fetch one
  useEffect(() => {
    if (!currentQuiz && !isLoading) {
      fetchQuiz();
    }
  }, []);
  
  // Debug function to generate a test quiz
  const generateTestQuiz = () => {
    console.log("Generating test quiz");
    const testQuiz = {
      subject: "Test Quiz",
      questions: [
        {
          question: "What is React?",
          options: ["A JavaScript library", "A database", "An operating system", "A programming language"],
          correctOptionIndex: 0
        },
        {
          question: "What hook is used for side effects in React?",
          options: ["useState", "useEffect", "useContext", "useReducer"],
          correctOptionIndex: 1
        },
        {
          question: "Which is NOT a React Navigation type?",
          options: ["Stack", "Bottom Tabs", "Side Menu", "Linear"],
          correctOptionIndex: 3
        },
        {
          question: "What is JSX?",
          options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"],
          correctOptionIndex: 0
        },
        {
          question: "What method is used to update state in class components?",
          options: ["this.updateState()", "this.setState()", "this.changeState()", "this.modifyState()"],
          correctOptionIndex: 1
        }
      ]
    };
    return testQuiz;
  };
  
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
    console.log("Starting quiz with data:", currentQuiz);
    startQuiz();
    setQuizStarted(true); // Set quiz as started locally
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
  
  // Render loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-[#111618] justify-center items-center">
        <ActivityIndicator size="large" color="#0cb9f2" />
        <Text className="text-white mt-4 text-lg">Loading quiz...</Text>
      </View>
    );
  }
  
  // Render start screen if no quiz in progress
  if (!quizStarted && (!currentQuiz || (!quizFinished && currentQuestion === 0 && selectedAnswers.length === 0))) {
    return (
      <View className="flex-1 bg-[#111618] justify-center items-center px-6">
        <Text className="text-white text-3xl font-bold mb-4 text-center">
          {currentQuiz ? `${currentQuiz.subject} Quiz` : 'Daily Challenge'}
        </Text>
        <Text className="text-[#a2afb3] text-lg mb-8 text-center">
          {currentQuiz 
            ? `5 questions • ${Math.round(timerDuration / 60)} minutes` 
            : 'Fetching today\'s quiz...'}
        </Text>
        
        {currentQuiz ? (
          <TouchableOpacity
            className="w-full rounded-xl py-4 bg-[#0cb9f2]"
            onPress={handleStartQuiz}
          >
            <Text className="text-[#111618] text-lg font-bold text-center">Start Quiz</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <ActivityIndicator size="large" color="#0cb9f2" />
            <TouchableOpacity
              className="w-full rounded-xl py-4 bg-[#283539] mt-6"
              onPress={() => {
                const testQuiz = generateTestQuiz();
                fetchQuiz("Test Subject"); // This will trigger our fallback quiz
              }}
            >
              <Text className="text-white text-lg font-bold text-center">Try Test Quiz</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
  
  // Render results screen
  if (showResults) {
    return (
      <View className="flex-1 bg-[#111618] px-4 py-6">
        <Text className="text-white text-3xl font-bold mb-2 text-center">Quiz Results</Text>
        <Text className="text-[#0cb9f2] text-2xl font-bold mb-8 text-center">
          {score}/{currentQuiz.questions.length} Correct
        </Text>
        
        <ScrollView className="flex-1">
          {currentQuiz.questions.map((q, idx) => {
            const userAnswer = selectedAnswers[idx];
            const correctAnswer = q.correctOptionIndex;
            const isCorrect = userAnswer === correctAnswer;
            
            return (
              <View key={idx} className="mb-8 bg-[#181F2A] rounded-xl p-4">
                <Text className="text-white text-lg font-medium mb-3">
                  {idx + 1}. {q.question}
                </Text>
                
                {q.options.map((option, optIdx) => (
                  <View 
                    key={optIdx}
                    className={`flex-row items-center p-3 mb-2 rounded-lg ${
                      optIdx === correctAnswer 
                        ? 'bg-[#1e493e]' // Correct answer background
                        : optIdx === userAnswer && optIdx !== correctAnswer
                          ? 'bg-[#4e2c35]' // Wrong answer background
                          : 'bg-[#232D3F]' // Normal background
                    }`}
                  >
                    <Text 
                      className={`text-base ${
                        optIdx === correctAnswer 
                          ? 'text-[#34c759] font-medium' 
                          : optIdx === userAnswer && optIdx !== correctAnswer
                            ? 'text-[#ff3b30] font-medium'
                            : 'text-white'
                      }`}
                    >
                      {option}
                    </Text>
                    
                    {optIdx === correctAnswer && (
                      <Text className="text-[#34c759] ml-2">✓</Text>
                    )}
                    {optIdx === userAnswer && optIdx !== correctAnswer && (
                      <Text className="text-[#ff3b30] ml-2">✗</Text>
                    )}
                  </View>
                ))}
              </View>
            );
          })}
        </ScrollView>
        
        <TouchableOpacity
          className="rounded-xl py-4 bg-[#0cb9f2] mt-4"
          onPress={() => {
            // Reset all relevant state
            setQuizStarted(false);
            setShowResults(false);
            setScore(0);
            setSelected(null);
            finishQuiz(true); // Use a reset flag
            fetchQuiz();
          }}
        >
          <Text className="text-[#111618] text-lg font-bold text-center">New Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Validate current quiz state before rendering the quiz questions
  if (!currentQuiz || !currentQuiz.questions || currentQuiz.questions.length === 0) {
    return (
      <View className="flex-1 bg-[#111618] justify-center items-center px-6">
        <Text className="text-white text-2xl font-bold mb-4 text-center">
          Quiz Error
        </Text>
        <Text className="text-[#a2afb3] text-lg mb-8 text-center">
          Could not load quiz questions. Please try again.
        </Text>
        <TouchableOpacity
          className="w-full rounded-xl py-4 bg-[#0cb9f2]"
          onPress={() => fetchQuiz()}
        >
          <Text className="text-[#111618] text-lg font-bold text-center">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Make sure currentQuestion is valid
  if (!currentQuiz.questions[currentQuestion]) {
    console.error("Invalid current question index:", currentQuestion);
    return (
      <View className="flex-1 bg-[#111618] justify-center items-center">
        <Text className="text-white text-lg">Question data error. Restarting quiz...</Text>
        <TouchableOpacity
          className="rounded-xl py-4 bg-[#0cb9f2] mt-6 px-8"
          onPress={() => {
            setCurrentQuestion(0);  // Reset to first question
            startQuiz();
          }}
        >
          <Text className="text-[#111618] text-lg font-bold text-center">Restart</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  console.log("Rendering quiz question screen with state:", {
    quizStarted,
    currentQuestion,
    quizFinished,
    showResults
  });
  
  // Render quiz questions
  const question = currentQuiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / currentQuiz.questions.length) * 100;
  
  return (
    <View className="flex-1 bg-[#111618] justify-between">
      {/* Progress */}
      <View className="flex flex-col gap-3 p-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-base font-medium">
            Question {currentQuestion + 1}/{currentQuiz.questions.length}
          </Text>
          <Timer seconds={timerDuration} onFinish={handleQuizTimeout} />
        </View>
        <View className="rounded bg-[#3b4e54] h-2 w-full overflow-hidden">
          <View className="h-2 rounded bg-white" style={{ width: `${progress}%` }} />
        </View>
      </View>

      {/* Question */}
      <Text className="text-white text-[22px] font-bold px-4 pb-3 pt-5">
        {question.question}
      </Text>

      {/* Options */}
      <View className="flex flex-col gap-3 p-4">
        {question.options.map((opt, idx) => (
          <TouchableOpacity
            key={idx}
            className={`flex-row items-center gap-4 rounded-xl border border-solid ${
              selected === idx ? "border-white" : "border-[#3b4e54]"
            } p-[15px]`}
            onPress={() => handleSelectAnswer(idx)}
            activeOpacity={0.8}
          >
            <View
              className={`h-5 w-5 rounded-full border-2 ${
                selected === idx ? "border-white" : "border-[#3b4e54]"
              } items-center justify-center`}
              style={{
                backgroundColor: selected === idx ? "#fff" : "transparent",
              }}
            >
              {selected === idx && (
                <View className="h-3 w-3 rounded-full bg-[#111618]" />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm font-medium">{opt}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between px-4 py-3">
        <TouchableOpacity 
          className="min-w-[84px] rounded-xl h-10 px-4 bg-[#283539] items-center justify-center"
          onPress={handleSkipQuestion}
        >
          <Text className="text-white text-sm font-bold">Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="min-w-[84px] rounded-xl h-10 px-4 bg-[#0cb9f2] items-center justify-center"
          onPress={handleNextQuestion}
        >
          <Text className="text-[#111618] text-sm font-bold">
            {currentQuestion === currentQuiz.questions.length - 1 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
