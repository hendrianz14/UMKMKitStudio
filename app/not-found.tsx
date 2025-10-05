import { redirect } from "next/navigation";

export default function NotFound() {
  // Redirect 404s to the marketing landing
  redirect("/landing");
}
