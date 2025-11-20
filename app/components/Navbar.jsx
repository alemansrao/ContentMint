"use client"
import React from "react";
import { usePathname } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link, Tooltip,
  Button,
} from "@heroui/react";

export const ContentmintLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname() || "/";

  const menuItems = [
    { label: "Find", href: "/find", tooltip: 'Find content ideas relavent to current trends' },
    { label: "Generate", href: "/generate", tooltip: 'Generate script on a specific topic' },
    { label: "Optimize", href: "/optimize", tooltip: 'Optimise a existing script' },
    // { label: "Customise", href: "/customise", tooltip: 'Customise the script as you wish' }
  ];

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className="bg-linear-to-br from-slate-900 via-slate-800 to-sky-900 text-slate-100 shadow-md border-b border-slate-700 px-4"
    >
      <NavbarContent className="items-center">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-slate-100"
        />
        <NavbarBrand className="flex items-center gap-3 text-slate-100">
          <Link className="font-bold text-inherit" href="/">CONTENT-MINT</Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4 text-slate-100" justify="center">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <NavbarItem key={item.href} isActive={isActive}>
              <Tooltip content={item.tooltip} showArrow={true} color="primary">
                <Link
                  underline="hover"
                  aria-current={isActive ? "page" : undefined}
                  className={isActive ? "text-white font-medium underline" : "text-slate-200 hover:text-white"}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </Tooltip>
            </NavbarItem>
          );
        })}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            href="/config"
            variant="flat"
            className={
              pathname === "/config" || pathname.startsWith("/config/")
                ? "bg-primary hover:bg-blue-700 text-white px-3 py-1 rounded-3xl "
                : "bg-primary hover:bg-blue-700 text-white px-3 py-1 rounded-3xl"
            }
            aria-current={pathname === "/config" ? "page" : undefined}
          >
            Config
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className="bg-slate-900 border-t border-slate-800">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <Link
                underline="hover"
                className="w-full block px-3 py-2 text-slate-200 hover:bg-slate-800 rounded"
                color={isActive ? "primary" : "foreground"}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          );
        })}
      </NavbarMenu>
    </Navbar>
  );
}

