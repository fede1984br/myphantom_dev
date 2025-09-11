import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Switch } from "@/Components/ui/switch";
import { Slider } from "@/Components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { 
  Settings, 
  Volume2, 
  Type, 
  Eye, 
  Palette,
  Globe,
  Moon,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    textToSpeech: false,
    fontSize: [16],
    dyslexiaFriendly: false,
    highContrast: false,
    language: 'en',
    darkMode: false,
    animationsReduced: false
  });

  const languages = [
    { value: 'en', label: '🇺🇸 English' },
    { value: 'es', label: '🇪🇸 Español' },
    { value: 'pt', label: '🇧🇷 Português' },
    { value: 'fr', label: '🇫🇷 Français' }
  ];

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // In a real app, this would apply the settings immediately
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-2 border-purple-200">
      <CardHeader 
        className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white rounded-t-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            ⚙️ Accessibility
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-xl">⌄</span>
          </motion.div>
        </CardTitle>
      </CardHeader>
      
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <CardContent className="p-4 space-y-4">
          {/* Text-to-Speech */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-purple-600" />
              <label className="text-sm font-medium">Read Aloud</label>
            </div>
            <Switch
              checked={settings.textToSpeech}
              onCheckedChange={(checked) => updateSetting('textToSpeech', checked)}
            />
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-purple-600" />
              <label className="text-sm font-medium">Font Size</label>
            </div>
            <div className="px-2">
              <Slider
                value={settings.fontSize}
                onValueChange={(value) => updateSetting('fontSize', value)}
                min={12}
                max={24}
                step={2}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>
          </div>

          {/* Dyslexia-Friendly */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-600" />
              <label className="text-sm font-medium">Dyslexia Support</label>
            </div>
            <Switch
              checked={settings.dyslexiaFriendly}
              onCheckedChange={(checked) => updateSetting('dyslexiaFriendly', checked)}
            />
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-600" />
              <label className="text-sm font-medium">High Contrast</label>
            </div>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(checked) => updateSetting('highContrast', checked)}
            />
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-600" />
              <label className="text-sm font-medium">Language</label>
            </div>
            <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reduce Animations */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <label className="text-sm font-medium">Reduce Motion</label>
            </div>
            <Switch
              checked={settings.animationsReduced}
              onCheckedChange={(checked) => updateSetting('animationsReduced', checked)}
            />
          </div>

          <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white">
            Save Settings
          </Button>
        </CardContent>
      </motion.div>
    </Card>
  );
}