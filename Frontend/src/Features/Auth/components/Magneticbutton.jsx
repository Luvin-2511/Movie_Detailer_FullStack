import { useRef, useState } from "react";
import "../styles/Magneticbutton.scss";

const MagneticButton = ({ children, onClick, type = "button", disabled = false, className = "", loading = false }) => {
  const btnRef = useRef(null);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  const isLoading = disabled || loading;
  const text = typeof children === "string" ? children : "";
  const splitText = text.split("");

  const radius = 140;
  const jumpFactor = 0.4;

  const handleEffect = (e) => {
    if (isLoading) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    const distance = Math.sqrt(x * x + y * y);
    if (distance < radius) {
      setBtnPos({ x: x * jumpFactor, y: y * jumpFactor });
    } else {
      setBtnPos({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => setBtnPos({ x: 0, y: 0 });

  return (
    <button
      ref={btnRef}
      type={type}
      onClick={onClick}
      disabled={isLoading}
      onMouseMove={handleEffect}
      onMouseLeave={handleMouseLeave}
      style={{ transform: isLoading ? "none" : `translate(${btnPos.x}px, ${btnPos.y}px)` }}
      className={`magnetic-btn ${isLoading ? "magnetic-btn--loading" : ""} ${className}`}
    >
      {/* Spinner shown while loading */}
      {isLoading ? (
        <span className="magnetic-btn__spinner-wrap">
          <span className="magnetic-btn__spinner" />
          <span className="magnetic-btn__loading-text">{text}</span>
        </span>
      ) : (
        <>
          <h2 className="magnetic-btn__text">
            {splitText.map((letter, i) => (
              <span key={i} style={{ "--i": i }} className="magnetic-btn__letter">
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </h2>
          <h2 className="magnetic-btn__text-hover">
            {splitText.map((letter, i) => (
              <span key={i} style={{ "--ihov": i }} className="magnetic-btn__letter">
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </h2>
        </>
      )}
    </button>
  );
};

export default MagneticButton;