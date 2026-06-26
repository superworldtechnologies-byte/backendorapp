import { cookies } from "next/headers";

export async function getCustomerPhoneFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("customerPhone")?.value || null;
}

export async function isCustomerLoggedIn() {
  const phone = await getCustomerPhoneFromCookie();
  return !!phone;
}