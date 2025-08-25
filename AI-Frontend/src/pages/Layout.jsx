
import React from "react";
import { DebatesProvider } from "../components/DebatesContext";
import Sidebar from "../components/Sidebar";

export default function Layout({ children, currentPageName }) {
  React.useEffect(() => {
    document.title = "AI Debater";
  }, []);

  return (
    <DebatesProvider>
      <style>{`
        :root {
          --background: 224 71.4% 4.1%;
          --foreground: 210 20% 98%;
          --background-alt: 224 71.4% 8%;
          --card: 224 71.4% 11%;
          --card-foreground: 210 20% 98%;
          --popover: 224 71.4% 4.1%;
          --popover-foreground: 210 20% 98%;
          --primary: 142 76% 36%;
          --primary-foreground: 142 76% 96%;
          --secondary: 215 27.9% 16.9%;
          --secondary-foreground: 210 20% 98%;
          --muted: 215 27.9% 16.9%;
          --muted-foreground: 217 9.1% 64.5%;
          --accent: 217 9.1% 64.5%;
          --accent-foreground: 210 20% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 20% 98%;
          --border: 215 27.9% 16.9%;
          --input: 215 27.9% 16.9%;
          --ring: 142 76% 36%;
        }

        .dark {
          --background: 224 71.4% 4.1%;
          --foreground: 210 20% 98%;
          --card: 224 71.4% 11%;
          --card-foreground: 210 20% 98%;
          --primary: 142 76% 36%;
          --primary-foreground: 142 76% 96%;
          --muted: 215 27.9% 16.9%;
          --muted-foreground: 217 9.1% 64.5%;
          --border: 215 27.9% 16.9%;
          --input: 215 27.9% 16.9%;
        }
      `}</style>
      <div className="flex bg-background text-foreground dark">
        <Sidebar />
        <div className="flex-1 overflow-auto h-screen">
          <main>
            {children}
          </main>
        </div>
      </div>
    </DebatesProvider>
  );
}
