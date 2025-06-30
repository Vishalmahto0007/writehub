import React from "react";
import { motion } from "framer-motion";
import { Eye, Download, Edit, Trash2 } from "lucide-react";

interface CardProps {
  title?: string;
  content?: string;
  imageUrl?: string;
  priority?: "low" | "medium" | "high";
  type?: string;
  date?: string;
  completed?: boolean;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  content,
  imageUrl,
  priority,
  type,
  date,
  completed,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onClick,
}) => {
  const priorityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden ${
        completed ? "opacity-75" : ""
      }`}
      onClick={onClick}
    >
      {/* Image */}
      {imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3
            className={`font-semibold text-gray-900 dark:text-white line-clamp-2 ${
              completed ? "line-through text-gray-500" : ""
            }`}
          >
            {title}
          </h3>

          {/* Download button - top right */}
          {onDownload && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              <Download className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Content */}
        {content && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
            {truncateText(content)}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {priority && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[priority]}`}
              >
                {priority}
              </span>
            )}
            {type && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {type}
              </span>
            )}
          </div>
          {date && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {date}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2">
          {onView && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          )}

          {onEdit && !completed && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
          )}

          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
