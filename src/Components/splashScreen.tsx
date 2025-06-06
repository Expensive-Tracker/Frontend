import React from "react";
import { BiWalletAlt } from "react-icons/bi";
import { motion } from "framer-motion";
import Text from "./common/text/text";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  handleChangeSplashFlag,
  handleShowSplashScreen,
} from "@/store/slice/uiSlice";
import {} from "@/store/slice/userSlice";
import { useEffect } from "react";

const SplashScreen = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(handleChangeSplashFlag());
      dispatch(handleShowSplashScreen());
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const iconColor = theme === "dark" ? "#ffffff" : "#000000";
  const dotColor = theme === "dark" ? "bg-white" : "bg-black";

  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Logo and Text */}
      <div className="flex items-center gap-1">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
        >
          <BiWalletAlt className="w-16 h-16" color={iconColor} />
        </motion.div>
        <div>
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Text
              Element="h2"
              text="Expense"
              style={`font-bold !text-3xl ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            />
          </motion.div>
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Text
              Element="p"
              text="Tracker"
              style={`font-light -mt-1.5 !text-2xl ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
              isDes
            />
          </motion.div>
        </div>
      </div>

      {/* Loader */}
      <motion.div
        className="mt-4 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className={`w-2 h-2 rounded-full ${dotColor}`}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
