import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Search, BookOpen } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import {
  fetchBlogs,
  setFilters,
  createBlog,
  deleteBlog,
  setCurrentPost,
  updateBlog,
} from "../store/slices/blogSlice";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Card from "../components/UI/Card";
import FormModal from "../components/UI/FormModal";
import ViewModal from "../components/UI/ViewModal";
import EmptyState from "../components/UI/EmptyState";
import DeleteConfirmModal from "../components/UI/DeleteConfirmModal";
import { format } from "date-fns";
import noImg from "../images/no-img.jpg";
import { downloadPDF } from "../utils/downloadPDF";
import toast from "react-hot-toast";

const BlogPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { posts, isLoading, filters, pagination, currentPost } = useAppSelector(
    (state) => state.blog
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Infinite scroll state
  const [page, setPage] = useState(1);
  const loader = useRef<HTMLDivElement | null>(null);

  // Reset page and posts on filters change
  useEffect(() => {
    setPage(1);
    dispatch(fetchBlogs({ page: 1, ...filters }));
  }, [dispatch, filters]);

  useEffect(() => {
    if (page === 1) return;
    dispatch(fetchBlogs({ page, ...filters }));
  }, [dispatch, page, filters]);

  // IntersectionObserver for infinite scroll
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
    [isLoading, pagination.page, pagination.totalPages]
  );

  useEffect(() => {
    const option = { root: null, rootMargin: "20px", threshold: 1.0 };
    const observer = new window.IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ sortBy: e.target.value as "latest" | "oldest" }));
  };

  const handleCreateBlog = async (data: any) => {
    await dispatch(createBlog(data));
    setShowCreateModal(false);
    toast.success("Blog created successfully!");
  };

  const handleEditBlog = (blog: any) => {
    setEditData(blog);
    setShowEditModal(true);
  };

  const handleUpdateBlog = async (data: any) => {
    if (!editData?.id) return;
    await dispatch(updateBlog({ id: editData.id, ...data }));
    setShowEditModal(false);
    setEditData(null);
    toast.success("Blog updated successfully!");
  };

  const blogFormFields = [
    {
      name: "title",
      label: "Title",
      type: "text" as const,
      required: true,
      placeholder: "Enter blog title",
    },
    {
      name: "content",
      label: "Content",
      type: "textarea" as const,
      required: true,
      placeholder: "Write your blog content...",
    },
    {
      name: "imageUrl",
      label: "Image URL",
      type: "url" as const,
      placeholder: "https://example.com/image.jpg",
    },
  ];

  function handleDownloadPDF(post?: typeof currentPost): void {
    const blog = post || currentPost;
    if (!blog) return;
    downloadPDF(blog);
  }

  function handleDeleteBlog(id: string): void {
    setDeleteId(id);
  }

  async function confirmDeleteBlog() {
    if (!deleteId) return;
    setIsDeleting(true);
    await dispatch(deleteBlog(deleteId));
    setIsDeleting(false);
    setDeleteId(null);
    toast.success("Blog deleted successfully!");
  }

  function handleViewBlog(post: typeof currentPost): void {
    dispatch(setCurrentPost(post));
    setShowViewModal(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Blog Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your blog content
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          New Post
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search blog posts..."
              value={filters.search}
              onChange={handleSearch}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading && posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Loading posts...
          </p>
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  title={post.title}
                  content={post.content}
                  imageUrl={post.imageUrl ? post.imageUrl : noImg}
                  date={format(new Date(post.createdAt), "MMM dd, yyyy")}
                  onView={() => handleViewBlog(post)}
                  onEdit={() => handleEditBlog(post)}
                  onDelete={() => handleDeleteBlog(post.id)}
                  onDownload={() => handleDownloadPDF(post)}
                />
              </motion.div>
            ))}
          </div>
          {/* Loader for infinite scroll */}
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
          title="No blog posts yet"
          description="Start sharing your thoughts and ideas by creating your first blog post."
          icon={<BookOpen className="w-12 h-12" />}
          actionLabel="Create First Post"
          onAction={() => setShowCreateModal(true)}
        />
      )}

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDeleteBlog}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        isLoading={isDeleting}
      />

      {/* Create Modal */}
      <FormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Blog Post"
        fields={blogFormFields}
        onSubmit={handleCreateBlog}
        isLoading={isLoading}
      />

      {/* Edit Modal */}
      <FormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditData(null);
        }}
        title="Edit Blog Post"
        fields={blogFormFields}
        onSubmit={handleUpdateBlog}
        initialData={editData}
        isLoading={isLoading}
      />

      <ViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Blog Post"
        data={currentPost}
        onDownload={() => handleDownloadPDF(currentPost)}
      />
    </div>
  );
};

export default BlogPage;
