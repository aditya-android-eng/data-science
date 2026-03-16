import { useState, useEffect } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, BookOpen, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogEntry {
  id: string;
  date: string;
  topic: string;
  category: string;
  notes: string;
}

export default function Timeline() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error('Failed to fetch logs:', err));
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const getLogsForDay = (day: Date) => {
    return logs.filter(log => isSameDay(parseISO(log.date), day));
  };

  const selectedLogs = selectedDate ? getLogsForDay(selectedDate) : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Learning Timeline
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className="flex space-x-2">
              <button onClick={prevMonth} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={nextMonth} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Empty slots for padding */}
            {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 rounded-md border border-transparent bg-slate-50 dark:bg-slate-800/50" />
            ))}

            {/* Days */}
            {daysInMonth.map((day, i) => {
              const dayLogs = getLogsForDay(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);

              return (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.01 }}
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={`h-24 rounded-md border p-1 flex flex-col items-start justify-start transition-all ${
                    !isCurrentMonth ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 opacity-50' :
                    isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500' :
                    'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-800 hover:shadow-sm'
                  }`}
                >
                  <span className={`text-xs font-medium p-1 rounded-full w-6 h-6 flex items-center justify-center ${
                    isSelected ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  <div className="mt-1 w-full space-y-1 overflow-hidden">
                    {dayLogs.slice(0, 2).map((log, i) => (
                      <div key={i} className="text-[10px] truncate px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 w-full text-left font-medium">
                        {log.topic}
                      </div>
                    ))}
                    {dayLogs.length > 2 && (
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 text-left px-1 font-medium">
                        +{dayLogs.length - 2} more
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Details Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col h-[600px]"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a day'}
          </h2>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            <AnimatePresence mode="wait">
              {!selectedDate ? (
                <motion.div 
                  key="empty-state"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400"
                >
                  <Calendar className="h-12 w-12 mb-3 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-medium">Click on a date to view logs</p>
                </motion.div>
              ) : selectedLogs.length === 0 ? (
                <motion.div 
                  key="no-logs"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400"
                >
                  <BookOpen className="h-12 w-12 mb-3 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-medium">No logs for this day</p>
                </motion.div>
              ) : (
                <motion.div key="logs-list" className="space-y-3">
                  {selectedLogs.map((log, index) => (
                    <motion.div 
                      key={log.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700/50"
                    >
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">{log.topic}</h3>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 whitespace-nowrap font-medium">
                          {log.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{log.notes}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
