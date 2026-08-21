import React from "react";
import "./Spinner.css";

const SIZES = {
  sm: "spinner-sm",
  md: "spinner-md",
  lg: "spinner-lg",
};

const Spinner = ({ size = "md", label, fullScreen = false }) => {
  const content = (
    <div className="spinner-stack">
      <span className={`spinner-ring ${SIZES[size] || SIZES.md}`} />
      {label && <p className="spinner-label">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="spinner-fullscreen">{content}</div>;
  }

  return <div className="spinner-container">{content}</div>;
};

export default Spinner;
