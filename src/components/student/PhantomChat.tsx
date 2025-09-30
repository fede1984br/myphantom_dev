import { Message } from '@/lib/types';
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Lightbulb,
  HelpCircle,
  Calculator,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { invokeLLM } from "@/integrations/Core";

interface MessageBubbleProps {
  message: Message;
}

interface Window {
  webkitSpeechRecognition: any;
}

const quickPrompts = [
  { text: "Help with math homework", icon: Calculator, color: "bg-blue-100 text-blue-800" },
  { text: "Explain this concept", icon: Lightbulb, color: "bg-yellow-100 text-yellow-800" },
  { text: "Quiz me on this topic", icon: HelpCircle, color: "bg-purple-100 text-purple-800" },
  { text: "Reading comprehension help", icon: BookOpen, color: "bg-green-100 text-green-800" },
];

export default function PhantomChat({ compact = false }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-message',
      type: 'phantom',
      content: "Hi Emma! I'm your AI learning companion. I'm here to help you with homework, explain concepts, create practice quizzes, and support you through your learning journey. What would you like to explore today? 🚀",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const fullPrompt = `You are Phantom, a friendly AI tutor for K-12 students. You help with homework, explain concepts in simple terms, create practice problems, and provide emotional support. The student just said: "${inputMessage}". Respond in a helpful, encouraging, and age-appropriate way. Keep responses concise for the chat interface. Use emojis to make it engaging.`;

      const response = await invokeLLM(fullPrompt);

      const phantomMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'phantom',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, phantomMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'phantom',
        content: "I'm having trouble connecting right now. Can you try asking me again? 😊",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleQuickPrompt = (promptText: string) => {
    setInputMessage(promptText);
  };

  const handleVoiceToggle = () => {
    if (!isListening && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      setIsListening(false);
    }
  };

  const MessageBubble = ({ message }: MessageBubbleProps) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
        <div className={`flex items-end gap-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            message.type === 'user' 
              ? 'bg-gradient-to-r from-blue-400 to-purple-400' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`}>
            {message.type === 'user' ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>
          
          {/* Message Bubble */}
          <div className={`rounded-2xl px-4 py-3 max-w-sm ${
            message.type === 'user'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
              : 'bg-white shadow-md border border-gray-100 text-gray-800'
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`flex flex-col ${compact ? 'h-64' : 'h-96'}`}>
      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-2 ${compact ? 'max-h-48' : ''}`}>
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mb-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white shadow-md border border-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {!compact && (
        <div className="px-4 py-2">
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => handleQuickPrompt(prompt.text)}
                className={`${prompt.color} hover:opacity-80 transition-all`}
              >
                <prompt.icon className="w-3 h-3 mr-1" />
                {prompt.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Phantom anything..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleVoiceToggle}
            className={isListening ? "bg-red-100 border-red-300" : ""}
          >
            {isListening ? (
              <MicOff className="w-4 h-4 text-red-600" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}