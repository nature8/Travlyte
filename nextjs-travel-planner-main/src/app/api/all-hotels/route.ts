import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const hotels = await prisma.hotels.findMany({
      orderBy: { scrappedOn: "desc" },
    });
    if (hotels) {
      return NextResponse.json(
        {
          hotels,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ msg: "No hotels found." }, { status: 404 });
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
  return NextResponse.json(
    { message: "An unexpected error occurred." },
    { status: 500 }
  );
}


// import { NextResponse } from "next/server";
// import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
// import prisma from "../../../lib/prisma";

// export async function GET() {
//   try {
//     // Fetch hotels from the database, ordered by scrappedOn in descending order
//     const hotels = await prisma.hotels.findMany({
//       orderBy: { scrappedOn: "desc" },
//     });

//     // Check if any hotels were found
//     if (hotels.length > 0) {
//       return NextResponse.json(
//         { hotels },
//         { status: 200 }
//       );
//     } else {
//       return NextResponse.json(
//         { msg: "No hotels found." },
//         { status: 404 }
//       );
//     }
//   } catch (error: unknown) {
//     // Log the error for debugging purposes
//     console.error("Error fetching hotels:", error);

//     // Type guard to check if error is a PrismaClientKnownRequestError
//     if (error instanceof PrismaClientKnownRequestError) {
//       // Handle Prisma specific errors
//       if (error.code === "P2002") {
//         return NextResponse.json(
//           { message: "Unique constraint failed." },
//           { status: 400 }
//         );
//       }
//       return NextResponse.json(
//         { message: error.message },
//         { status: 400 }
//       );
//     }

//     // Handle general unknown errors
//     return NextResponse.json(
//       { message: "An unexpected error occurred." },
//       { status: 500 }
//     );
//   }
// }
