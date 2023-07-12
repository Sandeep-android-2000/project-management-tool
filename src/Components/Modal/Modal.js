import React from "react";



function Modal(props) {
  return (
    <div
      className="top-0 left-0 w-full fixed max-[600px]:absolute
      min-[601px]:h-screen overflow-y-auto p-[40px] flex justify-center items-center bg-[rgba(0,0,0,0.64)] z-[100] "
      onClick={() => (props.onClose ? props.onClose() : "")}
    >
      <div
        className="h-fit bg-[#fff] rounded-[4px]"
        onClick={(event) => event.stopPropagation()}
      >
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
