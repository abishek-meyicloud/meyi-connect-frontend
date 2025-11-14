import { type ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Logo({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/Logo.svg"
      alt="Meyi Connect"
      className={cn(className)}
      {...props}
    />
  )
}

