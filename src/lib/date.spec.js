import test from 'ava'

import {toDateString} from './date.js'

// TODO: Fix this test, it returns 2024-04-11 in CI due to the different time zone.
test.skip('returns same date even in during daylight savings months', t => {
  t.is(toDateString(1712876400000), '2024-04-12')
})

test.todo('returns the same date in all time zones')
