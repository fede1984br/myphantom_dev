import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";
import { 
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";

// Mock Google Classroom assignments
const mockAssignments = [
  {
    id: 1,
    title: "Math Worksheet: Fractions",
    subject: "Mathematics",
    dueDate: "Today, 3:00 PM",
    status: "pending",
    points: 10,
    description: "Complete the fraction practice problems on page 42-43",
    type: "worksheet"
  },
  {
    id: 2,
    title: "Reading: Chapter 5 Questions",
    subject: "English",
    dueDate: "Tomorrow, 11:59 PM",
    status: "in_progress",
    points: 15,
    description: "Read chapter 5 and answer the comprehension questions",
    type: "reading"
  },
  {
    id: 3,
    title: "Science Lab Report",
    subject: "Science",
    dueDate: "Friday, 2:00 PM",
    status: "completed",
    points: 25,
    description: "Write up results from the plant growth experiment",
    type: "report"
  }
];

export default function TodaysAssignments({ isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'in_progress': return Clock;
      case 'pending': return AlertCircle;
      default: return FileText;
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white">
        <CardTitle className="flex items-center gap-3 text-xl">
          <Calendar className="w-6 h-6" />
          📚 Today's Assignments
        </CardTitle>
        <p className="text-white/90">From your Google Classroom</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {mockAssignments.map((assignment, index) => {
            const StatusIcon = getStatusIcon(assignment.status);
            
            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <StatusIcon className={`w-6 h-6 ${
                    assignment.status === 'completed' ? 'text-green-600' :
                    assignment.status === 'in_progress' ? 'text-blue-600' :
                    'text-orange-600'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-800 truncate">{assignment.title}</h4>
                    <Badge variant="outline" className={getStatusColor(assignment.status)}>
                      {assignment.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{assignment.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Due: {assignment.dueDate}
                    </span>
                    <span>📚 {assignment.subject}</span>
                    <span>⭐ {assignment.points} pts</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open
                  </Button>
                  {assignment.status !== 'completed' && (
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      Get Help
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}