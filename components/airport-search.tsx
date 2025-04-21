"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useDebounce } from "@/hooks/use-debounce"
import { useToast } from "@/components/ui/use-toast"

interface AirportSearchProps {
  placeholder: string
  onSelect: (value: string) => void
  value: string
}

interface Airport {
  code: string
  name: string
  city: string
  country: string
}

export default function AirportSearch({ placeholder, onSelect, value }: AirportSearchProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [airports, setAirports] = useState<Airport[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedSearch = useDebounce(inputValue, 300)
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setAirports([])
      return
    }

    const fetchAirports = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search-airports?query=${debouncedSearch}`)
        if (!response.ok) throw new Error("Failed to fetch airports")
        const data = await response.json()
        setAirports(data)
      } catch (error) {
        console.error("Error fetching airports:", error)
        setAirports([])
      } finally {
        setLoading(false)
      }
    }

    fetchAirports()
  }, [debouncedSearch])

  // If value is set externally, try to find the airport details
  useEffect(() => {
    if (value && !selectedAirport) {
      const fetchAirportDetails = async () => {
        try {
          const response = await fetch(`/api/airport-details?code=${value}`)
          if (response.ok) {
            const data = await response.json()
            if (data) {
              setSelectedAirport(data)
            }
          }
        } catch (error) {
          console.error("Error fetching airport details:", error)
        }
      }

      fetchAirportDetails()
    }
  }, [value, selectedAirport])

  const handleSelect = async (airport: Airport) => {
    // const confirmed = window.confirm(`Are you sure you want to select ${airport.city} (${airport.code})?`)
    const confirmed = true
    if (confirmed) {
      setSelectedAirport(airport)
      onSelect(airport.code)
      setOpen(false)
      
      toast({
        title: "Airport Selected",
        description: `Successfully selected ${airport.city} (${airport.code})`,
        duration: 3000,
      })
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedAirport ? (
            <span>
              {selectedAirport.city} ({selectedAirport.code}) - {selectedAirport.name}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            value={inputValue}
            onValueChange={setInputValue}
          />
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          {!loading && (
            <>
              <CommandList>
                <CommandEmpty>No airports found.</CommandEmpty>
                <CommandGroup>
                  {airports.map((airport) => (
                    <CommandItem
                      key={airport.code}
                      value={airport.code}
                      onSelect={() => handleSelect(airport)}
                    >
                      <Check className={cn("mr-2 h-4 w-4", value === airport.code ? "opacity-100" : "opacity-0")} />
                      {airport.city} ({airport.code}) - {airport.name}, {airport.country}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
