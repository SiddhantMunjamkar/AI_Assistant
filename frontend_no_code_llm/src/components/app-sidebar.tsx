import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { ChevronRight, LayoutDashboard, Settings, FileText, Boxes, Users, PenTool, BarChart } from "lucide-react"

const platformLinks = [
  {
    title: "Playground",
    icon: <LayoutDashboard className="h-4 w-4" />,
    hasSubmenu: true,
  },
  {
    title: "Models",
    icon: <Boxes className="h-4 w-4" />,
    hasSubmenu: true,
  },
  {
    title: "Documentation",
    icon: <FileText className="h-4 w-4" />,
    hasSubmenu: true,
  },
  {
    title: "Settings",
    icon: <Settings className="h-4 w-4" />,
    hasSubmenu: true,
  },
]

const projectLinks = [
  {
    title: "Design Engineering",
    icon: <PenTool className="h-4 w-4" />,
  },
  {
    title: "Sales & Marketing",
    icon: <BarChart className="h-4 w-4" />,
  },
]

export function AppSidebar() {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar className="border-r border-border bg-card transition-colors duration-300">
        <SidebarHeader className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-blue-600"></div>
            <div>
              <div className="font-semibold text-foreground">Acme Inc</div>
              <div className="text-xs text-muted-foreground">Enterprise</div>
            </div>
          </div>
      </SidebarHeader>
      <SidebarContent>
          <div className="px-2 py-2">
            <SidebarGroupLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Platform
            </SidebarGroupLabel>
            <SidebarMenu>
              {platformLinks.map((link) => (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton className="w-full justify-between transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      {link.icon}
                      <span className="text-sm">{link.title}</span>
                    </div>
                    {link.hasSubmenu && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
          <div className="px-2 py-2">
            <SidebarGroupLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Projects
            </SidebarGroupLabel>
            <SidebarMenu>
              {projectLinks.map((link) => (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton className="w-full transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      {link.icon}
                      <span className="text-sm">{link.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
      </SidebarContent>
        <SidebarFooter className="px-2 py-2">
          <SidebarMenuButton className="w-full justify-between transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 overflow-hidden rounded-full bg-purple-500">
                <img 
                  src="https://api.dicebear.com/7.x/avatars/svg?seed=shadcn" 
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm text-foreground">shadcn</div>
                <div className="text-xs text-muted-foreground">m@example.com</div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
    </SidebarProvider>
  )
}
