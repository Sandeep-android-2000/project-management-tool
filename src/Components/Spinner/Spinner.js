import React from "react";

function Spinner() {
  return (
    <div class="box-border place-content-center w-full h-screen flex items-center justify-center">
      <span class="w-[25px] h-[25px] bg-transparent rounded-full border-[4px] border-black border-b-transparent relative animate-spin"></span>
    </div>
  );
}

export default Spinner;
