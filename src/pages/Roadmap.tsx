import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, BookOpen, Code, Database, LineChart, BrainCircuit, Cpu, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialRoadmapData = [
  {
    id: 'python',
    stage: 'Python Programming',
    description: 'The foundation of data science',
    icon: Code,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    items: [
      { id: 'py1', title: 'Variables, Data Types, & Operators', completed: false },
      { id: 'py2', title: 'Control Flow (If/Else, Loops)', completed: false },
      { id: 'py3', title: 'Functions & Modules', completed: false },
      { id: 'py4', title: 'Data Structures (Lists, Dicts, Sets, Tuples)', completed: false },
      { id: 'py5', title: 'Object-Oriented Programming (OOP)', completed: false },
      { id: 'py6', title: 'Error Handling & Exceptions', completed: false },
    ],
  },
  {
    id: 'data-manipulation',
    stage: 'Data Manipulation & Analysis',
    description: 'Working with tabular data',
    icon: Database,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500',
    items: [
      { id: 'dm1', title: 'NumPy Arrays & Vectorization', completed: false },
      { id: 'dm2', title: 'Pandas Series & DataFrames', completed: false },
      { id: 'dm3', title: 'Data Cleaning & Handling Missing Values', completed: false },
      { id: 'dm4', title: 'Data Filtering, Sorting, & Grouping', completed: false },
      { id: 'dm5', title: 'Merging & Joining Datasets', completed: false },
    ],
  },
  {
    id: 'math-stats',
    stage: 'Math & Statistics',
    description: 'The theory behind the models',
    icon: BookOpen,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500',
    items: [
      { id: 'ms1', title: 'Descriptive Statistics (Mean, Median, Variance)', completed: false },
      { id: 'ms2', title: 'Probability Distributions (Normal, Binomial, Poisson)', completed: false },
      { id: 'ms3', title: 'Hypothesis Testing (T-tests, ANOVA, P-values)', completed: false },
      { id: 'ms4', title: 'Linear Algebra Basics (Vectors, Matrices)', completed: false },
      { id: 'ms5', title: 'Calculus Basics (Derivatives, Gradients)', completed: false },
    ],
  },
  {
    id: 'data-viz',
    stage: 'Data Visualization',
    description: 'Communicating insights visually',
    icon: LineChart,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500',
    items: [
      { id: 'dv1', title: 'Matplotlib Basics (Plots, Subplots, Formatting)', completed: false },
      { id: 'dv2', title: 'Seaborn (Statistical Plots, Heatmaps)', completed: false },
      { id: 'dv3', title: 'Interactive Viz with Plotly / Bokeh', completed: false },
      { id: 'dv4', title: 'Dashboarding (Streamlit or Dash)', completed: false },
      { id: 'dv5', title: 'Storytelling with Data', completed: false },
    ],
  },
  {
    id: 'machine-learning',
    stage: 'Machine Learning',
    description: 'Predictive modeling algorithms',
    icon: BrainCircuit,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500',
    items: [
      { id: 'ml1', title: 'Scikit-Learn Basics & Pipeline', completed: false },
      { id: 'ml2', title: 'Supervised: Linear & Logistic Regression', completed: false },
      { id: 'ml3', title: 'Supervised: Decision Trees & Random Forests', completed: false },
      { id: 'ml4', title: 'Supervised: SVM & KNN', completed: false },
      { id: 'ml5', title: 'Unsupervised: K-Means & Hierarchical Clustering', completed: false },
      { id: 'ml6', title: 'Unsupervised: PCA & Dimensionality Reduction', completed: false },
      { id: 'ml7', title: 'Model Evaluation (Cross-validation, ROC-AUC, F1)', completed: false },
      { id: 'ml8', title: 'Hyperparameter Tuning (GridSearch, RandomSearch)', completed: false },
    ],
  },
  {
    id: 'deep-learning',
    stage: 'Deep Learning & AI',
    description: 'Neural networks and advanced AI',
    icon: Cpu,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
    items: [
      { id: 'dl1', title: 'Neural Network Fundamentals (Perceptrons, Backprop)', completed: false },
      { id: 'dl2', title: 'PyTorch or TensorFlow/Keras Basics', completed: false },
      { id: 'dl3', title: 'Convolutional Neural Networks (CNNs) for Images', completed: false },
      { id: 'dl4', title: 'Recurrent Neural Networks (RNNs) & LSTMs', completed: false },
      { id: 'dl5', title: 'Natural Language Processing (NLP) Basics', completed: false },
      { id: 'dl6', title: 'Transformers & LLMs (HuggingFace)', completed: false },
    ],
  },
  {
    id: 'job-ready',
    stage: 'Job Readiness',
    description: 'Preparing for the industry',
    icon: Briefcase,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500',
    items: [
      { id: 'jr1', title: 'Git & Version Control', completed: false },
      { id: 'jr2', title: 'SQL & Database Management', completed: false },
      { id: 'jr3', title: 'Cloud Basics (AWS/GCP/Azure)', completed: false },
      { id: 'jr4', title: 'End-to-End Capstone Project', completed: false },
      { id: 'jr5', title: 'Resume & Portfolio Website', completed: false },
      { id: 'jr6', title: 'Interview Prep (LeetCode, System Design)', completed: false },
    ],
  },
];

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState(initialRoadmapData);
  const [expandedSections, setExpandedSections] = useState<string[]>(['python']); // First one open by default

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ds-roadmap-progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRoadmap(initialRoadmapData.map(section => {
          const savedSection = parsed.find((s: any) => s.id === section.id);
          if (savedSection) {
            return {
              ...section,
              items: section.items.map(item => {
                const savedItem = savedSection.items?.find((i: any) => i.id === item.id);
                return savedItem ? { ...item, completed: savedItem.completed } : item;
              })
            };
          }
          return section;
        }));
      } catch (e) {
        console.error("Failed to parse roadmap data");
      }
    }
  }, []);

  // Save to local storage when roadmap changes
  useEffect(() => {
    localStorage.setItem('ds-roadmap-progress', JSON.stringify(roadmap));
  }, [roadmap]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleItem = (sectionId: string, itemId: string) => {
    setRoadmap(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return section;
    }));
  };

  const calculateOverallProgress = () => {
    let total = 0;
    let completed = 0;
    roadmap.forEach(section => {
      total += section.items.length;
      completed += section.items.filter(i => i.completed).length;
    });
    return Math.round((completed / total) * 100) || 0;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Data Science Master Roadmap
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            A comprehensive, step-by-step curriculum to take you from absolute beginner to a job-ready Data Scientist. Track your progress by ticking off topics as you learn them.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center min-w-[120px]">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">Overall</span>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{calculateOverallProgress()}%</span>
        </div>
      </div>

      <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 md:ml-6 space-y-8 pb-8">
        {roadmap.map((section, index) => {
          const isExpanded = expandedSections.includes(section.id);
          const completedCount = section.items.filter(i => i.completed).length;
          const totalCount = section.items.length;
          const progressPercent = Math.round((completedCount / totalCount) * 100);
          const isFullyCompleted = completedCount === totalCount;
          const Icon = section.icon;

          return (
            <div key={section.id} className="relative pl-8 md:pl-12">
              {/* Timeline Node */}
              <div className={`absolute -left-[17px] top-4 h-8 w-8 rounded-full border-4 border-slate-50 dark:border-slate-900 flex items-center justify-center shadow-sm transition-colors duration-300 ${isFullyCompleted ? section.bgColor : 'bg-slate-200 dark:bg-slate-700'}`}>
                {isFullyCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-white" />
                ) : (
                  <div className={`h-2.5 w-2.5 rounded-full ${section.bgColor}`} />
                )}
              </div>
              
              <motion.div 
                layout
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border transition-colors duration-300 overflow-hidden ${isFullyCompleted ? 'border-emerald-200 dark:border-emerald-900/50' : 'border-slate-200 dark:border-slate-700'}`}
              >
                {/* Header (Clickable) */}
                <button 
                  onClick={() => toggleSection(section.id)}
                  className="w-full text-left p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-700/50 ${section.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {section.stage}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{section.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                    <div className="flex flex-col items-end">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {completedCount} / {totalCount} completed
                      </div>
                      <div className="w-32 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-full rounded-full ${section.bgColor}`}
                        />
                      </div>
                    </div>
                    <div className="text-slate-400 bg-slate-100 dark:bg-slate-700 p-2 rounded-full">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </div>
                </button>

                {/* Expandable Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50"
                    >
                      <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {section.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => toggleItem(section.id, item.id)}
                            className={`flex items-start text-left p-3 rounded-lg border transition-all duration-200 group ${
                              item.completed
                                ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/30 shadow-sm'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md'
                            }`}
                          >
                            <motion.div 
                              whileTap={{ scale: 0.8 }}
                              className="mt-0.5 mr-3 flex-shrink-0"
                            >
                              {item.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                              ) : (
                                <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-400 transition-colors" />
                              )}
                            </motion.div>
                            <span className={`text-sm font-medium leading-relaxed ${
                              item.completed ? 'text-emerald-900 dark:text-emerald-300 line-through opacity-70' : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              {item.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
