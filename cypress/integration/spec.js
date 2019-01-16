const getRandomNumber = () => {
  return new Cypress.Promise((resolve, reject) => {
    setTimeout(() => {
      const x = Cypress._.random(0, 20)
      console.log('resolving with %d', x)
      resolve(x)
    }, 10)
  })
}

const retry = fn => () => {
  return fn().then(value => {
    return cy.verifyUpcomingAssertions(
      value,
      {},
      {
        onRetry: retry(fn)
      }
    )
  })
}

it('retries task', () => {
  let counter = 0
  const limit = 10
  const printToTerminal = () => cy.task('print', (counter += 1), { log: false })

  // cypress-pipe does not retry Cypress chains
  // cy.document()
  //   // .pipe(printToTerminal)
  //   .should('equal', limit)

  cy.log('retrying task')
  cy.then(retry(printToTerminal)).should('equal', limit)

  cy.log('retrying async random number')
  cy.then({ timeout: 10000 }, retry(getRandomNumber)).should('equal', 10)
})
