"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"

export interface Option {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const removeBadge = (value: string) => {
    onChange(selected.filter((s) => s !== value))
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Selected Badges */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((value) => {
            const item = options.find((o) => o.value === value)
            if (!item) return null
            return (
              <Badge
                key={value}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {item.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeBadge(value)}
                />
              </Badge>
            )
          })}
        </div>
      )}

      {/* Select Trigger */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              selected.length === 0 && "text-muted-foreground"
            )}
          >
            {selected.length === 0 ? placeholder : "Edit selection"}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-[300px]" align="start">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No items found.</CommandEmpty>

              <CommandGroup>
                {options.map((opt) => {
                  const isSelected = selected.includes(opt.value)

                  return (
                    <CommandItem
                      key={opt.value}
                      onSelect={() => toggleOption(opt.value)}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50"
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      {opt.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
