import { useEffect, useState } from "react";
import { searchImages } from "../lib/nasa";

const QUERIES = {
  sun: "Sun SDO NASA",
  mercury: "Mercury MESSENGER NASA",
  venus: "Venus planet NASA",
  earth: "Earth Blue Marble NASA",
  moon: "Moon surface NASA",
  mars: "Mars planet NASA",
  jupiter: "Jupiter Juno NASA",
  saturn: "Saturn Cassini NASA",
  uranus: "Uranus Voyager 2 NASA",
  neptune: "Neptune Voyager 2 NASA",
  pluto: "Pluto New Horizons NASA",
};

const COLORS = {
  sun: "#fbbf24",
  mercury: "#9ca3af",
  venus: "#e8c07a",
  earth: "#3b82f6",
  moon: "#a1a1aa",
  mars: "#d9534f",
  jupiter: "#d8a47f",
  saturn: "#e3c98b",
  uranus: "#7fd8e0",
  neptune: "#4f6df5",
  pluto: "#b69a85",
};

export default function PlanetArt({
  body,
  className = "h-40 w-40",
}) {
  const [image, setImage] = useState("");
  const [failed, setFailed] = useState(false);
  const id = String(body?.id || "").toLowerCase();

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    setImage("");
    setFailed(false);

    searchImages(QUERIES[id] || `${body?.name || id} NASA planet`, {
      pageSize: 10,
      signal: controller.signal,
    })
      .then(({ items }) => {
        if (!active) return;

        const result = items.find(
          (item) =>
            item.thumb &&
            /^https:\/\//i.test(item.thumb)
        );

        if (result) {
          setImage(result.thumb);
        } else {
          setFailed(true);
        }
      })
      .catch((error) => {
        if (active && error?.code !== "cancelled") {
          setFailed(true);
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [id, body?.name]);

  const color = COLORS[id] || body?.color || "#64748b";

  return (
    <div
      className={`relative overflow-hidden rounded-full ${className}`}
      role="img"
      aria-label={`${body?.name || "Space object"} image`}
      style={{
        background: `radial-gradient(circle at 30% 25%, ${color}, #101426 85%)`,
        boxShadow: `0 0 28px ${color}30`,
      }}
    >
      {image && !failed ? (
        <img
          src={image}
          alt={`${body?.name || "Space object"} — NASA image`}
          className="h-full w-full rounded-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="h-[70%] w-[70%] rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 25%, ${color}, #080b18 90%)`,
              boxShadow: `inset -12px -8px 18px #0009, 0 0 20px ${color}50`,
            }}
          />
        </div>
      )}

      {failed && (
        <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] text-white/70">
          Illustration
        </span>
      )}
    </div>
  );
}