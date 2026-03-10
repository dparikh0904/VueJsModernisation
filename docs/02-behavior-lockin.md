# BDD Behavior Specifications — VueJS Argon Design System

## Feature List

Based on Stage 1 analysis, the following features represent all critical business workflows:

1. **User Registration** — New user account creation with JWT backend integration
2. **User Login** — Email/password authentication with JWT token management
3. **Session Management** — Token-based persistence and automatic session restoration
4. **Navigation & Authorization** — Route access and header state rendering
5. **Form Validation** — Client-side input validation for authentication forms
6. **User Logout** — Session termination and token cleanup

---

## Feature 1: User Registration

**Traceability**: Stage 1 Business Rules 6, 7, 8 | Data Flow: User Registration Flow

```gherkin
Feature: User Registration
  As a new user
  I want to create an account with email and password
  So that I can access protected features of the application

  Background:
    Given the backend API is available at "http://localhost:3000/api/users/signup"

  Scenario: Successful user registration with valid credentials
    Given I am on the registration page "/register"
    And I have not previously registered
    When I enter username "john_doe"
    And I enter email "john@example.com"
    And I enter password "SecurePass123"
    And I submit the registration form
    Then the system sends a POST request to "/api/users/signup" with JSON body:
      | field    | value            |
      | name     | john_doe         |
      | surname  | " "              |
      | email    | john@example.com |
      | password | SecurePass123    |
    And the request includes header "Content-Type: application/json"
    And the request uses CORS mode and same-origin credentials
    And the backend responds with status 200 and user object
    Then a cookie "new_user" is created with value "john@example.com" and no expiration
    And I am redirected to "/login"
    And the email field on login page is pre-populated with "john@example.com"

  Scenario: Registration fails due to missing required fields
    Given I am on the registration page "/register"
    When I leave the username field empty
    And I enter email "test@example.com"
    And I enter password "pass123"
    And I submit the registration form
    Then the form displays error "Username required." below the username field
    And no API request is sent to the backend
    And I remain on "/register"

  Scenario: Registration fails due to invalid email format
    Given I am on the registration page "/register"
    When I enter username "jane_doe"
    And I enter email "invalid-email-format"
    And I enter password "MyPassword"
    And I submit the registration form
    Then the form displays error "Invalid email." below the email field
    And no API request is sent to the backend
    And the username and password fields retain their values

  Scenario: Registration fails due to missing password
    Given I am on the registration page "/register"
    When I enter username "test_user"
    And I enter email "test@example.com"
    And I leave the password field empty
    And I submit the registration form
    Then the form displays error "Password required." below the password field
    And no API request is sent to the backend

  Scenario: Backend returns validation errors (duplicate email)
    Given I am on the registration page "/register"
    When I enter username "existing_user"
    And I enter email "duplicate@example.com"
    And I enter password "Password123"
    And I submit the registration form
    Then the backend responds with status 400 and JSON:
      """
      {
        "errors": {
          "email": "Email already exists"
        }
      }
      """
    And the form displays error "Email already exists" below the email field
    And no "new_user" cookie is created
    And I remain on "/register"

  Scenario: Registration with multiple validation errors
    Given I am on the registration page "/register"
    When I leave the username field empty
    And I enter email "bad-email"
    And I leave the password field empty
    And I submit the registration form
    Then the form displays "Username required." below username field
    And the form displays "Invalid email." below email field
    And the form displays "Password required." below password field
    And no API request is sent

  Scenario: Registration backend timeout or network failure
    Given I am on the registration page "/register"
    And the backend API is unreachable or times out
    When I enter valid registration credentials
    And I submit the registration form
    Then the fetch request fails with network error
    And the user remains on "/register"
    And no cookie is created
```

