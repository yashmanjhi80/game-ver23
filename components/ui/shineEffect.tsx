import React from "react";

interface ShineWrapperProps {
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
}

export const ShineWrapper: React.FC<ShineWrapperProps> = ({
  children,
  className = "",
  bgColor = "linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)",
}) => {
  const backgroundImage = bgColor.startsWith("linear-gradient")
    ? bgColor
    : `linear-gradient(to right, ${bgColor}, ${bgColor})`;

  return (
    <div
      className={`relative overflow-hidden rounded-md p-4 text-white font-medium shadow-[0px_0px_20px_rgba(71,184,255,0.5),inset_4px_4px_8px_rgba(175,230,255,0.5),inset_-4px_-4px_8px_rgba(19,95,216,0.35)] ${className}`}
      style={{
        backgroundImage,
        backgroundSize: "280% auto",
        backgroundPosition: "center",
        color: "hsl(0 0% 100%)",
      }}
    >
      {children}

      {/* Diagonal Shine Layer */}
      <div
        className="absolute top-0 left-0 w-[200%] h-[200%] bg-white/30 skew-x-[-20deg] pointer-events-none z-20"
        style={{
          animation: "diagonalShine 3s linear infinite",
        }}
      />
    </div>
  );
};