// /* eslint-disable @typescript-eslint/ban-ts-comment */
// // @ts-nocheck

// import { Page } from "puppeteer";

// interface Flight {
//   airlineLogo: string;
//   departureTime: string;
//   arrivalTime: string;
//   flightDuration: string;
//   airlineName: string;
//   price: number;
// }

// export const startFlightScraping = async (page: Page): Promise<Flight[]> => {
//   return await page.evaluate(async (): Promise<Flight[]> => {
//     await new Promise((resolve) => setTimeout(resolve, 5000));

//     const flights: Flight[] = [];

//     const flightSelectors = document.querySelectorAll(".nrc6-wrapper");

//     flightSelectors.forEach((flightElement) => {
//       const airlineLogo = flightElement.querySelector("img")?.src || "";
//       const [rawDepartureTime, rawArrivalTime] = (
//         flightElement.querySelector(".vmXl")?.innerText || ""
//       ).split(" – ");

//       // Function to extract time and remove numeric values at the end
//       const extractTime = (rawTime: string): string => {
//         const timeWithoutNumbers = rawTime.replace(/[0-9+\s]+$/, "").trim();
//         return timeWithoutNumbers;
//       };

//       const departureTime = extractTime(rawDepartureTime);
//       const arrivalTime = extractTime(rawArrivalTime);
//       const flightDuration = (
//         flightElement.querySelector(".xdW8")?.children[0]?.innerText || ""
//       ).trim();

//       const airlineName = (
//         flightElement.querySelector(".VY2U")?.children[1]?.innerText || ""
//       ).trim();

//       // Extract price
//       const price = parseInt(
//         (flightElement.querySelector(".f8F1-price-text")?.innerText || "")
//           .replace(/[^\d]/g, "")
//           .trim(),
//         10
//       );

//       flights.push({
//         airlineLogo,
//         departureTime,
//         arrivalTime,
//         flightDuration,
//         airlineName,
//         price,
//       });
//     });

//     return flights;
//   });
// };


// import { Page } from "puppeteer";

// interface Flight {
//   airlineLogo: string;
//   departureTime: string;
//   arrivalTime: string;
//   flightDuration: string;
//   airlineName: string;
//   price: number;
// }

// export const startFlightScraping = async (page: Page): Promise<Flight[]> => {
//   try {
//     // Wait for the page to load
//     await page.waitForSelector(".nrc6-wrapper, .text-red-500.bg-red-100");

//     // Check for "No Flights Found" message
//     const noFlightsFound = await page.evaluate(() => {
//       return !!document.querySelector(".text-red-500.bg-red-100");
//     });

//     if (noFlightsFound) {
//       console.log("No flights found.");
//       return [];
//     }

//     // Continue with scraping if flights are present
//     return await page.evaluate((): Flight[] => {
//       const flights: Flight[] = [];
//       const flightSelectors = document.querySelectorAll(".nrc6-wrapper");

//       console.log(`Found ${flightSelectors.length} flight elements`);

//       flightSelectors.forEach((flightElement) => {
//         const airlineLogo = (flightElement.querySelector("img") as HTMLImageElement)?.src || "";
//         const rawDepartureArrival = (
//           flightElement.querySelector(".vmXl")?.innerText || ""
//         ).split(" – ");
//         const [rawDepartureTime, rawArrivalTime] = rawDepartureArrival.length === 2 ? rawDepartureArrival : ["", ""];

//         const extractTime = (rawTime: string): string => {
//           return rawTime.replace(/[0-9+\s]+$/, "").trim();
//         };

//         const departureTime = extractTime(rawDepartureTime);
//         const arrivalTime = extractTime(rawArrivalTime);
//         const flightDuration = (
//           flightElement.querySelector(".xdW8")?.children[0]?.innerText || ""
//         ).trim();

//         const airlineName = (
//           flightElement.querySelector(".VY2U")?.children[1]?.innerText || ""
//         ).trim();

//         const priceText = (flightElement.querySelector(".f8F1-price-text")?.innerText || "").replace(/[^\d]/g, "").trim();
//         const price = parseInt(priceText, 10);

//         flights.push({
//           airlineLogo,
//           departureTime,
//           arrivalTime,
//           flightDuration,
//           airlineName,
//           price: isNaN(price) ? 0 : price, // Handle invalid numbers
//         });

//         // Log each flight element's content for debugging
//         console.log(`Flight data:`, {
//           airlineLogo,
//           departureTime,
//           arrivalTime,
//           flightDuration,
//           airlineName,
//           price: isNaN(price) ? 0 : price,
//         });
//       });

//       return flights;
//     });
//   } catch (error) {
//     console.error("Error during flight scraping:", error);
//     return [];
//   }
// };


import { Page } from "puppeteer";

interface Flight {
  airlineLogo: string;
  departureTime: string;
  arrivalTime: string;
  flightDuration: string;
  airlineName: string;
  price: number;
}

export const startFlightScraping = async (page: Page): Promise<Flight[]> => {
  try {
    
    await page.waitForSelector(".nrc6-wrapper, .text-red-500.bg-red-100", { timeout: 10000 });
    
   
    const noFlightsFound = await page.evaluate(() => {
      return !!document.querySelector(".text-red-500.bg-red-100");
    });

    if (noFlightsFound) {
      console.log("No flights found.");
      return [];
    }

 
    return await page.evaluate((): Flight[] => {
      const flights: Flight[] = [];
      const flightSelectors = document.querySelectorAll(".nrc6-wrapper");

      console.log(`Found ${flightSelectors.length} flight elements`);

      flightSelectors.forEach((flightElement) => {
        const airlineLogo = (flightElement.querySelector("img") as HTMLImageElement)?.src || "";
        const rawDepartureArrival = (
          flightElement.querySelector(".vmXl")?.innerText || ""
        ).split(" – ");
        const [rawDepartureTime, rawArrivalTime] = rawDepartureArrival.length === 2 ? rawDepartureArrival : ["", ""];

        const extractTime = (rawTime: string): string => {
          return rawTime.replace(/[0-9+\s]+$/, "").trim();
        };

        const departureTime = extractTime(rawDepartureTime);
        const arrivalTime = extractTime(rawArrivalTime);
        const flightDuration = (
          flightElement.querySelector(".xdW8")?.children[0]?.innerText || ""
        ).trim();

        const airlineName = (
          flightElement.querySelector(".VY2U")?.children[1]?.innerText || ""
        ).trim();

        const priceText = (flightElement.querySelector(".f8F1-price-text")?.innerText || "").replace(/[^\d]/g, "").trim();
        const price = parseInt(priceText, 10);

        flights.push({
          airlineLogo,
          departureTime,
          arrivalTime,
          flightDuration,
          airlineName,
          price: isNaN(price) ? 0 : price, // Handle invalid numbers
        });

    
        console.log(`Flight data:`, {
          airlineLogo,
          departureTime,
          arrivalTime,
          flightDuration,
          airlineName,
          price: isNaN(price) ? 0 : price,
        });
      });

      return flights;
    });
  } catch (error) {
    console.error("Error during flight scraping:", error);
    return [];
  }
};
