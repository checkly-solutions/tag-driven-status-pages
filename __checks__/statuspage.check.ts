import { StatusPage, StatusPageService } from "checkly/constructs"
import { services } from "./statuspage-services"

const cards = Object.values(services).map(service => {
    return { name: service.name, services: [service] }
})

new StatusPage("company-status", {
  name: "Company Status",
  url: "company-status",
  cards
})