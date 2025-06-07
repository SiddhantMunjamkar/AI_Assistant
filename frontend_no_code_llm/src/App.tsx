import { BrowserRouter as Router } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { ThemeProvider } from "./components/theme-provider";
import { Cover } from "./components/ui/cover";
import { ThemeToggle } from "./components/theme-toggle";
import { PlaceholdersAndVanishInputDemo } from "./components/Placeholders-vanishInput";

interface Message {
  id: string;
  text: string;
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConversationStarted, setIsConversationStarted] = useState(false);

  const handleSubmit = (text: string) => {
    if (text.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: text.trim(),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsConversationStarted(true);
    }
  };

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

            {!isConversationStarted ? (
              /* Initial centered content */
              <div className="flex flex-1 items-center justify-center">
                <div className="max-w-4xl px-4 text-center">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
                    Build amazing websites <br /> at <Cover>warp speed</Cover>
                  </h1>
                  <PlaceholdersAndVanishInputDemo onSubmitText={handleSubmit} />
                </div>
              </div>
            ) : (
              /* Chat interface */
              <div className="flex flex-col h-full">
                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-4 pt-16">
                  <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 shadow-sm">
                        <p className="text-gray-900 dark:text-gray-100">{message.text}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Bottom input */}
                <div className="border-t border-gray-200 dark:border-zinc-700 p-4">
                  <div className="max-w-4xl mx-auto">
                    <PlaceholdersAndVanishInputDemo onSubmitText={handleSubmit} />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
