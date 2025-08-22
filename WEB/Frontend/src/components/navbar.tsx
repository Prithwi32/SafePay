"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Shield, Moon, Sun, Menu, X, Globe, Users } from "lucide-react"
import { useTheme } from "next-themes"
import { useElderMode } from "../contexts/elder-mode"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { isElderMode, toggleElderMode } = useElderMode()
  const location = useLocation()

  const handleLanguageChange = (language: string) => {
    const googleTranslateElement = document.querySelector(".goog-te-combo") as HTMLSelectElement
    if (googleTranslateElement) {
      googleTranslateElement.value = language
      googleTranslateElement.dispatchEvent(new Event("change"))
    }
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/connect-bank", label: "Connect Bank" },
    { href: "/send-money", label: "Send Money" },
    { href: "/review-money", label: "Review Money" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-cyan-600" />
            <span className="text-xl font-bold text-cyan-800 dark:text-cyan-400">SafePay</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-cyan-600 ${
                  location.pathname === item.href ? "text-cyan-600 dark:text-cyan-400" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleLanguageChange("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("hi")}>हिंदी</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("es")}>Español</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("fr")}>Français</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("de")}>Deutsch</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Elder Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <Switch checked={isElderMode} onCheckedChange={toggleElderMode} aria-label="Toggle Elder Mode" />
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="h-9 w-9 p-0"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-9 w-9 p-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-cyan-600 ${
                    location.pathname === item.href ? "text-cyan-600 dark:text-cyan-400" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ display: "none" }}></div>
    </nav>
  )
}
