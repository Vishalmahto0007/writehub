import React from "react";
import { useForm } from "react-hook-form";
import Modal from "./Modal";
import Button from "./Button";
import Input from "./Input";

interface FormField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "date" | "url";
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  min?: string;
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FormField[];
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    mode: "onSubmit",
    defaultValues: initialData || {},
  });
  // React.useEffect(() => {
  //   if (initialData) {
  //     reset(initialData);
  //   }
  // }, [initialData, reset]);
  React.useEffect(() => {
    if (isOpen) {
      reset(initialData || {});
    }
  }, [isOpen]);

  const renderField = (field: FormField) => {
    let validation: any = {};
    if (field.required) {
      validation.required = `${field.label} is required`;
    }
    if (field.type === "url") {
      validation.pattern = {
        value: /^https?:\/\/.+\..+/,
        message: "Please enter a valid Image URL",
      };
    }

    const fieldProps = {
      ...register(field.name, validation),
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case "textarea":
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
            <textarea
              {...fieldProps}
              rows={4}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
            />
            {errors[field.name]?.message && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {String(errors[field.name]?.message)}
              </p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
            <select
              {...fieldProps}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors[field.name] && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {String(errors[field.name]?.message)}
              </p>
            )}
          </div>
        );

      default:
        return (
          <Input
            key={field.name}
            label={field.label}
            type={field.type}
            min={field.min}
            error={
              errors[field.name] &&
              typeof errors[field.name] === "object" &&
              "message" in (errors[field.name] ?? {})
                ? (errors[field.name] as { message?: string }).message
                : undefined
            }
            {...fieldProps}
          />
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map(renderField)}

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            {initialData ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;
