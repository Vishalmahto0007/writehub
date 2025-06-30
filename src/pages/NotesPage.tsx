import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Search, StickyNote, Pencil } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
  setFilters,
  setCurrentNote,
} from "../store/slices/notesSlice";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Card from "../components/UI/Card";
import FormModal from "../components/UI/FormModal";
import ViewModal from "../components/UI/ViewModal";
import EmptyState from "../components/UI/EmptyState";
import DeleteConfirmModal from "../components/UI/DeleteConfirmModal";
import { format } from "date-fns";
import { downloadPDF } from "../utils/downloadPDF";
import toast from "react-hot-toast";

const NotesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notes, isLoading, filters, currentNote, pagination } = useAppSelector(
    (state) => state.notes
  );

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [editData, setEditData] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPage(1);
    dispatch(fetchNotes({ page: 1, ...filters }));
  }, [dispatch, filters]);

  useEffect(() => {
    if (page === 1) return;
    dispatch(fetchNotes({ page, ...filters }));
  }, [dispatch, page, filters]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        !isLoading &&
        pagination.page < pagination.totalPages
      ) {
        setPage((prev) => prev + 1);
      }
    },
    [isLoading, pagination?.page, pagination?.totalPages]
  );

  useEffect(() => {
    const option = { root: null, rootMargin: "20px", threshold: 1.0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const handleTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ type: e.target.value }));
  };

  const handleCreateNote = async (data: any) => {
    const toastId = toast.loading("Creating note...");
    try {
      await dispatch(createNote(data)).unwrap();
      toast.success("Note created successfully!", { id: toastId });
      setShowCreateModal(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to create note", { id: toastId });
    }
  };

  const handleEditNote = (note: any) => {
    setEditData(note);
    setShowEditModal(true);
  };

  const handleUpdateNote = async (data: any) => {
    if (!editData?.id) return;

    const toastId = toast.loading("Updating note...");
    try {
      await dispatch(updateNote({ id: editData.id, ...data })).unwrap();
      toast.success("Note updated successfully!", { id: toastId });
      setShowEditModal(false);
      setEditData(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update note", { id: toastId });
    }
  };

  const handleDeleteNote = (id: string) => {
    setDeleteId(id);
  };

  const confirmDeleteNote = async () => {
    if (!deleteId) return;

    const toastId = toast.loading("Deleting note...");
    setIsDeleting(true);
    try {
      await dispatch(deleteNote(deleteId)).unwrap();
      toast.success("Note deleted successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete note", { id: toastId });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleViewNote = (note: any) => {
    dispatch(setCurrentNote(note));
    setShowViewModal(true);
  };

  const handleDownloadPDF = (note?: typeof currentNote) => {
    const data = note || currentNote;
    if (!data) return;
    downloadPDF(data);
  };

  const noteFormFields = [
    {
      name: "title",
      label: "Title",
      type: "text" as const,
      required: true,
      placeholder: "Enter note title",
    },
    {
      name: "type",
      label: "Type",
      type: "select" as const,
      required: true,
      options: [
        { value: "personal", label: "Personal" },
        { value: "work", label: "Work" },
        { value: "study", label: "Study" },
        { value: "ideas", label: "Ideas" },
        { value: "reminders", label: "Reminders" },
        { value: "others", label: "Others" },
      ],
    },
    {
      name: "content",
      label: "Content",
      type: "textarea" as const,
      required: true,
      placeholder: "Write your note content...",
    },
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      personal: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      work: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      study:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      ideas:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      reminders: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      others:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
    return (
      colors[type as keyof typeof colors] ||
      "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your thoughts and ideas
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          New Note
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search notes..."
              value={filters.search}
              onChange={handleSearch}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={filters.type}
            onChange={handleTypeFilter}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="study">Study</option>
            <option value="ideas">Ideas</option>
            <option value="reminders">Reminders</option>
            <option value="others">Others</option>
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      {isLoading && notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Loading notes...
          </p>
        </div>
      ) : notes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  title={note.title}
                  content={note.content}
                  type={note.type}
                  date={format(new Date(note.createdAt), "MMM dd, yyyy")}
                  onView={() => handleViewNote(note)}
                  onEdit={() => handleEditNote(note)}
                  onDelete={() => handleDeleteNote(note.id)}
                  onDownload={() => handleDownloadPDF(note)}
                />
              </motion.div>
            ))}
          </div>
          <div ref={loader} className="flex justify-center py-6">
            {isLoading && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            )}
            {!isLoading && pagination.page < pagination.totalPages && (
              <span className="text-gray-500 dark:text-gray-400">
                Scroll to load more...
              </span>
            )}
          </div>
        </>
      ) : (
        <EmptyState
          title="No notes yet"
          description="Start capturing your thoughts and ideas by creating your first note."
          icon={<StickyNote className="w-12 h-12" />}
          actionLabel="Create First Note"
          onAction={() => setShowCreateModal(true)}
        />
      )}

      {/* Modals */}
      <FormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Note"
        fields={noteFormFields}
        onSubmit={handleCreateNote}
        isLoading={isLoading}
      />

      <FormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditData(null);
        }}
        title="Edit Note"
        fields={noteFormFields}
        onSubmit={handleUpdateNote}
        initialData={editData}
        isLoading={isLoading}
      />

      <ViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Note"
        data={currentNote}
        onDownload={() => handleDownloadPDF(currentNote)}
      />

      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDeleteNote}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default NotesPage;
