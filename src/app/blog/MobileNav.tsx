"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileNav({ slug, sections }: { slug: string; sections: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          fontSize: 28,
          cursor: "pointer",
          color: "#002b50",
          padding: "4px 8px",
        }}
      >
        ☰
      </button>

      {open && (
        <>
          {/* Overlay escuro */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 99,
            }}
          />

          {/* Menu lateral */}
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: 280,
              height: "100%",
              backgroundColor: "#fff",
              zIndex: 100,
              padding: "24px 16px",
              overflowY: "auto",
              boxShadow: "-4px 0 12px rgba(0,0,0,0.15)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#002b50" }}>Menu</span>
              <button
                onClick={() => setOpen(false)}
                style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#666" }}
              >
                ✕
              </button>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {sections.map((s: string) => (
                <Link
                  key={s}
                  href={`/blog/${slug}?section=${encodeURIComponent(s)}`}
                  onClick={() => setOpen(false)}
                  style={{
                    padding: "12px 16px",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#002b50",
                    textDecoration: "none",
                    borderRadius: 8,
                    display: "block",
                  }}
                >
                  {s}
                </Link>
              ))}
              <Link
                href={`/blog/${slug}`}
                onClick={() => setOpen(false)}
                style={{
                  padding: "12px 16px",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#666",
                  textDecoration: "none",
                  borderRadius: 8,
                  display: "block",
                  marginTop: 8,
                  borderTop: "1px solid #eee",
                }}
              >
                Ver todos os posts
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
}