import { useState, useEffect } from 'react';
import { Clock, Trophy, Target, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalDays: 0,
    totalHours: '0.0',
    streak: 0,
    progress: 0, 
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch mock analytics
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => setStats(prev => ({ ...prev, ...data })))
      .catch(err => console.error('Failed to fetch stats:', err));

    // Calculate real progress from roadmap
    const savedRoadmap = localStorage.getItem('ds-roadmap-progress');
    if (savedRoadmap) {
      try {
        const roadmap = JSON.parse(savedRoadmap);
        let total = 0;
        let completed = 0;
        roadmap.forEach((section: any) => {
          total += section.items.length;
          completed += section.items.filter((i: any) => i.completed).length;
        });
        const progress = Math.round((completed / total) * 100) || 0;
        setStats(prev => ({ ...prev, progress }));
      } catch (e) {
        console.error("Failed to parse roadmap data");
      }
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-6xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, Data Scientist
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Here's what's happening with your learning journey today.
          </p>
        </motion.div>
        <motion.div variants={itemVariants} className="text-left md:text-right bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 font-mono tracking-tight">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Learning Days', value: stats.totalDays, icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
          { label: 'Total Hours Studied', value: `${stats.totalHours}h`, icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'Current Streak', value: `${stats.streak} days`, icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
          { label: 'Overall Progress', value: `${stats.progress}%`, icon: Target, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants} className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{stat.label}</dt>
                    <dd>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 relative z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Journey to Job Ready</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your master roadmap completion</p>
          </div>
          <Link to="/roadmap" className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-lg">
            View Roadmap <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mastery Level</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{stats.progress}%</span>
          </div>
          <div className="overflow-hidden h-3 mb-6 text-xs flex rounded-full bg-slate-100 dark:bg-slate-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-purple-500"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex flex-col gap-1">
              <div className={`h-1 rounded-full ${stats.progress >= 0 ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
              <span>Beginner</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className={`h-1 rounded-full ${stats.progress >= 25 ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
              <span>Intermediate</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className={`h-1 rounded-full ${stats.progress >= 60 ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
              <span>Advanced</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className={`h-1 rounded-full ${stats.progress >= 90 ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
              <span>Job Ready</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Motivational Message */}
      <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 md:p-8 border border-indigo-100 dark:border-indigo-800/30 relative overflow-hidden">
        <div className="absolute -left-4 -top-4 text-indigo-200 dark:text-indigo-800/40 opacity-50">
          <BookOpen className="w-24 h-24" />
        </div>
        <p className="text-indigo-900 dark:text-indigo-200 italic text-center font-serif text-lg md:text-xl relative z-10 max-w-3xl mx-auto leading-relaxed">
          "Every expert was once a beginner. Keep pushing forward, your future self will thank you."
        </p>
      </motion.div>
    </motion.div>
  );
}
