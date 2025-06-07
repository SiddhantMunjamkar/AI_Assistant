import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  SquarePen,
  ChevronDown,
  History
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "pb-12 min-h-screen",
          "bg-[#FAFAFA] dark:bg-[#161616]",
          "border-r border-[hsl(var(--border))]",
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="space-y-4 py-4">
          <div className="px-3 py-2 flex justify-between items-center">
            <h2
              className={cn(
                "text-lg font-semibold tracking-tight transition-all duration-300 ease-in-out",
                isCollapsed ? "opacity-0 hidden" : "opacity-100"
              )}
            >
              No Code LLM
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleSidebar}
            >
              {isCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </Button>
          </div>
          <div className="px-3">
            <div className="space-y-1">
              <h2
                className={cn(
                  "mb-2 px-4 text-sm font-semibold tracking-tight transition-all duration-300 ease-in-out",
                  isCollapsed ? "opacity-0" : "opacity-100"
                )}
              >
                Platform
              </h2>
              <nav className="space-y-1">
                <NavLink
                  to="/"
                  className={({ isActive }: { isActive: boolean }) =>
                    cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted/10 hover:text-foreground",
                      isCollapsed ? "justify-center" : "justify-start"
                    )
                  }
                >
                  <SquarePen className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-2">New chat</span>}
                </NavLink>

                <NavLink
                  to="/users"
                  className={({ isActive }: { isActive: boolean }) =>
                    cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out",
                      isActive ? "bg-accent" : "transparent",
                      isCollapsed ? "justify-center" : "justify-start"
                    )
                  }
                >
                  {/* <Users className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-2 transition-all duration-300 ease-in-out">Users</span>}
                </NavLink>
                <NavLink
                  to="/settings"
                  className={({ isActive }: { isActive: boolean }) =>
                    cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out",
                      isActive ? "bg-accent" : "transparent",
                      isCollapsed ? "justify-center" : "justify-start"
                    )
                  }
                > */}
                  <Settings className="h-4 w-4" />
                  {!isCollapsed && (
                    <span className="ml-2 transition-all duration-300 ease-in-out">
                      Settings
                    </span>
                  )}
                </NavLink>
              </nav>
            </div>
          </div>
          <div className="px-3">
            <Collapsible
              open={isProjectsOpen}
              onOpenChange={setIsProjectsOpen}
              className="space-y-2"
            >
              <div className="flex items-center justify-between py-2">
                <div className={cn(
                  "flex items-center",
                  isCollapsed ? "w-full justify-center" : "justify-start"
                )}>
                  <History className="h-5 w-5 text-muted-foreground" />
                  {!isCollapsed && <span className="ml-2">Chat History</span>}
                </div>
                {!isCollapsed && (
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-300 ease-in-out",
                          isProjectsOpen ? "transform rotate-180" : ""
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                )}
              </div>
              <CollapsibleContent className="space-y-1">
                <ScrollArea
                  className={cn(
                    "px-1",
                    isCollapsed ? "h-[120px]" : "h-[300px]"
                  )}
                >
                  <div className="space-y-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <Button
                        key={`project-${i}`}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start font-normal",
                          isCollapsed ? "px-2" : "px-4"
                        )}
                      >
                        <span
                          className={cn(
                            "truncate",
                            isCollapsed ? "w-6 text-center" : "w-full"
                          )}
                        >
                          {isCollapsed ? `P${i + 1}` : `History ${i + 1}`}
                        </span>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
        <div
          className={cn(
            "absolute bottom-4 left-0 right-0 px-3",
            "flex items-center justify-between"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2",
              isCollapsed ? "flex-col" : "flex-row"
            )}
          >
            <div className="w-8 h-8 rounded-full bg-primary" />
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">Siddhant</span>
                <span className="text-xs text-muted-foreground">Admin</span>
              </div>
            )}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