**Acceptance Criteria**:
- ✅ Username, email, and password are all mandatory (Rules 6, 7, 8)
- ✅ Email must match RFC 5322 regex pattern (Rule 1)
- ✅ Surname field always defaults to single space `" "` (Rule 8)
- ✅ POST payload matches exact schema: `{name, surname, email, password}` with plaintext password
- ✅ On success, `new_user` cookie is created with no expiration (Rule 9)
- ✅ On success, user redirected to `/login` with email pre-filled
- ✅ Backend validation errors mapped to field-specific error messages
- ✅ No API call made if client-side validation fails

---

## Feature 2: User Login

**Traceability**: Stage 1 Business Rules 2, 3, 4, 5, 9, 10, 11 | Data Flow: User Login Flow

```gherkin
Feature: User Login
  As a registered user
  I want to authenticate with email and password
  So that I receive a JWT token for session access

  Background:
    Given the backend API is available at "http://localhost:3000/api/users/signin"

  Scenario: Successful login with valid credentials
    Given I am on the login page "/login"
    When I enter email "john@example.com"
    And I enter password "SecurePass123"
    And I submit the login form
    Then the system sends a POST request to "/api/users/signin" with JSON body:
      | field    | value            |
      | email    | john@example.com |
      | password | SecurePass123    |
    And the request includes header "Content-Type: application/json"
    And the backend responds with status 200 and JSON:
      """
      {
        "user": {
          "name": "john_doe",
          "surname": " ",
          "email": "john@example.com",
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
      }
      """
    Then a cookie "token" is created with value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." and no expiration
    And the Vuex store action "LOGIN" is dispatched with user object (without token field)
    And I am redirected to "/landing"

  Scenario: Login with email pre-populated from registration cookie
    Given a cookie "new_user" exists with value "jane@example.com"
    When I navigate to "/login"
    Then the email field is pre-populated with "jane@example.com"
    And the password field is empty

  Scenario: Login fails due to missing email
    Given I am on the login page "/login"
    When I leave the email field empty
    And I enter password "Password123"
    And I submit the login form
    Then the form displays error "Email required." below the email field
    And no API request is sent to the backend
    And I remain on "/login"

  Scenario: Login fails due to invalid email format
    Given I am on the login page "/login"
    When I enter email "not-an-email"
    And I enter password "Password123"
    And I submit the login form
    Then the form displays error "Invalid email." below the email field
    And no API request is sent to the backend

  Scenario: Login fails due to missing password
    Given I am on the login page "/login"
    When I enter email "john@example.com"
    And I leave the password field empty
    And I submit the login form
    Then the form displays error "Password required." below the password field
    And no API request is sent to the backend

  Scenario: Login fails with invalid credentials (backend 401)
    Given I am on the login page "/login"
    When I enter email "john@example.com"
    And I enter password "WrongPassword"
    And I submit the login form
    Then the backend responds with status 401 and JSON:
      """
      {
        "errors": {
          "password": "Incorrect password"
        }
      }
      """
    And the form displays error "Incorrect password" below the password field
    And no "token" cookie is created
    And the Vuex store remains empty
    And I remain on "/login"

  Scenario: Login with multiple validation errors
    Given I am on the login page "/login"
    When I leave both email and password fields empty
    And I submit the login form
    Then the form displays "Email required." below email field
    And the form displays "Password required." below password field
    And no API request is sent

  Scenario: Login backend network failure
    Given I am on the login page "/login"
    And the backend API is unreachable
    When I enter valid login credentials
    And I submit the login form
    Then the fetch request fails with network error
    And no token cookie is created
    And the user remains on "/login"

  Scenario: Login with malformed backend response (missing token)
    Given I am on the login page "/login"
    When I enter valid credentials
    And the backend responds with status 200 but JSON:
      """
      {
        "user": {
          "name": "john",
          "email": "john@example.com"
        }
      }
      """
    Then no token cookie is created
    And the application behavior is undefined (no token field to destructure)
```

