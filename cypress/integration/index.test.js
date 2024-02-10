it("should work", () => {
  cy.visit("/");
  cy.get("#name").should("be.focused").type("Dan");
  cy.contains("button", "NEXT").click();

  cy.url().should("include", "/you");
  cy.get(".calendar-date").last().click();
  cy.contains("button", "NEXT").click();

  cy.url().should("include", "/everyone");
  cy.get(".invitee").should("contain.text", "Dan");
  cy.get(".streaming-status").should("contain.text", "Live-streaming updates");

  cy.task("updateSocial");
  cy.reload(); // This shouldn't be necessary but HTTP2 isn't supported by Cypress so streaming doesn't work
  cy.get(".invitee").should("contain.text", "Max");

  cy.wait(1000); // Fix weird re-render that changes date format and resets checked state
  cy.get('#best-dates [type="radio"]').first().check();
  cy.contains("button", "NEXT").click();

  cy.url().should("include", "/decision");
  cy.contains("Your social is on");
});
