"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CurrencyService } from "@/lib/currency-service"
import type { Currency } from "@/lib/types"

interface CurrencySelectorProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function CurrencySelector({
  value,
  onValueChange,
  placeholder = "اختر العملة...",
  className,
}: CurrencySelectorProps) {
  const [open, setOpen] = useState(false)
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCurrencies()
  }, [])

  const loadCurrencies = async () => {
    try {
      const currencyService = CurrencyService.getInstance()
      const data = await currencyService.getCurrencies()
      setCurrencies(data)
    } catch (error) {
      console.error("Failed to load currencies:", error)
    } finally {
      setLoading(false)
    }
  }

  const selectedCurrency = currencies.find((currency) => currency.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between bg-gray-800 border-gray-700 text-white", className)}
        >
          {selectedCurrency ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gold-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                {selectedCurrency.symbol}
              </div>
              <span>
                {selectedCurrency.name} ({selectedCurrency.code})
              </span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-gray-900 border-gray-700">
        <Command className="bg-gray-900">
          <CommandInput placeholder="البحث عن العملة..." className="text-white" />
          <CommandList>
            <CommandEmpty className="text-gray-400">لم يتم العثور على عملة.</CommandEmpty>
            <CommandGroup>
              {currencies.map((currency) => (
                <CommandItem
                  key={currency.id}
                  value={currency.code}
                  onSelect={() => {
                    onValueChange(currency.id)
                    setOpen(false)
                  }}
                  className="text-white hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-6 h-6 bg-gold-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {currency.symbol}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{currency.name}</div>
                      <div className="text-sm text-gray-400">{currency.code}</div>
                    </div>
                    <div className="text-sm text-gray-400">{currency.exchangeRate.toFixed(6)}</div>
                  </div>
                  <Check className={cn("ml-2 h-4 w-4", value === currency.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