**Acceptance Criteria**:
- ✅ Email and password are both mandatory (Rules 2, 3, 4, 5)
- ✅ Email field pre-populated from `new_user` cookie if exists (Rule 9)
- ✅ JWT token stored in `token` cookie with no expiration on success (Rule 10, 11)
- ✅ User object (excluding token field) dispatched to Vuex `LOGIN` action
- ✅ Successful login redirects to `/landing`
- ✅ Backend validation errors mapped to specific form fields
- ✅ No API call if client-side validation fails

---

## Feature 3: Session Management

**Traceability**: Stage 1 Business Rules 12, 13, 14, 15, 16 | Data Flow: Session Restoration

```gherkin
Feature: Session Management
  As a returning user with a valid token
  I want my session automatically restored on page load
  So that I don't have to log in again

  Background:
    Given the JWT decoder library is available

  Scenario: Automatic session restoration on app startup with valid token
    Given a cookie "token" exists with value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiam9obiIsInN1cm5hbWUiOiIgIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIn0.abc123"
    And the token decodes to:
      """
      {
        "name": "john",
        "surname": " ",
        "email": "john@example.com"
      }
      """
    When the application header component (AppHeader.vue) is mounted
    Then the system reads the "token" cookie
    And the token is decoded using jwt-decode library client-side
    And the Vuex store action "LOGIN" is dispatched with the decoded user object
    And the header displays "john  " and a "Logout" link

  Scenario: App startup without existing token cookie
    Given no "token" cookie exists
    When the application header component is mounted
    Then no token decoding is attempted
    And the Vuex store user object remains null
    And the header displays "Login" and "Register" links

  Scenario: Token persistence across browser sessions
    Given a user logged in yesterday
    And a cookie "token" was created with no expiration
    And the user closed the browser
    When the user opens the browser and navigates to the app today
    Then the "token" cookie still exists
    And the session is automatically restored
    And the user is logged in

  Scenario: Logout removes token and clears session
    Given a user is logged in
    And a cookie "token" exists
    And the Vuex store contains user object
    When the user clicks the "Logout" link
    Then the "token" cookie is removed
    And the Vuex store action "LOGOUT" is dispatched
    And the Vuex store user object is cleared
    And the header displays "Login" and "Register" links
    And the user remains on the current page

  Scenario: Session restoration with corrupted or invalid token
    Given a cookie "token" exists with value "invalid.jwt.token"
    When the application header component is mounted
    And jwt-decode attempts to decode the token
    Then jwt-decode throws an error
    And the application does not catch the error (no error handling present)
    And the application may crash or behave unpredictably

  Scenario: Session restoration without backend token validation
    Given a cookie "token" exists with an expired or revoked JWT
    When the application header component is mounted
    Then the token is decoded client-side without backend verification (Rule 14)
    And the session appears restored from the user's perspective
    But the token may fail on subsequent backend API calls requiring authentication
```

**Acceptance Criteria**:
- ✅ On app startup, check for `token` cookie (Rule 12)
- ✅ If token exists, decode using `jwt-decode` library (Rule 13, 14)
- ✅ Decoded user object dispatched to Vuex `LOGIN` action (Rule 13)
- ✅ Token stored with `null` expiration (persists indefinitely) (Rule 11)
- ✅ Logout removes `token` cookie (Rule 15)
- ✅ Logout dispatches `LOGOUT` action to clear Vuex store (Rule 16)
- ⚠️ **Known Gap**: No error handling for malformed tokens
- ⚠️ **Known Gap**: No backend token validation on session restore (security risk)

---

## Feature 4: Navigation & Authorization

**Traceability**: Stage 1 Business Rules 17, 18, 19, 20, 21, 22, 23

