import { UrlAssertionBuilder, UrlMonitor } from 'checkly/constructs'
import { appTags, leanixTag } from './tags'
import { createTriggerConf } from './helper'

const tags = [`${leanixTag}:${appTags.app2}`]

new UrlMonitor('books-url-check', {
  name: 'Books URL',
  activated: true,
  maxResponseTime: 10000,
  degradedResponseTime: 5000,
  tags,
  triggerIncident: createTriggerConf({ severity: 'MAJOR', tags }),
  request: {
    url: 'https://www.danube-web.shop/',
    followRedirects: true,
    assertions: [
      UrlAssertionBuilder.statusCode().equals(200),
    ]
  }
})
