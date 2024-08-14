import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const configuration = {
  position: 'top-right',
  autoClose: false,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
};

const Toast = {
  Success: (message, duration = 3000) => {
    toast.success(message, { ...configuration, autoClose: duration });
  },
  Warning: (message, duration = 3000) => {
    toast.warn(message, { ...configuration, autoClose: duration });
  },
  Error: (message, duration = 3000) => {
    toast.error(message, { ...configuration, autoClose: duration });
  },
  Notify: (message, duration = 3000) => {
    toast.info(message, { ...configuration, autoClose: duration });
  },
  Waiting: (message) => {
    toast.loading(message, { ...configuration });
  },
  Remove: () => toast.dismiss(),
};

export default Toast;
