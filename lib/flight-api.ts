/**
 * Flight Data API Integration
 * 
 * This module handles fetching real-time flight data from external APIs.
 * Currently supports AviationStack (free tier: 500 requests/month)
 * 
 * To enable real-time tracking:
 * 1. Sign up at https://aviationstack.com/
 * 2. Get your API key
 * 3. Add AVIATIONSTACK_API_KEY to your environment variables
 */

export interface FlightStatus {
  flightNumber: string;
  airline: string;
  airlineName: string;
  
  // Departure info
  departureAirport: string;
  departureCity: string;
  scheduledDeparture: string; // ISO string
  actualDeparture: string | null;
  departureGate: string | null;
  departureTerminal: string | null;
  
  // Arrival info
  arrivalAirport: string;
  arrivalCity: string;
  scheduledArrival: string;
  actualArrival: string | null;
  arrivalGate: string | null;
  arrivalTerminal: string | null;
  
  // Status
  status: 'scheduled' | 'active' | 'landed' | 'cancelled' | 'diverted' | 'unknown';
  delayMinutes: number;
  
  // Raw data for debugging
  raw?: any;
}

export interface FlightLookupResult {
  success: boolean;
  data?: FlightStatus;
  error?: string;
  source: 'aviationstack' | 'manual' | 'mock';
}

const AVIATIONSTACK_API_KEY = process.env.AVIATIONSTACK_API_KEY;
const AVIATIONSTACK_BASE_URL = 'http://api.aviationstack.com/v1';

/**
 * Fetch flight status from AviationStack API
 */
async function fetchFromAviationStack(
  airlineCode: string,
  flightNumber: string,
  flightDate: string
): Promise<FlightLookupResult> {
  if (!AVIATIONSTACK_API_KEY) {
    return {
      success: false,
      error: 'AviationStack API key not configured',
      source: 'aviationstack',
    };
  }

  try {
    // AviationStack uses IATA flight number format (e.g., "WN4207")
    const fullFlightNumber = `${airlineCode}${flightNumber}`;
    
    const url = new URL(`${AVIATIONSTACK_BASE_URL}/flights`);
    url.searchParams.append('access_key', AVIATIONSTACK_API_KEY);
    url.searchParams.append('flight_iata', fullFlightNumber);
    // Note: Free tier doesn't support date filtering, we filter manually
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      return {
        success: false,
        error: `API returned ${response.status}`,
        source: 'aviationstack',
      };
    }

    const result = await response.json();
    
    if (result.error) {
      return {
        success: false,
        error: result.error.message || 'API error',
        source: 'aviationstack',
      };
    }

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        error: 'Flight not found',
        source: 'aviationstack',
      };
    }

    // Find the flight matching our date (if multiple results)
    const targetDate = new Date(flightDate).toISOString().split('T')[0];
    const matchingFlight = result.data.find((f: any) => {
      const flightDateStr = f.flight_date || f.departure?.scheduled?.split('T')[0];
      return flightDateStr === targetDate;
    });

    // If no flight matches our target date, don't use wrong flight data
    // AviationStack free tier only returns current flights, not historical
    if (!matchingFlight) {
      console.log(`No flight found for date ${targetDate}, API returned flights for other dates`);
      return {
        success: false,
        error: `Flight not found for date ${targetDate}. Historical flight data not available.`,
        source: 'aviationstack',
      };
    }

    const flight = matchingFlight;
    
    // Calculate delay
    let delayMinutes = 0;
    if (flight.departure?.delay) {
      delayMinutes = flight.departure.delay;
    } else if (flight.arrival?.delay) {
      delayMinutes = flight.arrival.delay;
    }

    // Map status
    let status: FlightStatus['status'] = 'unknown';
    const rawStatus = flight.flight_status?.toLowerCase();
    if (rawStatus === 'scheduled') status = 'scheduled';
    else if (rawStatus === 'active' || rawStatus === 'en-route') status = 'active';
    else if (rawStatus === 'landed') status = 'landed';
    else if (rawStatus === 'cancelled') status = 'cancelled';
    else if (rawStatus === 'diverted') status = 'diverted';

    const flightStatus: FlightStatus = {
      flightNumber: fullFlightNumber,
      airline: airlineCode,
      airlineName: flight.airline?.name || airlineCode,
      
      departureAirport: flight.departure?.iata || '',
      departureCity: flight.departure?.airport || '',
      scheduledDeparture: flight.departure?.scheduled || '',
      actualDeparture: flight.departure?.actual || null,
      departureGate: flight.departure?.gate || null,
      departureTerminal: flight.departure?.terminal || null,
      
      arrivalAirport: flight.arrival?.iata || '',
      arrivalCity: flight.arrival?.airport || '',
      scheduledArrival: flight.arrival?.scheduled || '',
      actualArrival: flight.arrival?.actual || null,
      arrivalGate: flight.arrival?.gate || null,
      arrivalTerminal: flight.arrival?.terminal || null,
      
      status,
      delayMinutes,
      
      raw: flight,
    };

    return {
      success: true,
      data: flightStatus,
      source: 'aviationstack',
    };
  } catch (error) {
    console.error('AviationStack API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'aviationstack',
    };
  }
}

/**
 * Main function to look up flight status
 * Falls back to manual entry if API is not available
 */
export async function lookupFlightStatus(
  airlineCode: string,
  flightNumber: string,
  flightDate: string
): Promise<FlightLookupResult> {
  // Try AviationStack first
  const result = await fetchFromAviationStack(airlineCode, flightNumber, flightDate);
  
  if (result.success) {
    return result;
  }

  // If API fails, return manual entry indicator
  return {
    success: false,
    error: result.error || 'Could not fetch live flight data. Using manual entry.',
    source: 'manual',
  };
}

/**
 * Check if flight API is configured
 */
export function isFlightApiConfigured(): boolean {
  return !!AVIATIONSTACK_API_KEY;
}