```gherkin
Feature: Navigation & Authorization
  As a user of the application
  I want consistent navigation behavior across all pages
  So that I can access features according to my authentication state

  Scenario: Root path redirects to landing page
    When I navigate to "/"
    Then I see the Landing page component
    And the URL remains "/"

  Scenario: Landing alias route resolves correctly
    When I navigate to "/landing"
    Then I see the same Landing page component as "/"
    And the URL is "/landing"

  Scenario: Scroll behavior with URL hash
    Given I am on any page
    When I navigate to "/landing#features"
    Then the browser scrolls to the element with selector "#features"
    And the page loads the Landing component

  Scenario: Scroll behavior without URL hash
    Given I am on a page scrolled down 500px
    When I navigate to "/profile"
    Then the browser scrolls to position (0, 0)
    And the page loads the Profile component

  Scenario: Header displays user info when logged in
    Given I am logged in as user "John Doe" with surname " "
    When I view any page
    Then the header displays text "John Doe  " (name + space + surname)
    And the header displays a "Logout" link
    And the header does NOT display "Login" or "Register" links

  Scenario: Header displays auth links when not logged in
    Given I am not logged in
    And no "token" cookie exists
    When I view any page
    Then the header displays a "Login" link to "/login"
    And the header displays a "Register" link to "/register"
    And the header does NOT display user name or "Logout" link

  Scenario: No route guards - all pages publicly accessible
    Given I am not logged in
    When I navigate to "/profile"
    Then the Profile page loads successfully
    And I am not redirected to "/login"

  Scenario: No route guards - protected pages accessible without authentication
    Given I am not logged in
    When I navigate to "/register"
    Or I navigate to "/login"
    Or I navigate to "/landing"
    Then each page loads without authentication checks (Rule 19)
```

**Acceptance Criteria**:
- ✅ All routes use named multi-component layout (header, default, footer) (Rule 17)
- ✅ Root `/` and `/landing` resolve to same component (Rule 18)
- ✅ No route guards implemented - all pages public (Rule 19)
- ✅ Hash-based scroll: with hash → scroll to element; without hash → scroll to (0,0) (Rule 20)
- ✅ Logged-in header shows `{user.name} {user.surname}` and Logout (Rule 21, 23)
- ✅ Logged-out header shows Login and Register links (Rule 22)

---

## Feature 5: Form Validation

**Traceability**: Stage 1 Business Rules 1, 2, 3, 4, 5

```gherkin
Feature: Form Validation
  As a user entering authentication forms
  I want immediate feedback on invalid inputs
  So that I can correct errors before submission

  Background:
    Given the email validation regex is "/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/"

  Scenario Outline: Email validation with various formats
    Given I am on the "<page>" page
    When I enter email "<email>"
    And I trigger validation
    Then the email validation result is "<valid>"
    And the error message is "<error>"

    Examples:
      | page     | email                     | valid | error          |
      | login    | user@example.com          | true  |                |
      | login    | user.name@sub.domain.com  | true  |                |
      | login    | user+tag@example.co.uk    | true  |                |
      | register | user@localhost            | true  |                |
      | login    | plaintext                 | false | Invalid email. |
      | login    | @example.com              | false | Invalid email. |
      | login    | user@                     | false | Invalid email. |
      | login    | user @example.com         | false | Invalid email. |
      | login    | user@.com                 | false | Invalid email. |
      | login    |                           | false | Email required.|

  Scenario: Password field validation on login form
    Given I am on the login page
    When I enter email "user@example.com"
    And I leave password empty
    And I attempt to submit
    Then the form displays "Password required." below password field
    And the email field retains value "user@example.com"

  Scenario: Multiple field validation errors displayed simultaneously
    Given I am on the register page
    When I leave username, email, and password all empty
    And I attempt to submit
    Then error "Username required." is displayed below username field
    And error "Email required." is displayed below email field
    And error "Password required." is displayed below password field
    And all error messages are visible at the same time

  Scenario: Validation errors clear on re-submission with valid data
    Given I am on the login page
    And I previously submitted with invalid data
    And errors are displayed
    When I enter valid email "user@example.com"
    And I enter valid password "Pass123"
    And I submit the form
    Then all previous error messages are cleared
    And the API request is sent

  Scenario: Form submission blocked when validation fails
    Given I am on the register page
    When I enter invalid data
    And I submit the form
    Then the isValidForm() method returns false
    And the submitForm() method returns early (line 176-178)
    And no fetch() API call is made
    And no network request appears in browser dev tools
```

