import React, { useState, useEffect } from "react";
import { Quest, StudentProgress } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Map, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import MissionBoard from "../components/student/MissionBoard";
import QuestFilters from "../components/student/QuestFilters";

export default function QuestMap() {
  const navigate = useNavigate();
  const [quests, setQuests] = useState([]);
  const [playerProgress, setPlayerProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: 'all',
    difficulty: 'all',
    status: 'all'
  });

  const studentId = "student_001";

  useEffect(() => {
    loadQuestData();
  }, []);

  const loadQuestData = async () => {
    setIsLoading(true);
    const [questsData, progressData] = await Promise.all([
      Quest.list(),
      StudentProgress.filter({ student_id: studentId })
    ]);

    setQuests(questsData);
    setPlayerProgress(progressData);
    setIsLoading(false);
  };

  const filteredQuests = quests.filter(quest => {
    const progress = playerProgress.find(p => p.quest_id === quest.id);
    const status = progress?.status || 'locked';
    
    return (
      (filters.subject === 'all' || quest.subject === filters.subject) &&
      (filters.difficulty === 'all' || quest.difficulty === filters.difficulty) &&
      (filters.status === 'all' || status === filters.status)
    );
  });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
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
              🗺️ Quest Map
            </h1>
            <p className="text-white/80">
              Explore all available learning quests and unlock new adventures!
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/95 backdrop-blur-xl border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {quests.length}
              </div>
              <div className="text-sm text-gray-600">Total Quests</div>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur-xl border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {playerProgress.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur-xl border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {playerProgress.filter(p => p.status === 'available' || p.status === 'in_progress').length}
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur-xl border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {quests.length - playerProgress.filter(p => p.status !== 'locked').length}
              </div>
              <div className="text-sm text-gray-600">Locked</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/95 backdrop-blur-xl shadow-xl border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5" />
              🔍 Filter Quests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QuestFilters filters={filters} setFilters={setFilters} />
          </CardContent>
        </Card>

        {/* Quest Grid */}
        <MissionBoard 
          quests={filteredQuests}
          playerProgress={playerProgress}
          onQuestComplete={() => {}}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}