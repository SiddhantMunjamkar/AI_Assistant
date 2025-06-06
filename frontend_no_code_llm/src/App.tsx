import { BrowserRouter as Router } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { ThemeProvider } from "./components/theme-provider";
import { Cover } from "./components/ui/cover";
import { ThemeToggle } from "./components/theme-toggle";
import { PlaceholdersAndVanishInputDemo } from "./components/Placeholders-vanishInput";

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex h-screen w-full">
          <Sidebar />
          <main className="relative flex-1 bg-[#FFFFFF] dark:bg-[#1E1E1E] flex flex-col">
            {/* Top-right button */}
            <div className="absolute top-4 right-4 z-10">
              <ThemeToggle />
            </div>

            {/* Centered content */}
            <div className="flex flex-1 items-center justify-center">
              <div className="max-w-4xl px-4 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
                  Build amazing websites <br /> at <Cover>warp speed</Cover>
                </h1>
                <PlaceholdersAndVanishInputDemo/>
              </div>
            </div>
          </main>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
