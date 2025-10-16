import { IncidentTrigger } from "checkly/constructs"
import { services } from "./statuspage-services"
import { leanixTag  } from "./tags"
export function createTriggerConf ({ severity, tags } : { severity?: 'MINOR' | 'MEDIUM' | 'MAJOR' | 'CRITICAL', tags: string[]}) : IncidentTrigger {

    const appTag = tags
        .filter(tag => tag.startsWith(`${leanixTag}:`))
        .map(tag => tag.split(':')[1])

    const service = services[appTag[0]]

    if (!service) {
        throw new Error('no correct tag found to link service')
    }

    return {
        name: `${appTag} uptime`,
        description: `service ${appTag} is down`,
        severity: severity || 'MAJOR',
        notifySubscribers: true,
        service,
    }
}