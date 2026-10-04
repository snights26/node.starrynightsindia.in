import { useEffect, useRef, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import PackageCard from "../Common/PackageCard";
import "./TopTen.css";

export default function TopTen({ row }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const items = Array.isArray(row?.items) ? row.items.slice(0, 10) : [];
  const packageCodes = items.map((item) => item.packageCode || item.code || item.id).filter(Boolean);
  const openAll = () => navigate("/all-packages", {
    state: {
      rowId: row?.rowId,
      title: row?.rowTitle || row?.title,
      type: row?.rowType || row?.type,
      items,
      packageCodes,
    },
  });

  const updateControls = () => {
    const element = scrollRef.current;
    if (!element) return;
    setShowLeft(element.scrollLeft > 8);
    setShowRight(element.scrollLeft + element.clientWidth < element.scrollWidth - 8);
  };

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({ left: direction === "right" ? 360 : -360, behavior: "smooth" });
  };

  useEffect(() => {
    const timer = window.setTimeout(updateControls, 0);
    window.addEventListener("resize", updateControls);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", updateControls);
    };
  }, [items.length]);

  return (
    <section className="topten-container" aria-label={row?.rowTitle || row?.title || "Top 10 travel picks"}>
      <div className="topten-header"><h2 className="topten-title">{row?.rowTitle || row?.title || "Top 10 Destinations in India"}</h2><button type="button" className="topten-view-all" onClick={openAll}>View All <span aria-hidden="true">→</span></button></div>
      {showLeft && <button className="topten-scroll-btn left" type="button" aria-label="Scroll top picks left" onClick={() => scroll("left")}><MdChevronLeft /></button>}
      <div
        className="topten-scroll"
        ref={scrollRef}
        onScroll={updateControls}
      >
        {items.map((item, index) => {
          const packageCode = item.packageCode || item.code || item.id;
          return <div className="topten-card-wrapper" key={packageCode || index}>
            <span className={`topten-index ${index + 1 === 10 ? "double-digit" : ""}`}>{index + 1}</span>
            <PackageCard image={item.image || item.thumbnailUrl} name={item.name || item.title} packageCode={packageCode} />
          </div>;
        })}
      </div>
      {showRight && <button className="topten-scroll-btn right" type="button" aria-label="Scroll top picks right" onClick={() => scroll("right")}><MdChevronRight /></button>}
    </section>
  );
}
