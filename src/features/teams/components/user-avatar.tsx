// components/user-avatar.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  name: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function UserAvatar({ name, className, size = "md" }: UserAvatarProps) {
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const getBackgroundColor = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
      "bg-teal-500",
      "bg-cyan-500",
    ]
    
    const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
  }

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarFallback className={cn(getBackgroundColor(name), "text-white font-medium")}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
