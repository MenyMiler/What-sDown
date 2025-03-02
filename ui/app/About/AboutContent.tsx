

import { ToastContainer, toast } from 'react-toastify';

// Default
// info
// success
// warning
// error

export function AboutContent() {
  const Default = () => toast("Default");
  const info = () => toast.info("info!");
  const success = () => toast.success("success!");
  const warning = () => toast.warning("warning!");
  const error = () => toast.error("error!");

    return (
      <div>
        <h1>אודות</h1>
        <p>ברוכים הבאים לדף האודות שלנו!</p>

        <button onClick={Default}>Default</button>
        <br />
        <button onClick={info}>info</button>
        <br />
        <button onClick={success}>success</button>
        <br />
        <button onClick={warning}>warning</button>
        <br />
        <button onClick={error}>error</button>
        <ToastContainer />
      </div>
    );
  }
  
  export default AboutContent;  