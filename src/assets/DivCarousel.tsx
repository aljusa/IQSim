import { useState } from "react";
import type { ReactNode } from "react";

type DivCarouselProps = {
  children: ReactNode;
};

function DivCarousel({ children }: DivCarouselProps) {
  const items = Array.isArray(children) ? children : [children];
  const [index, setIndex] = useState(0);

  const handleClick = () => {
    setIndex((prev) => (prev + 1) % items.length);
  };

  // porcentaje de la barra

  return (
    <div style={{ width: "100%" }} className="pb-4">
      {/* CONTENEDOR CLICK */}
      <div
        onClick={handleClick}
        style={{
          cursor: "pointer",
          width: "100%",
        }}
      >
        {items[index]}
      </div>

      {/* BARRA DE PROGRESO */}
      <div
  style={{
    marginTop: 10,
    display: "flex",
    gap: 4,
    width: "100%",
  }}
>
  {items.map((_, i) => (
    <div
      key={i}
      style={{
        flex: 1,
        height: 6,
        borderRadius: 4,
        backgroundColor: i <= index ? "#4f46e5" : "#e0e0e0",
        transition: "background-color 0.3s ease",
      }}
    />
  ))}
</div>
    </div>
  );
}

export default DivCarousel;
