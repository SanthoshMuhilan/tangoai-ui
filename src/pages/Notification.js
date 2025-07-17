import React from 'react';
import './ToastNotification.css'; // Assuming you have styles here

const ToastNotification = () => {
  return (
    <div className="notification">
      <div className="notification-body">
        <img
          src="assets/check-circle.svg"
          alt="Success"
          className="notification-icon"
        />
        <span>Your account has been created! 🚀</span>
      </div>
      <div className="notification-progress"></div>
    </div>
  );
};

export default ToastNotification;
