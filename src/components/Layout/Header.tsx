import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon, User, LogOut, ChevronDown } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { toggleTheme } from "../../store/slices/uiSlice";
import { logoutUser } from "../../store/slices/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const { theme } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logout Successfully.");
    setShowDropdown(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-16 px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center">
      <div className="flex items-center justify-end w-full space-x-4">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </motion.button>

        {/* User Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || "vishalmahto"}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </motion.button>

          {/* Dropdown */}
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
};

export default Header;
