"use client"

import { useState } from "react"
import { ArrowRight, Plane } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface Flight {
  id: string
  airline: {
    name: string
    logo: string
  }
  departure: {
    airport: string
    terminal: string
    time: string
  }
  arrival: {
    airport: string
    terminal: string
    time: string
  }
  duration: string
  stops: number
  stopDetails?: {
    airport: string
    duration: string
  }[]
  price: number
  currency: string
}

interface FlightResultsProps {
  results: {
    outbound: Flight[]
    inbound?: Flight[]
  }
}

export default function FlightResults({ results }: FlightResultsProps) {
  const [sortBy, setSortBy] = useState("price")
  const [filterStops, setFilterStops] = useState("all")

  const sortFlights = (flights: Flight[]) => {
    return [...flights].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "duration") return a.duration.localeCompare(b.duration)
      if (sortBy === "departure") return a.departure.time.localeCompare(b.departure.time)
      return 0
    })
  }

  const filterFlights = (flights: Flight[]) => {
    if (filterStops === "all") return flights
    if (filterStops === "nonstop") return flights.filter((f) => f.stops === 0)
    if (filterStops === "1stop") return flights.filter((f) => f.stops === 1)
    return flights
  }

  const processedOutbound = filterFlights(sortFlights(results.outbound))
  const processedInbound = results.inbound ? filterFlights(sortFlights(results.inbound)) : undefined

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold">Flight Results</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price (Lowest first)</SelectItem>
                <SelectItem value="duration">Duration (Shortest first)</SelectItem>
                <SelectItem value="departure">Departure (Earliest first)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Stops:</span>
            <Select value={filterStops} onValueChange={setFilterStops}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by stops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All flights</SelectItem>
                <SelectItem value="nonstop">Non-stop only</SelectItem>
                <SelectItem value="1stop">1 stop max</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {results.inbound ? (
        <Tabs defaultValue="outbound">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="outbound">Outbound</TabsTrigger>
            <TabsTrigger value="inbound">Return</TabsTrigger>
          </TabsList>
          <TabsContent value="outbound" className="space-y-4 mt-4">
            {processedOutbound.length > 0 ? (
              processedOutbound.map((flight) => <FlightCard key={flight.id} flight={flight} />)
            ) : (
              <p className="text-center py-8">No flights match your filters.</p>
            )}
          </TabsContent>
          <TabsContent value="inbound" className="space-y-4 mt-4">
            {processedInbound && processedInbound.length > 0 ? (
              processedInbound.map((flight) => <FlightCard key={flight.id} flight={flight} />)
            ) : (
              <p className="text-center py-8">No flights match your filters.</p>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          {processedOutbound.length > 0 ? (
            processedOutbound.map((flight) => <FlightCard key={flight.id} flight={flight} />)
          ) : (
            <p className="text-center py-8">No flights match your filters.</p>
          )}
        </div>
      )}
    </div>
  )
}

function FlightCard({ flight }: { flight: Flight }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {flight.airline.logo ? (
                <img
                  src={flight.airline.logo || "/placeholder.svg"}
                  alt={flight.airline.name}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <Plane className="w-6 h-6 text-gray-500" />
              )}
            </div>
            <div>
              <p className="font-medium">{flight.airline.name}</p>
              <p className="text-sm text-gray-500">Flight #{flight.id}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="text-center">
              <p className="text-xl font-bold">{flight.departure.time}</p>
              <p className="font-medium">{flight.departure.airport}</p>
              <p className="text-sm text-gray-500">Terminal {flight.departure.terminal}</p>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2">{flight.duration}</p>
              <div className="relative w-24 md:w-32 h-[2px] bg-gray-300">
                <div className="absolute top-1/2 left-0 w-2 h-2 -mt-1 rounded-full bg-gray-500"></div>
                {flight.stops > 0 && (
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 -mt-1 -ml-1 rounded-full bg-gray-500"></div>
                )}
                <div className="absolute top-1/2 right-0 w-2 h-2 -mt-1 rounded-full bg-gray-500"></div>
                <ArrowRight className="absolute -right-4 top-1/2 -mt-2 w-4 h-4 text-gray-500" />
              </div>
              <div className="mt-2">
                {flight.stops === 0 ? (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Non-stop
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-amber-600 border-amber-600">
                    {flight.stops} {flight.stops === 1 ? "stop" : "stops"}
                  </Badge>
                )}
              </div>
              {flight.stopDetails && flight.stopDetails.length > 0 && (
                <div className="mt-1 text-xs text-gray-500">
                  {flight.stopDetails.map((stop, i) => (
                    <div key={i}>
                      {stop.airport} ({stop.duration})
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-xl font-bold">{flight.arrival.time}</p>
              <p className="font-medium">{flight.arrival.airport}</p>
              <p className="text-sm text-gray-500">Terminal {flight.arrival.terminal}</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-primary">
              {flight.currency} {flight.price.toLocaleString()}
            </p>
            <Button className="mt-2 w-full">Select</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
