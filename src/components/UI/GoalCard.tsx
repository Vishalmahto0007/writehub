import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { format, isPast } from "date-fns";

export interface Goal {
  id: string;
  title: string;
  content: string;
  status: "start" | "completed";
  targetDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalData {
  title: string;
  content: string;
  targetDate: string;
}

export interface UpdateGoalData {
  title?: string;
  content?: string;
  targetDate?: string;
  status?: "start" | "completed";
}

interface GoalCardProps {
  goal: Goal;
  index: number;
  showEdit?: boolean;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  index,
  showEdit = true,
  onEdit,
  onDelete,
}) => {
  const isCompleted = goal.status === "completed";
  const isOverdue =
    goal.status === "start" && isPast(new Date(goal.targetDate));

  return (
    <Draggable draggableId={String(goal.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group rounded-xl px-4 py-3 shadow-sm border transition-all duration-200
            ${snapshot.isDragging ? "rotate-2 scale-105 shadow-md" : ""}
            ${
              isCompleted
                ? "bg-gray-50 border-gray-200"
                : "bg-white border-gray-300"
            }
            ${isOverdue ? "border-red-500 bg-red-50" : ""}
          `}
        >
          <h3
            className={`font-semibold text-sm mb-1 ${
              isCompleted ? "text-gray-500 line-through" : "text-gray-900"
            }`}
          >
            {goal.title}
          </h3>
          <p
            className={`text-xs mb-2 line-clamp-2 ${
              isCompleted ? "text-gray-400 line-through" : "text-gray-600"
            }`}
          >
            {goal.content}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(goal.targetDate), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {showEdit && !isCompleted && (
                <button
                  onClick={() =>
                    onEdit({
                      ...goal,
                      targetDate: new Date(goal.targetDate)
                        .toISOString()
                        .split("T")[0],
                    })
                  }
                  className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => onDelete(goal.id)}
                className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default GoalCard;
