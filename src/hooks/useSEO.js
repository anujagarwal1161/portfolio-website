import { useEffect } from "react";

/**
 * Lightweight document head updates (no react-helmet dependency).
 * @param {{ title: string, description?: string, path?: string, image?: string }} opts
 */
export function useSEO({ title, description, path = "", image }) {
  useEffect(() => {
    document.title = title;
    const desc = description || "";
    let el = document.querySelector('meta[name="description"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", "description");
      document.head.appendChild(el);
    }
    el.setAttribute("content", desc);

    const setOg = (property, content) => {
      if (!content) return;
      let og = document.querySelector(`meta[property="${property}"]`);
      if (!og) {
        og = document.createElement("meta");
        og.setAttribute("property", property);
        document.head.appendChild(og);
      }
      og.setAttribute("content", content);
    };

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    setOg("og:title", title);
    setOg("og:description", desc);
    if (image) setOg("og:image", image.startsWith("http") ? image : `${origin}${image}`);
    if (path) setOg("og:url", `${origin}${path}`);
  }, [title, description, path, image]);
}