**Acceptance Criteria**:
- ✅ Email must match RFC 5322 regex (Rule 1)
- ✅ Empty email displays "Email required." (Rule 2)
- ✅ Invalid email format displays "Invalid email." (Rule 3)
- ✅ Empty password displays "Password required." (Rule 4)
- ✅ Form submission blocked if any validation errors exist (Rule 5)
- ✅ Validation runs before every form submission
- ✅ Multiple errors can display simultaneously
- ✅ Error messages cleared on next validation attempt

---

## Feature 6: User Logout

**Traceability**: Stage 1 Business Rules 15, 16

```gherkin
Feature: User Logout
  As a logged-in user
  I want to securely log out of the application
  So that my session is terminated and my token is removed

  Scenario: Successful logout from landing page
    Given I am logged in as "John Doe"
    And a cookie "token" exists
    And the Vuex store contains user object {"name": "john", "email": "john@example.com"}
    And I am on the landing page
    When I click the "Logout" link in the header
    Then the logout method is invoked with preventDefault()
    And the cookie "token" is removed via Cookies.remove("token")
    And the Vuex action "LOGOUT" is dispatched
    And the Vuex store user object is set to null
    And the header immediately updates to show "Login" and "Register" links
    And I remain on the current page ("/landing")

  Scenario: Logout from profile page
    Given I am logged in
    And I am on "/profile"
    When I click the "Logout" link
    Then the token cookie is removed
    And the Vuex store is cleared
    And I remain on "/profile" (no redirect)
    And the header shows "Login" and "Register" links

  Scenario: Logout does not redirect user
    Given I am logged in
    And I am on any page
    When I click "Logout"
    Then no router.push() or navigation occurs
    And I stay on the same URL

  Scenario: Logout with no existing token (edge case)
    Given the Vuex store indicates I am logged in
    But no "token" cookie exists in the browser
    When I click "Logout"
    Then Cookies.remove("token") is called but has no effect
    And the Vuex action "LOGOUT" still dispatches
    And the UI updates to logged-out state

  Scenario: Cannot restore session after logout
    Given I am logged in with a valid token
    When I log out
    And I refresh the browser page
    Then no "token" cookie exists
    And session restoration does not occur
    And the header displays "Login" and "Register" links
```

**Acceptance Criteria**:
- ✅ Logout clears JWT token cookie (Rule 15)
- ✅ Logout dispatches LOGOUT action to Vuex store (Rule 16)
- ✅ User object cleared from Vuex store
- ✅ Header updates reactively to show Login/Register links
- ✅ Logout does not trigger page navigation
- ✅ Session cannot be restored after logout without re-authentication

---

## Regression Checklist

### 🔒 Data Integrity

| Check | Description | Stage 1 Reference | Pass Criteria |
|-------|-------------|-------------------|---------------|
| **REG-01** | Registration payload structure | Register.vue lines 180-185 | POST body contains exactly `{name, surname:" ", email, password}` |
| **REG-02** | Surname defaults to single space | Rule 8 | Surname field in POST payload is exactly `" "` (one space) |
| **REG-03** | Login payload structure | Login.vue lines 153-156 | POST body contains exactly `{email, password}` |
| **REG-04** | Token stored without expiration | Rule 10, 11 | `Cookies.create("token", value, null)` - third param is `null` |
| **REG-05** | Email validation regex | Rule 1 | Regex matches RFC 5322 and produces identical true/false results for test emails |
| **REG-06** | Error mapping from backend | Register.vue 199-210 | Backend errors correctly populate field-specific error arrays |
| **REG-07** | User object excludes token in Vuex | Login.vue line 179 | Token destructured out: `const {token, ...userData} = user` |

### 🔌 Integration Contract Tests

