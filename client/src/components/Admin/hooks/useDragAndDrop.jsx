import { useState } from 'react';

const useDragAndDrop = (reorderCallback) => {
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDragEnd = (targetIndex, items, setItems) => {
    if (draggedItem === null) return;

    const updatedItems = [...items];
    const sourceIndex = updatedItems.findIndex((item) => item._id === draggedItem._id);

    updatedItems.splice(sourceIndex, 1);
    updatedItems.splice(targetIndex, 0, draggedItem);

    // Call the reorderCallback to handle the new order on the backend
    reorderCallback(updatedItems)
      .then(() => {
        setItems(updatedItems);
        setDraggedItem(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return {
    draggedItem,
    handleDragStart,
    handleDragEnd,
  };
};

export default useDragAndDrop;
