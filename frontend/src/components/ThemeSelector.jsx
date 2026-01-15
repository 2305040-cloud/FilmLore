import { useEffect, useState } from "react";
import { Palette, Pencil } from "lucide-react";
import { THEMES } from "../constants";

export default function ThemeSelector() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "forest");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const selected = THEMES.find((t) => t.name === theme);

  return (
    <div className="dropdown dropdown-end">
      {/* button (the small icon you click) */}
      <button className="btn btn-ghost btn-circle" type="button">
        <Palette className="size-5" />
      </button>

      {/* dropdown menu */}
      <ul className="dropdown-content menu mt-3 w-64 rounded-box bg-base-100 p-2 shadow">
        {THEMES.map((t) => {
          const active = t.name === theme;

          return (
            <li key={t.name}>
              <button
                type="button"
                onClick={() => setTheme(t.name)}
                className={`flex items-center justify-between ${
                  active ? "bg-base-200" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Palette className={`size-4 ${active ? "text-primary" : ""}`} />
                  <span className="font-medium">{t.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {t.colors.map((c) => (
                      <span
                        key={c}
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>

                  {active && <Pencil className="size-4 opacity-70" />}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
