import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Progress } from "@/Components/ui/progress";
import { CheckCircle, X, RefreshCw, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock quiz questions - in a real app these would come from the activity content
const mockQuestions = [
  {
    question: "What is 5 + 3?",
    options: ["7", "8", "9", "10"],
    correct: 1,
    explanation: "5 + 3 = 8. Great job!"
  },
  {
    question: "Which is the largest planet in our solar system?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correct: 2,
    explanation: "Jupiter is the largest planet in our solar system!"
  },
  {
    question: "What color do you get when you mix red and blue?",
    options: ["Green", "Purple", "Orange", "Yellow"],
    correct: 1,
    explanation: "Red + Blue = Purple! Colors are so fun!"
  }
];

export default function QuizComponent({ activity, onComplete, onStart }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [answers, setAnswers] = useState([]);

  const questions = mockQuestions; // In real app, this would be parsed from activity.content
  const totalQuestions = questions.length;

  const handleStart = () => {
    setIsStarted(true);
    onStart();
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    const newAnswers = [...answers, { questionIndex: currentQuestion, selected: selectedAnswer, correct: isCorrect }];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion + 1 < totalQuestions) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // Quiz completed
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    }, 2000);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setIsStarted(false);
  };

  if (!isStarted) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center">
          <CardTitle className="text-2xl">
            🧠 {activity?.title || "Quick Quiz Challenge"}
          </CardTitle>
          <p className="text-green-100 mt-2">Test your knowledge!</p>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Ready for the Challenge?</h3>
            <p className="text-gray-600 mb-4">
              Answer {totalQuestions} questions and see how well you do!
            </p>
            <div className="flex justify-center gap-4 text-sm text-gray-500">
              <span>📝 {totalQuestions} Questions</span>
              <span>⏰ No time limit</span>
              <span>🏆 Earn points for correct answers</span>
            </div>
          </div>
          
          <Button 
            onClick={handleStart}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3"
          >
            🚀 Start Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (currentQuestion >= totalQuestions) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="text-8xl mb-4">
              {score === totalQuestions ? "🏆" : score >= totalQuestions / 2 ? "🌟" : "👍"}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {score === totalQuestions ? "Perfect Score!" : score >= totalQuestions / 2 ? "Great Job!" : "Nice Try!"}
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              You got {score} out of {totalQuestions} questions correct!
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
              <Progress value={(score / totalQuestions) * 100} className="h-4 mb-3" />
              <p className="text-lg font-semibold text-purple-700">
                {Math.round((score / totalQuestions) * 100)}% Accuracy
              </p>
            </div>

            {score < totalQuestions && (
              <Button 
                onClick={resetQuiz}
                variant="outline"
                size="lg"
                className="mr-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === currentQ.correct;

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            Question {currentQuestion + 1} of {totalQuestions}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => speakText(currentQ.question)}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-2">
          <Progress 
            value={((currentQuestion + 1) / totalQuestions) * 100} 
            className="h-2 bg-white/20" 
          />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {currentQ.question}
              </h3>
              
              <div className="space-y-3 mb-6">
                {currentQ.options.map((option, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={selectedAnswer === index ? "default" : "outline"}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 h-auto text-left justify-start text-lg ${
                        selectedAnswer === index 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                          : 'hover:bg-purple-50 hover:border-purple-300'
                      }`}
                    >
                      <span className="mr-3 font-bold">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </Button>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  onClick={handleNextQuestion}
                  disabled={!isAnswered}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion + 1 === totalQuestions ? "Finish Quiz" : "Next Question"}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mb-6">
                {isCorrect ? (
                  <div className="text-green-600">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">Correct! 🎉</h3>
                  </div>
                ) : (
                  <div className="text-orange-500">
                    <X className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">Not quite right 😊</h3>
                  </div>
                )}
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
                <p className="text-lg text-gray-700">
                  {currentQ.explanation}
                </p>
              </div>

              {!isCorrect && (
                <p className="text-gray-600 mb-4">
                  The correct answer was: <strong>{currentQ.options[currentQ.correct]}</strong>
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}