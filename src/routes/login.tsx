import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Opening Scribo AI" },
      { name: "description", content: "Opening the Scribo AI app." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/app" });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFF0F5" }}>
      <p className="text-sm text-gray-500">Opening the app…</p>
    </div>
  );
}
