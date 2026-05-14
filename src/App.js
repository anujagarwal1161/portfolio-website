import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AnalyticsInit } from "./AnalyticsInit";
import "./index.css";

const Portfolio = lazy(() => import("./portfolio"));
const UsesPage = lazy(() => import("./pages/UsesPage"));
const BlogIndexPage = lazy(() => import("./pages/BlogIndexPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const ProjectCasePage = lazy(() => import("./pages/ProjectCasePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const suspenseFallback = (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#020814",
      color: "#5eead4",
      fontFamily: "monospace",
    }}
  >
    Loading…
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AnalyticsInit />
      <BrowserRouter>
        <Suspense fallback={suspenseFallback}>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/uses" element={<UsesPage />} />
            <Route path="/blog" element={<BlogIndexPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/projects/:slug" element={<ProjectCasePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
