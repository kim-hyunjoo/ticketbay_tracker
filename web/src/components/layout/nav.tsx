"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Search, Bell, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/listings", label: "매물 조회", icon: Search },
  { href: "/alerts", label: "알림 설정", icon: Bell },
  { href: "/concerts", label: "공연 관리", icon: Settings },
]

export function NavDesktop() {
  const pathname = usePathname()
  return (
    <header className="hidden md:flex items-center justify-between h-14 px-8 bg-[#263040] shrink-0">
      <span className="text-[17px] font-bold text-white tracking-tight">
        TicketBay Tracker
      </span>
      <nav className="flex items-center gap-4">
        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              pathname === href
                ? "bg-white/20 text-white font-semibold"
                : "text-white/60 hover:text-white"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

export function NavMobile() {
  const pathname = usePathname()
  return (
    <>
      {/* 상단 로고 바 */}
      <header className="md:hidden flex items-center justify-center h-14 px-4 bg-[#263040] shrink-0">
        <span className="text-base font-bold text-white">TicketBay Tracker</span>
      </header>
      {/* 하단 탭바 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 flex h-[60px] border-t border-border bg-white z-50">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5"
          >
            <Icon
              className={cn(
                "w-5 h-5",
                pathname === href ? "text-[#263040]" : "text-[#9faec6]"
              )}
            />
            <span
              className={cn(
                "text-[10px]",
                pathname === href
                  ? "text-[#263040] font-semibold"
                  : "text-[#9faec6] font-normal"
              )}
            >
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </>
  )
}
