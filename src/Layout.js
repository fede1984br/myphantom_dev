
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Bot, Home, Map, MessageSquare, Trophy, Settings, Zap } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/Components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("StudentDashboard"),
    icon: Home,
  },
  {
    title: "Quest Map",
    url: createPageUrl("QuestMap"),
    icon: Map,
  },
  {
    title: "Phantom Chat",
    url: createPageUrl("PhantomChat"),
    icon: MessageSquare,
  },
  {
    title: "Achievements",
    url: createPageUrl("Achievements"),
    icon: Trophy,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --phantom-purple: #8B5FBF;
            --phantom-blue: #4A90E2;
            --phantom-pink: #FF6B9D;
            --phantom-green: #50E3C2;
            --phantom-orange: #F5A623;
            --phantom-dark: #2C1810;
            --phantom-light: #F8F6FF;
          }
          
          body {
            background: linear-gradient(135deg, var(--phantom-purple) 0%, var(--phantom-blue) 25%, var(--phantom-pink) 75%, var(--phantom-orange) 100%);
            min-height: 100vh;
          }
        `}
      </style>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r-0 bg-white/10 backdrop-blur-xl">
          <SidebarHeader className="border-b border-white/20 p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h2 className="font-bold text-xl text-black">MyPhantom.AI</h2>
                <p className="text-sm text-black/70">Your AI Learning Companion</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-black/60 font-semibold uppercase tracking-wider px-3 py-3">
                🎮 Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-white/20 transition-all duration-300 rounded-2xl ${
                          location.pathname === item.url 
                            ? 'bg-white/30 text-black shadow-lg backdrop-blur-sm' 
                            : 'text-black/80 hover:text-black'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-black/60 font-semibold uppercase tracking-wider px-3 py-3">
                ⚡ Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black/70 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Level
                    </span>
                    <span className="font-bold text-yellow-600">Level 4</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black/70">Streak</span>
                    <span className="font-bold text-orange-600">5 days 🔥</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black/70">XP Points</span>
                    <span className="font-bold text-purple-600">347 XP</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-white/20 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-black text-sm truncate">Emma Johnson</p>
                <p className="text-xs text-black/60 truncate">Grade 5 • Ready to Learn! 🚀</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-white/20 p-2 rounded-xl transition-colors duration-200 text-black" />
              <h1 className="text-xl font-bold text-white">MyPhantom.AI</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
