import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  Target, 
  Clock, 
  Activity, 
  BarChart3,
  Plus,
  User,
  Settings,
  AlertCircle
} from 'lucide-react';
import { getWorkoutHistory, getExerciseTrends, getTrainingFrequency, getWeeklyVolumeSummary, getUserProfile } from '../utils/progressTracker';

const ProgressDashboard = ({ onBackToWorkout }) => {
  const [selectedExercise, setSelectedExercise] = useState('');
  const [timeRange, setTimeRange] = useState('30'); // days
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const userProfile = getUserProfile();
    setProfile(userProfile);
  }, []);

  const history = getWorkoutHistory();
  const frequency = getTrainingFrequency();
  const volumeData = getWeeklyVolumeSummary('chest', 4);

  // Get unique exercises from history
  const allExercises = Array.from(new Set(
    history.flatMap(workout => 
      workout.exercises ? workout.exercises.map(ex => ex.name) : []
    )
  ));

  // Calculate basic stats
  const totalWorkouts = history.length;
  const totalVolume = history.reduce((acc, workout) => {
    if (!workout.exercises) return acc;
    return acc + workout.exercises.reduce((sum, ex) => {
      const sets = ex.sets || 0;
      // Parse rep range (e.g., "6-8" -> 8, "10-12" -> 12)
      let reps = 0;
      if (typeof ex.reps === 'string') {
        const repMatch = ex.reps.match(/(\d+)-(\d+)/);
        if (repMatch) {
          reps = parseInt(repMatch[2]); // Use the higher end of the range
        } else {
          reps = parseInt(ex.reps) || 0;
        }
      } else {
        reps = ex.reps || 0;
      }
      return sum + (sets * reps);
    }, 0);
  }, 0);
  const avgWorkoutLength = totalWorkouts > 0 ? Math.round(totalVolume / totalWorkouts) : 0;

  // Prepare volume chart data
  const volumeChartData = volumeData.map(week => ({
    name: `Week ${week.week}`,
    volume: week.volume,
    workouts: week.workouts
  }));

  // Prepare frequency chart data
  const frequencyChartData = Object.entries(frequency.workoutsByType).map(([type, count]) => ({
    name: type,
    value: count
  }));

  // Get exercise trends if selected
  const exerciseTrendData = selectedExercise 
    ? getExerciseTrends(selectedExercise, parseInt(timeRange))
    : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToWorkout}
              className="text-sm px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              ← Back to Workouts
            </button>
            <div>
              <h1 className="text-3xl font-bold">Progress Dashboard</h1>
              <p className="text-gray-400">Track your fitness journey and performance</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <User size={20} />
              Profile
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              <Settings size={20} />
              Settings
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Workouts</p>
                <p className="text-2xl font-bold">{totalWorkouts}</p>
              </div>
              <Calendar size={32} className="text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Weekly Average</p>
                <p className="text-2xl font-bold">{frequency.averagePerWeek.toFixed(1)}</p>
              </div>
              <Clock size={32} className="text-green-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Volume</p>
                <p className="text-2xl font-bold">{totalVolume}</p>
              </div>
              <BarChart3 size={32} className="text-purple-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Consistency</p>
                <p className="text-2xl font-bold">{Math.round(frequency.consistency * 100)}%</p>
              </div>
              <Activity size={32} className="text-orange-400" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Volume Chart */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-400" />
              Weekly Volume
            </h3>
            {volumeChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={volumeChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  <Bar dataKey="volume" fill="#3b82f6" name="Volume" />
                  <Bar dataKey="workouts" fill="#10b981" name="Workouts" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <AlertCircle size={32} className="mx-auto mb-2 text-gray-500" />
                No volume data available yet. Complete some workouts to see progress.
              </div>
            )}
          </div>

          {/* Workout Frequency Pie Chart */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieChart size={20} className="text-green-400" />
              Workout Distribution
            </h3>
            {frequencyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={frequencyChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {frequencyChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <AlertCircle size={32} className="mx-auto mb-2 text-gray-500" />
                No workout data available yet. Complete some workouts to see distribution.
              </div>
            )}
          </div>
        </div>

        {/* Exercise Performance */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target size={20} className="text-purple-400" />
              Exercise Performance
            </h3>
            <div className="flex gap-4 items-center">
              <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600"
              >
                <option value="">Select an exercise</option>
                {allExercises.map(exercise => (
                  <option key={exercise} value={exercise}>{exercise}</option>
                ))}
              </select>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600"
              >
                <option value="7">Last 7 days</option>
                <option value="14">Last 14 days</option>
                <option value="30">Last 30 days</option>
                <option value="60">Last 60 days</option>
              </select>
            </div>
          </div>
          
          {selectedExercise && exerciseTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={exerciseTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Line type="monotone" dataKey="reps" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                <Line type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-400">
              {selectedExercise ? 'No data available for this exercise' : 'Select an exercise to view performance trends'}
            </div>
          )}
        </div>

        {/* Recent Workouts */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-blue-400" />
              Recent Workouts
            </h3>
          <div className="space-y-3">
            {history.slice(0, 10).map((workout, index) => (
              <div key={workout.id || index} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{workout.name}</h4>
                    <p className="text-sm text-gray-400">{workout.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Exercises: {workout.exercises?.length || 0}</p>
                    <p className="text-sm text-gray-400">Volume: {workout.exercises ? workout.exercises.reduce((sum, ex) => {
                      const sets = ex.sets || 0;
                      let reps = 0;
                      if (typeof ex.reps === 'string') {
                        const repMatch = ex.reps.match(/(\d+)-(\d+)/);
                        if (repMatch) {
                          reps = parseInt(repMatch[2]);
                        } else {
                          reps = parseInt(ex.reps) || 0;
                        }
                      } else {
                        reps = ex.reps || 0;
                      }
                      return sum + (sets * reps);
                    }, 0) : 0}</p>
                  </div>
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No workouts completed yet. Start your first workout to see progress here!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;