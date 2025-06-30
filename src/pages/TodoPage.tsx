import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, CheckSquare, Filter, Pencil, Trash2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  setFilter,
} from "../store/slices/todoSlice";
import Button from "../components/UI/Button";
import FormModal from "../components/UI/FormModal";
import EmptyState from "../components/UI/EmptyState";
import DeleteConfirmModal from "../components/UI/DeleteConfirmModal";
import { format } from "date-fns";
import toast from "react-hot-toast";

const TodoPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todos, isLoading, filter } = useAppSelector((state) => state.todo);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any>(null);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "open") return !todo.completed;
    return true;
  });

  const handleCreateTodo = async (data: any) => {
    await dispatch(createTodo(data));
    setShowCreateModal(false);
    toast.success("Todo created successfully!");
  };

  const handleEditTodo = async (data: any) => {
    if (editingTodo) {
      await dispatch(updateTodo({ id: editingTodo.id, updates: data }));
      setEditingTodo(null);
      toast.success("Todo updated successfully!");
    }
  };

  // Open delete modal
  const handleDeleteTodo = (id: string) => {
    setDeleteId(id);
  };

  // Confirm delete
  const confirmDeleteTodo = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await dispatch(deleteTodo(deleteId));
    setIsDeleting(false);
    setDeleteId(null);
    toast.success("Todo deleted successfully!");
  };

  const handleToggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      await dispatch(
        updateTodo({ id, updates: { completed: !todo.completed } })
      );
      toast.success(`Todo marked as ${todo.completed ? "open" : "completed"}!`);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const todoFormFields = [
    {
      name: "title",
      label: "Title",
      type: "text" as const,
      required: true,
      placeholder: "Enter todo title",
    },
    {
      name: "priority",
      label: "Priority",
      type: "select" as const,
      required: true,
      options: [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Todo List
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Keep track of your tasks
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Todo
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex space-x-2">
            {["all", "open", "completed"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => dispatch(setFilter(filterType as any))}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterType
                    ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Todo List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Loading todos...
          </p>
        </div>
      ) : filteredTodos.length > 0 ? (
        <div className="space-y-3">
          {filteredTodos.map((todo, index) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all ${
                todo.completed ? "opacity-75" : ""
              }`}
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleToggleTodo(todo.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? "bg-primary-500 border-primary-500 text-white"
                      : "border-gray-300 dark:border-gray-600 hover:border-primary-500"
                  }`}
                >
                  {todo.completed && <CheckSquare className="w-3 h-3" />}
                </button>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold text-lg text-gray-900 dark:text-white ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.title}
                  </h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        todo.priority
                      )}`}
                    >
                      {todo.priority}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(todo.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!todo.completed && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingTodo(todo)}
                      icon={<Pencil className="w-4 h-4" />}
                      aria-label="Edit"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-red-600 hover:text-red-700"
                    icon={<Trash2 className="w-4 h-4" />}
                    aria-label="Delete"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No todos yet"
          description="Add your first todo to get started with task management."
          icon={<CheckSquare className="w-12 h-12" />}
          actionLabel="Add Todo"
          onAction={() => setShowCreateModal(true)}
        />
      )}

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDeleteTodo}
        title="Delete Todo"
        message="Are you sure you want to delete this todo? This action cannot be undone."
        isLoading={isDeleting}
      />

      {/* Modals */}
      <FormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Todo"
        fields={todoFormFields}
        onSubmit={handleCreateTodo}
        isLoading={isLoading}
      />

      <FormModal
        isOpen={!!editingTodo}
        onClose={() => setEditingTodo(null)}
        title="Edit Todo"
        fields={todoFormFields}
        onSubmit={handleEditTodo}
        initialData={editingTodo}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TodoPage;
