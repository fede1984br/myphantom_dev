import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function QuestFilters({ filters, setFilters }) {
  const subjects = [
    { value: 'all', label: 'All Subjects', emoji: '📚' },
    { value: 'mathematics', label: 'Mathematics', emoji: '🧮' },
    { value: 'english', label: 'English', emoji: '📖' },
    { value: 'science', label: 'Science', emoji: '🔬' },
    { value: 'history', label: 'History', emoji: '🌍' },
    { value: 'art', label: 'Art', emoji: '🎨' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'boss', label: 'Boss Quest' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'locked', label: 'Locked' }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Subject</label>
        <Select value={filters.subject} onValueChange={(value) => setFilters({...filters, subject: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.value} value={subject.value}>
                <span className="flex items-center gap-2">
                  <span>{subject.emoji}</span>
                  {subject.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Difficulty</label>
        <Select value={filters.difficulty} onValueChange={(value) => setFilters({...filters, difficulty: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map((difficulty) => (
              <SelectItem key={difficulty.value} value={difficulty.value}>
                {difficulty.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
        <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}