import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Modal from "./Modal";
import Button from "./Button";
import { Download } from "lucide-react";
import noImg from "../../images/no-img.jpg";

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
  onDownload?: () => void;
}

const ViewModal: React.FC<ViewModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
  onDownload,
}) => {
  if (!data) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className="space-y-6">
        {/* Image */}
        {title === "Blog Post" && (
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            src={data.imageUrl ? data.imageUrl : noImg}
            alt={data.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {data.title}
          </h3>

          {data.content && (
            <div
              className="prose dark:prose-invert max-w-none overflow-auto"
              style={{ maxHeight: "15rem" }} // ~240px, adjust as needed
            >
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                {data.content}
              </p>
            </div>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            {data.priority && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  data.priority === "high"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : data.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                }`}
              >
                {data.priority} priority
              </span>
            )}

            {data.type && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {data.type}
              </span>
            )}

            {data.targetDate && (
              <span>
                Target: {format(new Date(data.targetDate), "MMM dd, yyyy")}
              </span>
            )}

            {data.createdAt && (
              <span>
                Created: {format(new Date(data.createdAt), "MMM dd, yyyy")}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          {onDownload && (
            <Button
              variant="outline"
              icon={<Download className="w-4 h-4" />}
              onClick={onDownload}
            >
              Download PDF
            </Button>
          )}
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewModal;
