import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import GoalCard from "./UI/GoalCard";

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

interface DroppableColumnProps {
  id: string;
  title: string;
  count: number;
  goals: Goal[];
  statusColor: string;
  dragColor: string;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
  id,
  title,
  count,
  goals,
  statusColor,
  dragColor,
  onEditGoal,
  onDeleteGoal,
}) => {
  return (
    <div className="space-y-4 flex-1">
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 ${statusColor} rounded-full`}></div>
        <h2 className="text-xl font-bold text-gray-900">
          {title} ({count})
        </h2>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-4 min-h-[500px] p-6 rounded-2xl border-2 border-dashed transition-all duration-200 ${
              snapshot.isDraggingOver
                ? `${dragColor} border-opacity-60`
                : "border-gray-300 bg-gray-50/30"
            }`}
          >
            {goals.map((goal, index) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                index={index}
                showEdit={id === "start"}
                onEdit={onEditGoal}
                onDelete={onDeleteGoal}
              />
            ))}
            {provided.placeholder}
            {goals.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                {id === "start" ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 mb-2 text-amber-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m2 0a2 2 0 100-4H7a2 2 0 100 4h10zM9 16h6m2 0a2 2 0 100-4H7a2 2 0 100 4h10z"
                      />
                    </svg>
                    <p className="text-sm">
                      You're all set! No goals in progress.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Create a goal to start your journey!
                    </p>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 mb-2 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-sm">No goals completed yet.</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Keep going, you're almost there!
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default DroppableColumn;
