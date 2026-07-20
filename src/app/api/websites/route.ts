// app/api/websites/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // Ensure this points to your Firebase config
import { doc, setDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    // 1. Parse the incoming JSON from n8n
    const data = await request.json();

    // 2. Validate that we have a slug (which acts as the document ID)
    if (!data.slug) {
      return NextResponse.json(
        { error: "Missing 'slug' in the request body" }, 
        { status: 400 }
      );
    }

    // 3. Reference the specific document in the "websites" collection
    const websiteDocRef = doc(db, "websites", data.slug);

    // 4. Save the data to Firebase (merge: true updates existing docs without overwriting everything)
    await setDoc(websiteDocRef, {
      slug: data.slug,
      websiteOneData: data.websiteOneData || null,
      websiteTwoData: data.websiteTwoData || null,
      emailCampaign: data.emailCampaign || null,
      lastUpdated: new Date().toISOString(),
    }, { merge: true });

    // 5. Return success to n8n
    return NextResponse.json(
      { success: true, message: `Successfully saved data for ${data.slug}` },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error saving to Firebase:", error);
    return NextResponse.json(
      { error: "Internal Server Error. Failed to save to Firebase." }, 
      { status: 500 }
    );
  }
}