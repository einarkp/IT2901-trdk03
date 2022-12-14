
// NOTE: needs a user in db like this:
const username = "test123123123"
const password = "5fuXB@r`3fr8"
const schoolIdOfTestUser = 11010
// Then npm run cypress

describe('Login and logout', () => { 
  it('should navigate to the login page and login', () => {

    cy.visit('http://localhost:3000/')
    // Click "Logg inn" in nav bar
    cy.get('.Nav_usertext__Mlmct').click() 
    
    // Input credentials
    cy.get('input[name="username"]').type(username)
    cy.get('input[name="password"]').type(password)

    // Login
    cy.get('.LoginForm_button__OrnPP').click()

    // Should be redirected to "totalOversikt" page
    cy.url().should('include', '/totalOversikt')

    // Budget graph should load
    cy.get('.BudgetInfo_topText__0deB2')

    // Click dropdown
    cy.get('.Nav_usertext__Mlmct').click()

    // Click logout
    cy.get('a[href*="login"]').click()

    // Should be redirected to login page
    cy.get('input[name="username"]')
  })
})

describe('Navigate app', () => { 
  it('Should navigate the different pages of the app', () => {

    cy.visit('http://localhost:3000/')
    // Click "Logg inn" in nav bar
    cy.get('.Nav_usertext__Mlmct').click() 
    
    // Input credentials
    cy.get('input[name="username"]').type(username)
    cy.get('input[name="password"]').type(password)

    // Login
    cy.get('.LoginForm_button__OrnPP').click()

    // Naviagate to pupil page
    cy.get(`a[href*="/elever?id=${schoolIdOfTestUser}"]`).click()

    // Should be redirected to "elever" page
    cy.url().should('include', '/elever')

    // Pupil graph should load
    cy.get('.PupilSidePanel_topText__W_FOD')

    // Click on verify pupils
    cy.get('.PupilSidePanel_button__qFJ4T').click()

    //Change pupil count of first class to 40
    cy.get('.PupilSidePanel_inputField__mYoyI').first().type("40")

    // Change amount should be visible
    cy.get('.budgetChangeAmount')

    //Go back to default side panel page
    cy.get('.PupilSidePanel_button__qFJ4T').first().click()

    // Click dropdown in nav
    cy.get('.Nav_usertext__Mlmct').click()

    // Click "Last opp data"
    cy.get('a[href*="/data"]').click()

    // Fileupload component should render
    cy.get('section')
  })
})
