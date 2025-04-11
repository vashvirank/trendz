import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const lastToastRef = useRef({ id: null, time: 0 });

  const showToast = useCallback((type, title, message) => {
    const now = Date.now();
    const toastKey = `${type}-${message}`;

    if (
      lastToastRef.current.id === toastKey &&
      now - lastToastRef.current.time < 500
    ) {
      return;
    }

    lastToastRef.current = { id: toastKey, time: now };

    const toastId = crypto.randomUUID();

    setToasts((prev) => [...prev, { id: toastId, type, title, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50 transition-all duration-300 ease-in-out">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
