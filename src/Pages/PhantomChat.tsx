import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import PhantomChatComponent from "../Components/student/PhantomChat";
import AccessibilityPanel from "../Components/student/AccessibilityPanel";

export default function PhantomChat() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate(createPageUrl("StudentDashboard"))}
            className="bg-white/90 backdrop-blur-sm border-white/30 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              Chat with Phantom 💬
            </h1>
            <p className="text-white/80">
              Your AI learning companion is here to help with homework, explain concepts, and support your learning journey!
            </p>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-white">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="relative">
                    <Bot className="w-8 h-8" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  MyPhantom.AI Assistant
                </CardTitle>
                <p className="text-white/90">
                  🤖 Powered by advanced AI • Available 24/7 • Supports all subjects
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <PhantomChatComponent compact={false} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AccessibilityPanel />
            
            {/* Chat Features */}
            <Card className="bg-white/95 backdrop-blur-xl shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-600" />
                  🌟 Phantom Can Help With
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>🧮</span>
                    <span>Math problems & explanations</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>📚</span>
                    <span>Reading comprehension</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>🔬</span>
                    <span>Science concepts</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>🌍</span>
                    <span>History & geography</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>✏️</span>
                    <span>Writing & grammar</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>🎨</span>
                    <span>Creative projects</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>💪</span>
                    <span>Study motivation</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>🧘</span>
                    <span>Learning anxiety support</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">🛡️</div>
                  <h4 className="font-semibold text-green-800 mb-2">Safe & Secure</h4>
                  <p className="text-xs text-green-700 leading-relaxed">
                    Phantom is designed to be helpful, harmless, and honest. All conversations are monitored for safety.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}