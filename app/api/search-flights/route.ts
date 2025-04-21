import { NextResponse } from "next/server"

// Mock flight data generator
function generateMockFlights(origin: string, destination: string, date: string, returnDate?: string) {
  const airlines = [
    { name: "Delta Air Lines", logo: "/placeholder.svg?height=40&width=40" },
    { name: "United Airlines", logo: "/placeholder.svg?height=40&width=40" },
    { name: "American Airlines", logo: "/placeholder.svg?height=40&width=40" },
    { name: "British Airways", logo: "/placeholder.svg?height=40&width=40" },
    { name: "Lufthansa", logo: "/placeholder.svg?height=40&width=40" },
    { name: "Emirates", logo: "/placeholder.svg?height=40&width=40" },
    { name: "Qatar Airways", logo: "/placeholder.svg?height=40&width=40" },
    { name: "Singapore Airlines", logo: "/placeholder.svg?height=40&width=40" },
  ]

  // Generate outbound flights
  const outboundFlights = Array.from({ length: 10 }, (_, i) => {
    const airline = airlines[Math.floor(Math.random() * airlines.length)]
    const stops = Math.random() > 0.6 ? 0 : Math.random() > 0.7 ? 2 : 1
    const basePrice = 200 + Math.floor(Math.random() * 800)
    const price = stops === 0 ? basePrice + 100 : basePrice - stops * 50

    // Generate random departure time between 6 AM and 10 PM
    const departureHour = 6 + Math.floor(Math.random() * 16)
    const departureMinute = Math.floor(Math.random() * 60)
    const departureTime = `${departureHour.toString().padStart(2, "0")}:${departureMinute.toString().padStart(2, "0")}`

    // Calculate arrival time based on duration
    const durationHours = 2 + Math.floor(Math.random() * 10)
    const durationMinutes = Math.floor(Math.random() * 60)

    let arrivalHour = departureHour + durationHours
    let arrivalMinute = departureMinute + durationMinutes

    if (arrivalMinute >= 60) {
      arrivalHour += 1
      arrivalMinute -= 60
    }

    if (arrivalHour >= 24) {
      arrivalHour -= 24
    }

    const arrivalTime = `${arrivalHour.toString().padStart(2, "0")}:${arrivalMinute.toString().padStart(2, "0")}`

    const stopDetails =
      stops > 0
        ? Array.from({ length: stops }, (_, j) => {
            const airports = ["ATL", "ORD", "DFW", "DEN", "FRA", "AMS", "CDG", "DXB"]
            const stopAirport = airports[Math.floor(Math.random() * airports.length)]
            const stopDuration = `${1 + Math.floor(Math.random() * 3)}h ${Math.floor(Math.random() * 60)}m`
            return { airport: stopAirport, duration: stopDuration }
          })
        : undefined

    return {
      id: `${airline.name.substring(0, 2).toUpperCase()}${1000 + i}`,
      airline,
      departure: {
        airport: origin,
        terminal: String.fromCharCode(65 + Math.floor(Math.random() * 8)),
        time: departureTime,
      },
      arrival: {
        airport: destination,
        terminal: String.fromCharCode(65 + Math.floor(Math.random() * 8)),
        time: arrivalTime,
      },
      duration: `${durationHours}h ${durationMinutes}m`,
      stops,
      stopDetails,
      price,
      currency: "USD",
    }
  })

  // Generate return flights if returnDate is provided
  let inboundFlights
  if (returnDate) {
    inboundFlights = Array.from({ length: 8 }, (_, i) => {
      const airline = airlines[Math.floor(Math.random() * airlines.length)]
      const stops = Math.random() > 0.6 ? 0 : Math.random() > 0.7 ? 2 : 1
      const basePrice = 200 + Math.floor(Math.random() * 800)
      const price = stops === 0 ? basePrice + 100 : basePrice - stops * 50

      // Generate random departure time between 6 AM and 10 PM
      const departureHour = 6 + Math.floor(Math.random() * 16)
      const departureMinute = Math.floor(Math.random() * 60)
      const departureTime = `${departureHour.toString().padStart(2, "0")}:${departureMinute.toString().padStart(2, "0")}`

      // Calculate arrival time based on duration
      const durationHours = 2 + Math.floor(Math.random() * 10)
      const durationMinutes = Math.floor(Math.random() * 60)

      let arrivalHour = departureHour + durationHours
      let arrivalMinute = departureMinute + durationMinutes

      if (arrivalMinute >= 60) {
        arrivalHour += 1
        arrivalMinute -= 60
      }

      if (arrivalHour >= 24) {
        arrivalHour -= 24
      }

      const arrivalTime = `${arrivalHour.toString().padStart(2, "0")}:${arrivalMinute.toString().padStart(2, "0")}`

      const stopDetails =
        stops > 0
          ? Array.from({ length: stops }, (_, j) => {
              const airports = ["ATL", "ORD", "DFW", "DEN", "FRA", "AMS", "CDG", "DXB"]
              const stopAirport = airports[Math.floor(Math.random() * airports.length)]
              const stopDuration = `${1 + Math.floor(Math.random() * 3)}h ${Math.floor(Math.random() * 60)}m`
              return { airport: stopAirport, duration: stopDuration }
            })
          : undefined

      return {
        id: `${airline.name.substring(0, 2).toUpperCase()}${2000 + i}`,
        airline,
        departure: {
          airport: destination,
          terminal: String.fromCharCode(65 + Math.floor(Math.random() * 8)),
          time: departureTime,
        },
        arrival: {
          airport: origin,
          terminal: String.fromCharCode(65 + Math.floor(Math.random() * 8)),
          time: arrivalTime,
        },
        duration: `${durationHours}h ${durationMinutes}m`,
        stops,
        stopDetails,
        price,
        currency: "USD",
      }
    })
  }

  return {
    outbound: outboundFlights,
    inbound: inboundFlights,
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { origin, destination, departDate, returnDate, adults, children, cabinClass, tripType } = body

    // In a real implementation, you would call the Sky Scrapper API here
    // For now, we'll generate mock data
    const flights = generateMockFlights(
      origin,
      destination,
      departDate,
      tripType === "roundTrip" ? returnDate : undefined,
    )

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json(flights)
  } catch (error) {
    console.error("Error in search-flights API:", error)
    return NextResponse.json({ error: "Failed to search flights" }, { status: 500 })
  }
}
