import { StatusPageService } from "checkly/constructs"
import { appTags } from "./tags"

export const services: Record<string, StatusPageService> = {}

for (const appTag of Object.values(appTags)) {
    const service = new StatusPageService(`${appTag}-service`, {
        name: `${appTag} service`,
    })
    services[appTag] = service
}