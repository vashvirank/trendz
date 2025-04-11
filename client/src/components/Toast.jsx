import React, { useEffect, useState } from "react";

const Toast = ({ type = "success", title, message, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    setVisible(true);
    const totalDuration = 5000;
    const intervalTime = 50;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (intervalTime / totalDuration) * 100;
        return next >= 100 ? 100 : next;
      });

      setCountdown((prev) => {
        const next = prev - intervalTime / 1000;
        return next <= 0 ? 0 : next;
      });
    }, intervalTime);

    const removeTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, totalDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-black border-l-4 border-transparent border-l-green-500"
      : type === "error"
      ? "bg-black border-l-2 border-transparent border-l-red-500"
      : "bg-black border-l-2 border-transparent border-l-blue-500";

  const textColor =
    type === "success"
      ? "text-green-500"
      : type === "error"
      ? "text-red-500"
      : "text-blue-500";

  const radius = 10;
  const stroke = 2;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`relative flex items-start gap-2 transform transition-all duration-300 ease-in-out rounded-md border p-3 px-4 shadow-md w-72
        ${bgColor}
        ${visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}
      `}
    >
      {/* Circular Countdown Timer */}
      <div className="w-12 h-12 relative flex items-center justify-center">
        <svg width="48" height="48">
          <circle
            stroke="black"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="24"
            cy="24"
          />
          <circle
            stroke={
              type === "success" ? "green" : type === "error" ? "red" : "blue"
            }
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            r={normalizedRadius}
            cx="24"
            cy="24"
            style={{ transition: "stroke-dashoffset 50ms linear" }}
          />
        </svg>
        <span className="text-gray-300 absolute inset-0 flex items-center justify-center text-xs font-semibold">
          {Math.max(Math.ceil(countdown), 0)}
        </span>
      </div>

      {/* Toast Text */}
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm">{message}</div>
      </div>
    </div>
  );
};

export default Toast;
