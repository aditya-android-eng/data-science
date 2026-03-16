import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';

// Types for our in-memory "MongoDB"
interface LearningLog {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  notes: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

// In-memory database
let learningLogs: LearningLog[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '11:00',
    topic: 'Python Basics',
    notes: 'Learned about variables, lists, and dictionaries.',
    difficulty: 'Easy',
    category: 'Python',
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---
  
  // Get all logs
  app.get('/api/logs', (req, res) => {
    res.json(learningLogs);
  });

  // Add a new log
  app.post('/api/logs', (req, res) => {
    const newLog: LearningLog = {
      id: Date.now().toString(),
      ...req.body
    };
    learningLogs.push(newLog);
    res.status(201).json(newLog);
  });

  // Get analytics data
  app.get('/api/analytics', (req, res) => {
    // Calculate total hours
    let totalMinutes = 0;
    learningLogs.forEach(log => {
      const start = new Date(`1970-01-01T${log.startTime}:00`);
      const end = new Date(`1970-01-01T${log.endTime}:00`);
      let diff = (end.getTime() - start.getTime()) / 1000 / 60;
      if (diff < 0) diff += 24 * 60; // Handle overnight
      totalMinutes += diff;
    });
    const totalHours = (totalMinutes / 60).toFixed(1);

    // Calculate streak
    const dates = [...new Set(learningLogs.map(l => l.date))].sort();
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = dates.length - 1; i >= 0; i--) {
      const logDate = new Date(dates[i]);
      logDate.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(currentDate.getTime() - logDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak || diffDays === streak + 1) {
        streak = diffDays === streak ? streak : streak + 1;
      } else {
        break;
      }
    }

    // Calculate category distribution
    const categories: Record<string, number> = {};
    learningLogs.forEach(log => {
      categories[log.category] = (categories[log.category] || 0) + 1;
    });

    res.json({
      totalDays: dates.length,
      totalHours,
      streak,
      categories
    });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
