"use client";

import Link from "next/link";

export default function MobileNav({ slug, sections }: { slug: string; sections: string[] }) {
  return (
    <>
      <button
        className="hamburger"
        onClick={() => {
          const nav = document.getElementById('mobile-nav');
          if (nav) nav.classList.toggle('open');
        }}
        style={{ background: "none", border: "none", fontSize: 28, cursor: "pointer", display: "none" }}
      >
        ☰
      </button>
      <div id="mobile-nav" className="mobile-nav" style={{ display: "none", backgroundColor: "#fff", padding: "0 10px 12px" }}>
        {sections.map((s: string) => (
          <Link
            key={s}
            href={`/blog/${slug}?section=${encodeURIComponent(s)}`}
            style={{ padding: "10px 14px", fontSize: 14, fontWeight: 700, color: "#000", textDecoration: "none", display: "block" }}
          >
            {s}
          </Link>
        ))}
      </div>
    </>
  );
}