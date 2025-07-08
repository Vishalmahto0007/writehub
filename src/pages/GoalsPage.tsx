import React, { useState, useEffect } from "react";
import { Plus, Target } from "lucide-react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Button from "../components/UI/Button";
import FormModal from "../components/UI/FormModal";
import EmptyState from "../components/UI/EmptyState";
import DeleteConfirmModal from "../components/UI/DeleteConfirmModal";
import DroppableColumn from "../components/DroppableColumn";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import toast from "react-hot-toast";

import {
  fetchGoals,
  createGoal,
  deleteGoal,
  updateGoalStatus,
  moveGoal,
  updateGoal,
} from "../store/slices/goalsSlice";

const GoalsPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { goals, isLoading } = useAppSelector((state) => state.goals);
  const dispatch = useAppDispatch();

  const startGoals = goals.filter((goal) => goal.status === "start");
  const completedGoals = goals.filter((goal) => goal.status === "completed");

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const handleCreateGoal = async (data: any) => {
    await dispatch(createGoal({ ...data, status: "start" }));
    await dispatch(fetchGoals());
    setShowCreateModal(false);
    toast.success("Goal created successfully!");
  };

  const handleEditGoal = async (data: any) => {
    if (editingGoal) {
      await dispatch(updateGoal({ id: editingGoal.id, updates: data }));
      await dispatch(fetchGoals());
      setEditingGoal(null);
      toast.success("Goal updated successfully!");
    }
  };

  const handleDeleteGoal = (id: string) => {
    setDeleteId(id);
  };

  const confirmDeleteGoal = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await dispatch(deleteGoal(deleteId));
    await dispatch(fetchGoals());
    setIsDeleting(false);
    setDeleteId(null);
    toast.success("Goal deleted successfully!");
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      const newStatus = destination.droppableId as "start" | "completed";
      await dispatch(moveGoal({ goalId: draggableId, newStatus }));
      await dispatch(updateGoalStatus({ id: draggableId, status: newStatus }));
    }
  };

  const goalFormFields = [
    {
      name: "title",
      label: "Title",
      type: "text" as const,
      required: true,
      placeholder: "Enter goal title",
    },
    {
      name: "content",
      label: "Description",
      type: "textarea" as const,
      required: true,
      placeholder: "Describe your goal...",
    },
    {
      name: "targetDate",
      label: "Target Date",
      type: "date" as const,
      required: true,
      min: new Date().toISOString().split("T")[0],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Goals
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and achieve your objectives
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Goal
        </Button>
      </div>

      {isLoading && goals.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Loading goals...
          </p>
        </div>
      ) : goals.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DroppableColumn
              id="start"
              title="In Progress"
              count={startGoals.length}
              goals={startGoals}
              statusColor="bg-yellow-500"
              dragColor="border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
              onEditGoal={setEditingGoal}
              onDeleteGoal={handleDeleteGoal}
            />
            <DroppableColumn
              id="completed"
              title="Completed"
              count={completedGoals.length}
              goals={completedGoals}
              statusColor="bg-green-500"
              dragColor="border-green-400 bg-green-50 dark:bg-green-900/20"
              onEditGoal={setEditingGoal}
              onDeleteGoal={handleDeleteGoal}
            />
          </div>
        </DragDropContext>
      ) : (
        <EmptyState
          title="No goals yet"
          description="Set your first goal and start working towards achieving it."
          icon={<Target className="w-12 h-12" />}
          actionLabel="Set First Goal"
          onAction={() => setShowCreateModal(true)}
        />
      )}

      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDeleteGoal}
        title="Delete Goal"
        message="Are you sure you want to delete this goal? This action cannot be undone."
        isLoading={isDeleting}
      />

      <FormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Goal"
        fields={goalFormFields}
        onSubmit={handleCreateGoal}
        isLoading={isLoading}
      />

      <FormModal
        isOpen={!!editingGoal}
        onClose={() => setEditingGoal(null)}
        title="Edit Goal"
        fields={goalFormFields}
        onSubmit={handleEditGoal}
        initialData={editingGoal}
        isLoading={isLoading}
      />
    </div>
  );
};

export default GoalsPage;
