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
    cy.get('.calendar-date').last().click()
    cy.contains('button', 'NEXT').click()

    cy.url().should('include', '/everyone')
    cy.get('.invitee').should('contain.text', 'Dan')
    cy.get('.streaming-status').should('contain.text', 'Live-streaming updates')

    cy.location('pathname').then(pathname => {
      const socialId = pathname.split('/')[1]
      cy.task('updateSocial', {id: socialId, data: '2024-01-02'})
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

    // Force a wait for the page to re-render, think this may be caused by the SvelteKit server does intiial render in current time.
    cy.contains('January 1970').should('exist')
    cy.contains('.calendar-date', /^3$/).click()
    cy.contains('.calendar-date', /^4$/).click()

    cy.contains('NEXT').click()
    cy.get('#best-dates')
      .table()
      .should('deep.equal', [
        ['', 'Rank', 'Date', 'Available Invitees', 'Invitees Total'],
        ['', '1', 'Saturday, 3 January', '🤴🧙‍♂️', '2/2'],
        ['', '2', 'Sunday, 4 January', '🤴🧙‍♂️', '2/2'],
        ['', '3', 'Friday, 2 January', '🤴', '1/2'],
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

  it.only('anyone can go back and amend it', function () {
    cy.visit(`/${this.social.id}/decision`)
    cy.contains('Your social is on January 3, 1970')
    cy.contains('BACK').click()
    cy.get('#best-dates [type="radio"]').first().check()
    cy.contains('button', 'NEXT').click()
  })

  it.skip("redirects invitees who haven't seen it yet", () => {})
})

describe('when an invitee joins the social', () => {
  // Can't test this until Cypress supports HTTP/2.
  it.skip('updates the everyone page in real time', () => {})

  // Not sure how to test this yet.
  it.skip('send push notifications to invitees who have enabled them', () => {})
})

describe('when an invitee from another timezone joins the social', () => {
  it.skip('shows them the same dates as others disregarding timezones entirely', () => {})
})
