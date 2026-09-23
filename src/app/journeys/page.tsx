import { redirect } from "next/navigation";

export default function JourneysPage(): never {
  redirect("/plan-to-read?tab=journeys");
}
