import { ApiCheck, AssertionBuilder } from 'checkly/constructs'
import { appTags, leanixTag } from './tags'
import { createTriggerConf } from './helper'

const tags = [`${leanixTag}:${appTags.app1}`]

new ApiCheck('books-api-check-1', {
  name: 'Books API',
  alertChannels: [],
  degradedResponseTime: 10000,
  maxResponseTime: 20000,
  tags,
  triggerIncident: createTriggerConf({ severity: 'MAJOR', tags }),
  request: {
    url: 'https://danube-web.shop/api/books',
    method: 'GET',
    followRedirects: true,
    skipSSL: false,
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.jsonBody('$[0].id').isNotNull(),
    ],
  },
  runParallel: true,
})
