"use client";

import { useState } from "react";
import BrandFormPanel from "@/components/panels/BrandFormPanel";
import TokenPanel from "@/components/panels/TokenPanel";
import DeployPanel from "@/components/panels/DeployPanel";
import PreviewPanel from "@/components/panels/PreviewPanel";

type Tab = "form" | "tokens" | "preview" | "deploy" | "status";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "form",    label: "Brand",    icon: "✦" },
  { id: "tokens",  label: "Tokens",   icon: "⬡" },
  { id: "preview", label: "Preview",  icon: "◈" },
  { id: "deploy",  label: "Deploy",   icon: "🚀" },
  { id: "status",  label: "Status",   icon: "◉" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("form");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--admin-bg)", color: "var(--admin-text)" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col shrink-0 transition-all duration-300"
        style={{
          width: sidebarOpen ? "220px" : "60px",
          background: "var(--admin-surface)",
          borderRight: "1px solid var(--admin-border)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "var(--admin-border)" }}>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="text-sm font-black"
            style={{ color: "var(--admin-primary)" }}
          >
            FG
          </button>
          {sidebarOpen && (
            <span className="text-sm font-semibold truncate">Admin Console</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-2 flex-grow">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all"
              style={{
                background: activeTab === tab.id ? "rgba(220,38,38,0.15)" : "transparent",
                color: activeTab === tab.id ? "var(--admin-primary)" : "var(--admin-muted)",
                border: `1px solid ${activeTab === tab.id ? "rgba(220,38,38,0.3)" : "transparent"}`,
              }}
            >
              <span className="text-base shrink-0">{tab.icon}</span>
              {sidebarOpen && <span className="truncate">{tab.label}</span>}
            </button>
          ))}
        </nav>

        {/* Status indicator */}
        {sidebarOpen && (
          <div className="p-4 border-t text-xs" style={{ borderColor: "var(--admin-border)", color: "var(--admin-faint)" }}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
              System Online
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-grow flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)" }}>
          <div>
            <h1 className="text-lg font-bold">
              {TABS.find((t) => t.id === activeTab)?.label}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--admin-muted)" }}>
              {activeTab === "form"    && "Define brand identity and copy"}
              {activeTab === "tokens" && "Customize design tokens and CSS variables"}
              {activeTab === "preview"&& "Live component preview across breakpoints"}
              {activeTab === "deploy" && "Build and deploy to any target"}
              {activeTab === "status" && "System health across all domains"}
            </p>
          </div>
          <a
            href="/status"
            className="text-xs px-3 py-1.5 rounded-md font-medium"
            style={{ background: "var(--admin-surface2)", border: "1px solid var(--admin-border)", color: "var(--admin-muted)" }}
          >
            ◉ /status
          </a>
        </div>

        {/* Panel content */}
        <div className="flex-grow overflow-hidden">
          {activeTab === "form"    && <BrandFormPanel />}
          {activeTab === "tokens"  && <TokenPanel />}
          {activeTab === "preview" && <PreviewPanel />}
          {activeTab === "deploy"  && <DeployPanel />}
          {activeTab === "status"  && (
            <div className="p-6 text-center" style={{ color: "var(--admin-muted)" }}>
              <p>Status dashboard — see <code>/apps/web/src/app/status/page.tsx</code></p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
