import React from "react";

function Loader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-28 w-28 border-t-2 border-gray-900" />
    </div>
  );
}

export default Loader;