| Check | API Endpoint | Method | Request Headers | Request Body Schema | Success Response | Error Response | Stage 1 Reference |
|-------|--------------|--------|-----------------|---------------------|------------------|----------------|-------------------|
| **INT-01** | `http://localhost:3000/api/users/signup` | POST | `Content-Type: application/json` | `{name: string, surname: string, email: string, password: string}` | `{user: {...}}` status 200 | `{errors: {field: string}}` status 400+ | Register.vue 187-198 |
| **INT-02** | `http://localhost:3000/api/users/signin` | POST | `Content-Type: application/json` | `{email: string, password: string}` | `{user: {name, surname, email, token}}` status 200 | `{errors: {field: string}}` status 401 | Login.vue 153-171 |
| **INT-03** | CORS mode | both | `mode: "cors"` | N/A | CORS headers accepted | Pre-flight failure | Both API calls |
| **INT-04** | Credentials policy | both | `credentials: "same-origin"` | N/A | Cookies sent if same-origin | Cookies blocked if cross-origin | Both API calls |

### 🛡️ Security Behavior

| Check | Description | Stage 1 Reference | Expected Behavior |
|-------|-------------|-------------------|-------------------|
| **SEC-01** | Passwords sent in plaintext | Register/Login payload | Password not hashed client-side (backend responsibility) |
| **SEC-02** | JWT token stored in cookie | Rule 10, 11 | Token in `document.cookie` accessible to JavaScript (XSS risk) |
| **SEC-03** | Token decoded client-side | Rule 14 | `jwt-decode` used without backend verification on load |
| **SEC-04** | No token expiration client-side | Rule 11 | Cookie persists indefinitely until manual removal |
| **SEC-05** | No route guards | Rule 19 | All pages accessible without authentication |
| **SEC-06** | Token not validated on restore | Rule 14 | No API call to verify token validity on app startup |
| **SEC-07** | Email cookie persistence | Rule 9 | `new_user` cookie persists email in plaintext |
| **SEC-08** | Logout only clears cookie | Rule 15, 16 | No backend call to invalidate token server-side |

### 🧪 Critical User Paths (End-to-End)

| Path | Steps | Data Integrity Checks | Exit Criteria |
|------|-------|----------------------|---------------|
| **E2E-01: New User Registration → Login** | 1. Navigate `/register`<br>2. Enter valid credentials<br>3. Submit form<br>4. Backend returns user object<br>5. Redirect to `/login`<br>6. Email pre-filled<br>7. Enter password<br>8. Login successful<br>9. Redirect to `/landing` | • `new_user` cookie created with email<br>• Email pre-populated on login<br>• `token` cookie created after login<br>• Vuex store populated with user | User sees logged-in header with name |
| **E2E-02: Session Persistence** | 1. User logs in<br>2. Close browser tab<br>3. Reopen browser<br>4. Navigate to app<br>5. Session restored automatically | • `token` cookie persists after browser close<br>• AppHeader reads token on mount<br>• jwt-decode extracts user object<br>• Vuex LOGIN action dispatched | User sees logged-in state without re-login |
| **E2E-03: Logout → Login** | 1. User logged in<br>2. Click Logout<br>3. Header updates to logged-out<br>4. Navigate to `/login`<br>5. Enter credentials<br>6. Login again | • Token cookie removed on logout<br>• Vuex store cleared<br>• New token created on re-login<br>• New token is different from old token | User successfully re-authenticates |
| **E2E-04: Validation Error Recovery** | 1. Navigate `/register`<br>2. Submit empty form<br>3. See 3 validation errors<br>4. Fill all fields correctly<br>5. Submit again<br>6. Success | • First submit: no API call<br>• Errors displayed for all 3 fields<br>• Second submit: errors cleared<br>• API called with valid payload | User registered successfully |

### 🚨 Error Path Coverage

