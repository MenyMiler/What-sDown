import React from 'react';

interface CustomPromptProps {
  isVisible: boolean;
  Component: React.ComponentType<any>; // הקומפוננטה שמועברת כפרמטר
  onClose: () => void; // פונקציה לסגירה
}

const CustomPrompt: React.FC<CustomPromptProps> = ({ isVisible, Component, onClose }) => {
  if (!isVisible) return null; // אם לא צריך להציג, נחזיר null

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>סגור</button>
        <Component />
      </div>
    </div>
  );
};

const styles = {
    overlay: {
      position: 'fixed' as 'fixed',  // כאן אנחנו מציינים במפורש שזה יהיה 'fixed'
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // שקיפות כהה
      zIndex: 1, // z-index של השכבת הרקע
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      zIndex: 2, // z-index של הקומפוננטה שתוצג מעל
    },
    closeButton: {
      position: 'absolute' as 'absolute', // גם כאן מציין את הערך המדויק
      top: '10px',
      right: '10px',
      padding: '5px 10px',
      backgroundColor: 'red',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
    },
  };
  

export default CustomPrompt;
