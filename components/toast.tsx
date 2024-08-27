// CustomToastContainer.js
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notifySuccess = (message: string) =>
  toast.success(message, {
    position: "top-left",
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "dark",
  });

const notifyError = (message: string) =>
  toast.error(message, {
    position: "top-left",
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "dark",
  });

const notifyInfo = (message: string) =>
  toast.info(message, {
    position: "top-left",
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "dark",
  });

const CustomToastContainer = ({ width = 300, time = 5000 }) => (
  <>
    <ToastContainer
      position='top-left'
      autoClose={time}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme='light'
      style={{ marginTop: 80, width: "80%", maxWidth: width, lineHeight: 1.5 }}
    />
  </>
);

export { CustomToastContainer, notifySuccess, notifyError, notifyInfo };
