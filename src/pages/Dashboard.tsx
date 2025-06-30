import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckSquare,
  StickyNote,
  Target,
  TrendingUp,
  Calendar,
  Clock,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import { fetchDashboardItems } from "../store/slices/dashboardSlice";

const quotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts. – Winston Churchill",
  "Believe you can and you're halfway there. – Theodore Roosevelt",
  "Do not wait to strike till the iron is hot; but make it hot by striking. – William Butler Yeats",
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "You miss 100% of the shots you don’t take. – Wayne Gretzky",
  "The future depends on what you do today. – Mahatma Gandhi",
  "It always seems impossible until it’s done. – Nelson Mandela",
  "Start where you are. Use what you have. Do what you can. – Arthur Ashe",
  "If opportunity doesn’t knock, build a door. – Milton Berle",
  "Dream big and dare to fail. – Norman Vaughan",
  "Everything you’ve ever wanted is on the other side of fear. – George Addair",
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Success is the sum of small efforts, repeated day in and day out. – Robert Collier",
  "Push yourself, because no one else is going to do it for you. – Unknown",
  "Great things never come from comfort zones. – Unknown",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us. – Ralph Waldo Emerson",
  "Keep your face always toward the sunshine—and shadows will fall behind you. – Walt Whitman",
  "A year from now you may wish you had started today. – Karen Lamb",
  "Hardships often prepare ordinary people for an extraordinary destiny. – C.S. Lewis",
  "You are never too old to set another goal or to dream a new dream. – C.S. Lewis",
];

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const { items, counts } = useAppSelector((state) => state.dashboard);

  console.log(items, counts);

  useEffect(() => {
    dispatch(fetchDashboardItems());
  }, [fetchDashboardItems]);

  const getThoughtOfTheDay = () => {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const dayNumber = Math.floor(startOfDay.getTime() / (1000 * 60 * 60 * 24)); // Days since epoch
    const index = dayNumber % quotes.length;
    return quotes[index];
  };

  const thoughtOfTheDay = getThoughtOfTheDay();
  const stats = [
    {
      label: "Blog Posts",
      value: counts?.blogs,
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Todos",
      value: counts?.incompleteTodos,
      icon: CheckSquare,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Notes",
      value: counts?.notes,
      icon: StickyNote,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      label: "Goals",
      value: counts?.startedGoals,
      icon: Target,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  const quickActions = [
    {
      label: "New Blog Post",
      to: "/blog",
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      label: "Add Todo",
      to: "/todo",
      icon: CheckSquare,
      color: "bg-green-500",
    },
    {
      label: "Create Note",
      to: "/notes",
      icon: StickyNote,
      color: "bg-yellow-500",
    },
    { label: "Set Goal", to: "/goals", icon: Target, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || "vishalmahto"}!
        </h1>
        <p className="text-primary-100 mb-6">
          Ready to make today productive? Here's your overview.
        </p>

        {/* Thought of the Day */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Thought of the Day</h3>
              <p className="text-sm text-primary-100 italic">
                "{thoughtOfTheDay}"
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg} dark:bg-opacity-20`}>
                <stat.icon
                  className={`w-6 h-6 ${stat.color} dark:text-opacity-80`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.label} to={action.to}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className={`p-3 rounded-lg ${action.color} mb-2`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                  {action.label}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Last 7 days</span>
          </div>
        </div>

        {items?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={`${item.type}-${item.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={item.path}>
                  <Card
                    title={item.title}
                    content={
                      "content" in item
                        ? item.content
                        : `Priority - ${item.priority}`
                    }
                    type={item.type}
                    date={new Date(item.createdAt).toLocaleDateString()}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No recent activity
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start creating content to see your recent activity here.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/blog">
                <Button icon={<BookOpen className="w-4 h-4" />}>
                  Create Blog
                </Button>
              </Link>
              <Link to="/todo">
                <Button
                  variant="outline"
                  icon={<CheckSquare className="w-4 h-4" />}
                >
                  Add Todo
                </Button>
              </Link>
            </div>
          </div>
        )}
      </motion.div>

      {/* App Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          WriteHub Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <BookOpen className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Blog Management
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create, edit, and organize your blog posts with rich content
                  and images.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckSquare className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Task Tracking
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Keep track of your todos with priority levels and completion
                  status.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <StickyNote className="w-6 h-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Note Organization
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Organize your thoughts with categorized notes and easy search.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Goal Tracking
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set and track your goals with drag-and-drop progress
                  management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