| Scenario | Trigger | Expected System Response | Data State After Error | Stage 1 Reference |
|----------|---------|-------------------------|------------------------|-------------------|
| **ERR-01** | Network failure during registration | Fetch promise rejected | No cookie created, user remains on `/register` | Register.vue 187-217 |
| **ERR-02** | Network failure during login | Fetch promise rejected | No token cookie, no Vuex store update | Login.vue 153-189 |
| **ERR-03** | Backend 400 on registration (duplicate email) | Errors displayed below fields | No cookie created, no redirect | Register.vue 199-210 |
| **ERR-04** | Backend 401 on login (wrong password) | Error displayed below password field | No token cookie, no redirect | Login.vue 173-189 |
| **ERR-05** | Malformed JWT token on app load | jwt-decode throws error | **UNCAUGHT** - app may crash | AppHeader.vue 77-81 |
| **ERR-06** | Backend returns 200 but missing token field | Destructuring `{token, ...userData}` receives undefined | Token cookie set to `undefined` | Login.vue 179-181 |
| **ERR-07** | Backend returns 200 but missing user field | `if (user)` condition false | No redirect, user stuck on login page | Login.vue 182-185 |
| **ERR-08** | CORS pre-flight failure | Fetch fails with CORS error | No data sent to backend, user remains on form | Both API calls |

---

## Traceability Matrix

| BDD Scenario | Stage 1 Business Rule(s) | Stage 1 Data Flow | Code Location |
|--------------|--------------------------|-------------------|---------------|
| Feature 1 - Successful registration | Rules 6, 7, 8 | User Registration Flow | `src/views/Register.vue:174-217` |
| Feature 1 - Missing required fields | Rules 6, 7, 8 | N/A | `src/views/Register.vue:141-171` |
| Feature 1 - Backend validation errors | N/A | User Registration Flow Step 5 | `src/views/Register.vue:199-210` |
| Feature 2 - Successful login | Rules 2, 3, 4, 5, 10, 11 | User Login Flow | `src/views/Login.vue:143-189` |
| Feature 2 - Email pre-population | Rule 9 | User Login Flow Step 1 | `src/views/Login.vue:108-109` |
| Feature 2 - Login validation errors | Rules 2, 3, 4, 5 | User Login Flow Step 2 | `src/views/Login.vue:124-141` |
| Feature 3 - Session restoration | Rules 12, 13, 14 | Session Restoration | `src/layout/AppHeader.vue:77-81` |
| Feature 3 - Logout | Rules 15, 16 | N/A | `src/layout/AppHeader.vue:86-91` |
| Feature 4 - Route resolution | Rules 17, 18 | N/A | `src/router.js:11-77` |
| Feature 4 - Header display logic | Rules 21, 22, 23 | N/A | `src/layout/AppHeader.vue:50-60` |
| Feature 4 - No route guards | Rule 19 | N/A | `src/router.js:11-77` |
| Feature 4 - Scroll behavior | Rule 20 | N/A | `src/router.js:78-86` |
| Feature 5 - Email validation | Rule 1 | Both registration and login | `src/views/Login.vue:120-122` |
| Feature 5 - Form validation | Rules 2-5 | User Login/Registration | `src/views/Login.vue:124-141` |
| Feature 6 - Logout | Rules 15, 16 | N/A | `src/layout/AppHeader.vue:86-91` |

---

## Notes & Migration Risks

1. **⚠️ Unhandled Error Paths**: JWT decode errors and malformed backend responses are not caught (ERR-05, ERR-06)
2. **⚠️ Security Gaps**: Client-side-only token validation, no server-side token verification on session restore (SEC-03, SEC-06)
3. **⚠️ Hardcoded Backend URLs**: `localhost:3000` hardcoded in both Login and Register views
4. **⚠️ CORS Configuration**: Credentials set to `same-origin` but API likely on different port in dev
5. **✅ Plaintext Passwords**: Client sends plaintext (expected - backend should hash)
6. **✅ Token Expiration**: No client-side expiration check (backend should enforce via token claims)

All scenarios above must produce **identical behavior** pre- and post-migration.