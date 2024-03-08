// No idea why the clock needs setting before every test, but it does.
beforeEach(() => {
  cy.clock()
})

describe('when an organiser wants to schedule a social', () => {
  it('they can do so', () => {
    cy.visit('/')
    cy.get('#name').should('be.focused').type('Dan')
    cy.contains('button', 'NEXT').click()

    cy.url().should('include', '/you')
    // Force a wait for the page to re-render and display date properly, not sure why this re-render happens.
    cy.contains('January 1970').should('exist')
    cy.get('.calendar-date').last().click()
    cy.contains('button', 'NEXT').click()

    cy.url().should('include', '/everyone')
    cy.get('.invitee').should('contain.text', 'Dan')
    cy.get('.streaming-status').should('contain.text', 'Live-streaming updates')

    cy.location('pathname').then(pathname => {
      const socialId = pathname.split('/')[1]
      cy.task('updateSocial', {
        id: socialId,
        data: {
          invitees: {
            fakeId: {
              name: 'Max',
              dates: ['2024-01-02'],
            },
          },
        },
      })
    })
    cy.reload() // This shouldn't be necessary but HTTP2 isn't supported by Cypress so streaming doesn't work
    cy.get('.invitee').should('contain.text', 'Max')

    cy.wait(2000) // Fix weird re-render that changes date format and resets checked state
    cy.get('#best-dates [type="radio"]').first().check()
    cy.contains('button', 'NEXT').click()

    cy.url().should('include', '/decision')
    cy.contains('Your social is on')
  })
})

describe('when an invitee has chosen their availability', () => {
  beforeEach(() => {
    cy.task('createSocial', {
      invitees: {
        organiserID: {
          dates: ['1970-01-02', '1970-01-03', '1970-01-04'],
          name: 'Olaf',
        },
        inviteeID: {
          dates: ['1970-01-02', '1970-01-03'],
          name: 'Ingrid',
        },
      },
      organizer: 'organiserID',
    }).as('social')
    cy.setCookie('userId', 'inviteeID')
  })

  it('they can go back and amend it', function () {
    cy.visit(`/${this.social.id}/everyone`)
    cy.contains('BACK').click()

    // Force a wait for the page to re-render and display date properly, not sure why this re-render happens.
    cy.contains('January 1970').should('exist')
    cy.contains('.calendar-date', /^3$/).click()
    cy.contains('.calendar-date', /^4$/).click()

    cy.contains('NEXT').click()
    cy.get('#best-dates')
      .table()
      .should('deep.equal', [
        ['', 'Rank', 'Date', 'Available Invitees', 'Invitees Total'],
        ['', '1', formattedDate('1970-01-03'), '🤴🧙‍♂️', '2/2'],
        ['', '2', formattedDate('1970-01-04'), '🤴🧙‍♂️', '2/2'],
        ['', '3', formattedDate('1970-01-02'), '🤴', '1/2'],
      ])
  })
})

describe('when a decision has been made', () => {
  beforeEach(() => {
    cy.task('createSocial', {
      invitees: {
        organiserID: {
          dates: ['1970-01-02', '1970-01-03', '1970-01-04'],
          name: 'Olaf',
        },
        inviteeID: {
          dates: ['1970-01-02', '1970-01-03'],
          name: 'Ingrid',
        },
      },
      organizer: 'organiserID',
      decision: '1970-01-03',
    }).as('social')
    cy.setCookie('userId', 'inviteeID')
  })

  it('anyone can go back and amend it', function () {
    cy.visit(`/${this.social.id}/decision`)
    cy.contains(`Your social is on ${formattedDate('1970-01-03')}`)
    cy.contains('BACK').click()
    cy.contains('#best-dates', formattedDate('1970-01-02')).click()
    cy.contains('button', 'NEXT').click()
    cy.contains(`Your social is on ${formattedDate('1970-01-02')}`)
  })

  it("redirects invitees when they haven't seen the latest decision", function () {
    cy.visit(`/${this.social.id}/everyone`)
    cy.url('pathname').should('include', '/decision')
    cy.waitUntil(() => cy.getCookie('decision'))

    cy.clearCookie('decision')
    cy.visit(`/${this.social.id}/you`)
    cy.url('pathname').should('include', '/decision')
    cy.waitUntil(() => cy.getCookie('decision'))
    cy.clearCookie('decision')
    cy.visit(`/${this.social.id}/invite`)
    cy.url('pathname').should('include', '/decision')
    cy.waitUntil(() => cy.getCookie('decision'))
    cy.clearCookie('decision')
    cy.visit(`/${this.social.id}`)
    cy.url('pathname').should('include', '/decision')
    cy.waitUntil(() => cy.getCookie('decision'))

    cy.visit(`/${this.social.id}/everyone`)
    cy.url('pathname').should('not.include', '/decision')
    cy.visit(`/${this.social.id}/you`)
    cy.url('pathname').should('not.include', '/decision')
    cy.visit(`/${this.social.id}/invite`)
    cy.url('pathname').should('not.include', '/decision')
    cy.visit(`/${this.social.id}`)
    cy.url('pathname').should('not.include', '/decision')

    cy.task('updateSocial', {
      id: this.social.id,
      data: {decision: '1970-01-02'},
    })
    cy.visit(`/${this.social.id}/everyone`)
    cy.url('pathname').should('include', '/decision')
  })
})

describe('when an invitee joins the social', () => {
  // Can't test this until Cypress supports HTTP/2.
  it.skip('updates the everyone page in real time', () => {})

  // Not sure how to test this yet.
  it.skip('send push notifications to invitees who have enabled them', () => {})
})

describe('when an invitee from another timezone joins the social', () => {
  // Not sure how to test this yet. Manually tested by changing OS timezone.
  it.skip('shows them the same dates as others disregarding timezones entirely', () => {})
})

function formattedDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}
