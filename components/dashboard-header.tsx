import Image from "next/image";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.avif"
            alt="Hans Beauty"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <h1 className="text-xl font-semibold text-[#E6A8A8]">Hans Beauty</h1>
        </div>

        <div className="flex flex-1 items-center justify-between gap-4 md:gap-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search orders, products..." className="pl-9" />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#E6A8A8]" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-[#E6A8A8] text-white">
                AD
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
