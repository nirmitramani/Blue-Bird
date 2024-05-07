import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const ConfirmDelete = () => {
  const showConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className=''>
          <div className="bg-gray-100 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-3 text-gray-700">{message}</p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                onClick={() => {
                  if (onCancel) onCancel();
                  onClose();
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      ),
    });
  };

  return showConfirmDialog;
};

export default ConfirmDelete;
