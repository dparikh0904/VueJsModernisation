I'll analyze this VueJS legacy codebase systematically. Let me start by understanding the project structure and then dive into the code.Now let me search for any configuration files and examine the views structure more thoroughly:Now let me check for any environment or config files:Now let me look at a few more components to understand the structure better:Now I have sufficient information to generate the comprehensive requirements document. Let me compile all findings:

---

# Legacy System Analysis: VueJS Argon Design System

## Business Goals

This is a **design system demonstration and authentication boilerplate application** built with Vue.js 2.x, intended as a showcase and starter template for full-stack web applications. Key business objectives:

1. **Product Showcase**: Demonstrate the Argon Design System by Creative Tim integrated with Vue.js framework (`src/views/Landing.vue`, lines 24-26: "JWT token authentication. The design system (by Creative-Tim) comes with four pre-built pages")

2. **Authentication Starter Kit**: Provide JWT-based authentication patterns for developers building full-stack applications (`README.md`, lines 3-4: "Can be used with Express, Flask or Laravel")

3. **App Generator Marketing**: Drive traffic to AppSeed's full-stack app generator service (multiple CTAs throughout `src/views/Landing.vue` linking to `https://appseed.us/fullstack-apps-generator/vuejs`)

4. **Developer Onboarding**: Lower the barrier to entry for developers needing a pre-styled, authentication-ready frontend

## Business Rules

### Authentication Rules

**Email Validation** (`src/views/Login.vue`, lines 120-122; `src/views/Register.vue`, lines 136-138):
```javascript
validEmail: function(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
```
- **Rule 1**: Email must match RFC 5322 compliant regex pattern before submission
- **Location**: Used in both Login and Register views

**Login Form Validation** (`src/views/Login.vue`, lines 124-141):
```javascript
isValidForm() {
  this.email.errors = [];
  this.password.errors = [];
  
  if (!this.email.value) {
    this.email.errors.push("Email required.");
  } else if (!this.validEmail(this.email.value)) {
    this.email.errors.push("Invalid email.");
  }
  
  if (!this.password.value) {
    this.password.errors.push("Password required.");
  }
  
  if (this.password.errors.length || this.email.errors.length) {
    return false;
  }
  return true;
}
```
- **Rule 2**: Email is mandatory; display "Email required." if empty
- **Rule 3**: Email must pass validation; display "Invalid email." if malformed
- **Rule 4**: Password is mandatory; display "Password required." if empty
- **Rule 5**: Form submission blocked if any validation errors exist

**Registration Form Validation** (`src/views/Register.vue`, lines 141-171):
```javascript
if (!this.name.value) {
  this.name.errors.push("Username required.");
}
```
- **Rule 6**: Username (name) is mandatory for registration
- **Rule 7**: Same email and password validation rules as Login apply
- **Rule 8**: User surname defaults to empty string " " (`src/views/Register.vue`, line 183: `surname: " "`)

**Cookie Persistence** (`src/views/Login.vue`, lines 108-109):
```javascript
email: {
  value: Cookies.read("new_user"),
  errors: []
}
```
- **Rule 9**: Email field pre-populated from "new_user" cookie on login page load
- **Context**: After registration, email is stored in cookie for login convenience

**Token Management** (`src/views/Login.vue`, lines 179-181):
```javascript
const { token, ...userData } = user;
Cookies.create("token", token, null);
console.log(userData, token);
```
- **Rule 10**: JWT token stored in browser cookie with no expiration (third parameter: `null`)
- **Rule 11**: Token persists across sessions until explicitly removed
- **Location**: Token set upon successful login

**User Session Restoration** (`src/layout/AppHeader.vue`, lines 77-81):
```javascript
const token = Cookies.read("token");

if (token) {
  const user = jwtDecode(token);
  this.$store.dispatch("LOGIN", user);
}
```
- **Rule 12**: On app startup, check for existing JWT token in cookies
- **Rule 13**: If token exists, decode it and restore user session automatically
- **Rule 14**: Token decoded client-side using `jwt-decode` library (no backend validation on startup)

**Logout Behavior** (`src/layout/AppHeader.vue`, lines 86-91):
```javascript
logout(e) {
  e.preventDefault();
  console.log(Cookies.remove("token"));
  return this.$store.dispatch("LOGOUT");
}
```
- **Rule 15**: Logout clears JWT token cookie
- **Rule 16**: User object cleared from Vuex store

### Navigation Rules

**Route Configuration** (`src/router.js`, lines 11-77):
- **Rule 17**: All routes use named multi-component layout (header, default, footer)
- **Rule 18**: Root path `/` and `/landing` both resolve to Landing page
- **Rule 19**: No route guards implemented - all pages publicly accessible
- **Rule 20**: Hash-based scroll behavior: if URL contains hash, scroll to selector; otherwise scroll to top (0,0)

**Header Display Logic** (`src/layout/AppHeader.vue`, lines 50-60):
```vue
<ul v-if="user" class="navbar-nav align-items-lg-center ml-lg-auto">
  <li>{{ user.name }} {{ user.surname }}</li>
  <li><a href="#" @click="logout($event)">Logout</a></li>
</ul>
<ul v-else class="navbar-nav align-items-lg-center ml-lg-auto">
  <li><router-link to="/login">Login</router-link></li>
  <li><router-link to="/register">Register</router-link></li>
</ul>
```
- **Rule 21**: If user logged in (Vuex store has user object), show user name and Logout link
- **Rule 22**: If user not logged in, show Login and Register links
- **Rule 23**: User full name displayed as: `{user.name} {user.surname}`

### Environment Configuration Rules

**ESLint Production Rules** (`.eslintrc.js`, lines 8-9):
```javascript
"no-console": process.env.NODE_ENV === "production" ? "error" : "off",
"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
```
- **Rule 24**: Console statements forbidden in production builds (build fails)
- **Rule 25**: Debugger statements forbidden in production builds
- **Rule 26**: Both allowed in development mode

## Data Flows

### User Registration Flow

**Entry Point**: `src/views/Register.vue`

**Step 1 - Form Input Collection** (lines 57-105):
- User enters: name (username), email, password
- Optional: "Remember me" checkbox, Privacy Policy checkbox

**Step 2 - Client-Side Validation** (lines 174-178):
```javascript
async submitForm() {
  if (!this.isValidForm()) {
    return;
  }
  // ... proceed
}
```

**Step 3 - API Payload Construction** (lines 180-185):
```javascript
const user = {
  name: this.name.value,
  surname: " ",
  email: this.email.value,
  password: this.password.value
};
```
**Payload Schema**:
- `name`: string (required)
- `surname`: string (always empty space)
- `email`: string (required, validated)
- `password`: string (required, plaintext)

**Step 4 - Backend API Call** (lines 187-198):
```javascript
const url = "http://localhost:3000/api/users/signup";

fetch(url, {
  method: "POST",
  mode: "cors",
  cache: "no-cache",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(user)
})
```
**HTTP Details**:
- URL: `http://localhost:3000/api/users/signup` (hardcoded)
- Method: POST
- Headers: `Content-Type: application/json`
- CORS: enabled
- Credentials: same-origin

**Step 5 - Response Processing** (lines 199-217):
```javascript
.then(res => res.json())
.then(data => {
  const { errors, user } = data;
  
  if (errors) {
    for (let key in errors) {
      this[key].errors.push(errors[key]);
    }
    return;
  }
  
  if (user) {
    Cookies.create("new_user", this.email.value, null);
    router.push("/login");
  }
});
```
**Expected Response Structure**:
```json
{
  "errors": { "email": "string", "name": "string", "password": "string" },
  "user": { /* user object */ }
}
```

**Step 6 - Success Actions**:
- Store email in `new_user` cookie (no expiration)
- Redirect to `/login` page
- **Note**: User NOT automatically logged in after registration

### User Login Flow

**Entry Point**: `src/views/Login.vue`

**Step 1 - Email Pre-fill** (lines 108-111):
```javascript
email: {
  value: Cookies.read("new_user"),
  errors: []
}
```
- Email field pre-populated from `new_user` cookie if present

**Step 2 - Form Validation** (same pattern as registration, lines 119-143)

**Step 3 - Login API Call** (lines 150-166):
```javascript
const user = {
  email: this.email.value,
  password: this.password.value
};

const url = "http://localhost:3000/api/users/login";

fetch(url, {
  method: "POST",
  mode: "cors",
  cache: "no-cache",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ user })
})
```
**Payload Difference**: Login wraps credentials in `{user: {...}}` object (line 165), registration does not

**Step 4 - Success Flow** (lines 167-184):
```javascript
.then(data => {
  const { errors, user } = data;
  
  if (errors) {
    for (let key in errors) {
      this[key].errors.push(errors[key]);
    }
    return;
  }
  
  if (user) {
    const { token, ...userData } = user;
    Cookies.create("token", token, null);
    console.log(userData, token);
    
    this.$store.dispatch("LOGIN", userData);
    router.push("/");
  }
});
```
**Expected Response**:
```json
{
  "user": {
    "token": "JWT_STRING",
    "name": "string",
    "surname": "string",
    "email": "string"
    // ...other user fields
  }
}
```

**Step 5 - Session Establishment**:
- JWT token extracted from response
- Token stored in `token` cookie
- User data (minus token) stored in Vuex store via `LOGIN` action
- Redirect to home page (`/`)

### Application Startup Flow

**Entry Point**: `src/main.js`

**Step 1 - App Bootstrap** (lines 1-14):
```javascript
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { sync } from "vuex-router-sync";
import Argon from "./plugins/argon-kit";

sync(store, router);

Vue.config.productionTip = false;
Vue.use(Argon);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
```
- Vuex store synced with router state via `vuex-router-sync`
- Argon plugin loaded (registers global components, directives, VueLazyload)

**Step 2 - Header Component Mount** (`src/layout/AppHeader.vue`, lines 74-82):
```javascript
created() {
  const token = Cookies.read("token");
  
  if (token) {
    const user = jwtDecode(token);
    this.$store.dispatch("LOGIN", user);
  }
}
```
- On header creation, check for JWT token in cookies
- If found, decode token and restore user session
- **Security Risk**: No token validation against backend; expired/tampered tokens accepted

### Logout Flow

**Trigger**: User clicks "Logout" link in header

**Step 1 - Token Removal** (`src/layout/AppHeader.vue`, lines 86-91):
```javascript
logout(e) {
  e.preventDefault();
  console.log(Cookies.remove("token"));
  return this.$store.dispatch("LOGOUT");
}
```

**Step 2 - Vuex Store Update** (`src/store/index.js`, lines 12-13):
```javascript
mutations: {
  LOGOUT: state => (state.user = null)
}
```
- User object set to null in store
- Component reactivity triggers header to show Login/Register links

## Integration Points

### External Backend API

**Base URL**: `http://localhost:3000` (hardcoded in views)

**Endpoints**:

1. **POST /api/users/signup**
   - **Source**: `src/views/Register.vue`, line 187
   - **Payload**: `{name, surname, email, password}`
   - **Expected Response**: `{errors?: {field: string}, user?: {...}}`
   - **Purpose**: User registration

2. **POST /api/users/login**
   - **Source**: `src/views/Login.vue`, line 154
   - **Payload**: `{user: {email, password}}`
   - **Expected Response**: `{errors?: {field: string}, user?: {token, name, surname, email, ...}}`
   - **Purpose**: User authentication

**API Characteristics**:
- No authentication headers on any request
- CORS enabled
- Credentials mode: `same-origin`
- No timeout configuration
- No retry logic
- No loading states during fetch

**Backend Compatibility** (`README.md`, lines 3-4):
- Designed to work with Express, Flask, or Laravel backends
- Backend must be separately cloned and run
- Default assumption: backend running on `localhost:3000`

### External Services (Marketing/Social)

**Social Login Buttons** (`src/views/Login.vue`, lines 27-39):
```vue
<base-button type="neutral">
  <img slot="icon" src="img/icons/common/github.svg" />
  Github
</base-button>

<base-button type="neutral">
  <img slot="icon" src="img/icons/common/google.svg" />
  Google
</base-button>
```
- **Status**: UI-only, no functionality implemented
- **Location**: Login and Register pages

**External Links**:
- AppSeed App Generator: `https://appseed.us/fullstack-apps-generator/vuejs` (multiple locations in `Landing.vue`)
- Creative Tim: `https://www.creative-tim.com` (`src/layout/AppFooter.vue`)
- Social Media:
  - Twitter: `https://twitter.com/webappseed` (`AppFooter.vue`, line 72)
  - Facebook: `https://www.facebook.com/webappseed` (`AppFooter.vue`, line 80)
  - GitHub: `https://github.com/rosoftdeveloper/appseed` (`AppFooter.vue`, line 88)

### Third-Party Libraries

**NPM Dependencies** (`package.json`, lines 11-24):
```json
{
  "bootstrap-vue": "^2.0.0-rc.11",
  "connect": "^3.6.6",
  "flatpickr": "^4.5.1",
  "jwt-decode": "^2.2.0",
  "nouislider": "^11.1.0",
  "serve-static": "^1.13.2",
  "vue": "^2.5.16",
  "vue-flatpickr-component": "^7.0.4",
  "vue-lazyload": "^1.2.6",
  "vue-router": "^3.0.1",
  "vue2-transitions": "^0.2.3",
  "vuex": "^3.1.0",
  "vuex-router-sync": "^5.0.0"
}
```

**Critical Dependencies**:
- **jwt-decode**: Client-side JWT decoding (no validation)
- **vuex**: State management
- **vue-router**: Routing
- **bootstrap-vue**: UI components
- **vue-lazyload**: Image lazy loading

**External CDN Resources** (`public/index.html`, line 12):
```html
<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet">
```
- Google Fonts: Open Sans (300, 400, 600, 700 weights)

### Internal Plugin System

**Global Components Registration** (`src/plugins/globalComponents.js`):
- Badge, BaseAlert, BaseButton, BaseCheckbox, BaseInput, BasePagination, BaseProgress, BaseRadio, BaseSlider, BaseSwitch, Card, Icon
- All registered globally via `Vue.component()`

**Global Directives** (`src/plugins/globalDirectives.js`):
- `v-click-outside`: Detects clicks outside element boundaries (`src/directives/click-ouside.js`)
- Used for dropdown menus and modals

## Key Workflows

### Complete User Journey: Registration → Login → Session

**Workflow Entry**: User navigates to `/register`

1. **Registration Page Load**
   - Component: `src/views/Register.vue`
   - Form fields rendered: name, email, password
   - Validation rules attached to each field

2. **Form Submission**
   - User fills fields and clicks "Create account"
   - Client validates: name, email (regex), password required
   - If valid: POST to `http://localhost:3000/api/users/signup`

3. **Backend Response Handling**
   - **Success**: Email stored in `new_user` cookie → Redirect to `/login`
   - **Error**: Display field-specific errors inline

4. **Login Page Load**
   - Component: `src/views/Login.vue`
   - Email pre-filled from `new_user` cookie
   - User enters password

5. **Login Submission**
   - Validate email + password
   - POST to `http://localhost:3000/api/users/login`

6. **Session Establishment**
   - JWT token extracted from response
   - Token stored in `token` cookie (no expiration)
   - User data dispatched to Vuex: `this.$store.dispatch("LOGIN", userData)`
   - Redirect to home page (`/`)

7. **App Navigation**
   - Header displays: `{user.name} {user.surname}` with Logout link
   - User can navigate all pages
   - No protected routes - Profile, Landing, Components all accessible

8. **Logout**
   - Click "Logout" → `token` cookie removed → Vuex user set to null
   - Header shows Login/Register links again

### Session Restoration Workflow

**Trigger**: User refreshes page or returns to app

1. **App Bootstrap** (`src/main.js`)
2. **Router Initializes** - Loads current route
3. **AppHeader Component Created** (`src/layout/AppHeader.vue`, line 74)
4. **Token Check**:
   ```javascript
   const token = Cookies.read("token");
   if (token) {
     const user = jwtDecode(token);
     this.$store.dispatch("LOGIN", user);
   }
   ```
5. **If Token Exists**: User session restored, header shows logged-in state
6. **If No Token**: User remains logged out

**Critical Gap**: No backend validation of token on restoration - expired/invalid tokens accepted

### Component Communication Workflow

**Pattern**: Event-driven prop/emit architecture

**Example - BaseInput Component** (`src/components/BaseInput.vue`, lines 120-133):
```javascript
computed: {
  listeners() {
    return {
      ...this.$listeners,
      input: this.updateValue,
      focus: this.onFocus,
      blur: this.onBlur
    };
  }
},
methods: {
  updateValue(evt) {
    let value = evt.target.value;
    this.$emit("input", value);
  }
}
```
- Parent passes `v-model` → Triggers `input` event → Parent state updated
- Used in Login/Register forms: `<base-input v-model="email.value">`

## Domain Entities

### User Entity

**Primary Model**: User object in Vuex store and JWT token

**Structure** (inferred from `src/views/Login.vue`, `src/views/Register.vue`, `src/layout/AppHeader.vue`):
```javascript
{
  name: string,        // Required, displayed in header
  surname: string,     // Required (defaults to " "), displayed in header
  email: string,       // Required, unique identifier
  token: string        // JWT, stored separately in cookie
  // Other fields may exist in backend response
}
```

**Lifecycle States**:
1. **Anonymous**: No token cookie, Vuex store user = null
2. **Registered**: User created in backend, email in `new_user` cookie, not logged in
3. **Authenticated**: Token in cookie, user object in Vuex store
4. **Session-Restored**: Token decoded on app load, user in store

**State Transitions** (`src/store/index.js`, lines 10-20):
```javascript
mutations: {
  LOGIN: (state, user) => Vue.set(state, "user", user),
  LOGOUT: state => (state.user = null)
},
actions: {
  LOGIN({ commit }, payload) {
    commit("LOGIN", payload);
  },
  LOGOUT({ commit }) {
    commit("LOGOUT");
  }
}
```

**Invariants**:
- User always has name and surname (even if surname is empty space)
- Email uniqueness enforced by backend (assumed)
- Token presence determines authentication state
- User object never contains token (extracted before storage)

### Form Field Entity

**Pattern**: Consistent across Login and Register views

**Structure**:
```javascript
{
  value: string | null,
  errors: string[]
}
```

**Examples**:
- `email: { value: null, errors: [] }`
- `password: { value: null, errors: [] }`
- `name: { value: null, errors: [] }`

**Validation Pattern**:
1. Clear errors array: `this.email.errors = []`
2. Run validation checks
3. Push error messages to array: `this.email.errors.push("Email required.")`
4. Display errors in template: `<ul><li v-for="error in email.errors">{{error}}</li></ul>`

### Cookie Entity

**Managed by** `src/utils/Cookies.js`

**Structure**:
```javascript
{
  name: string,      // Cookie name
  value: string,     // Cookie value
  seconds: number | null  // Expiration (null = session cookie becomes permanent)
}
```

**API**:
```javascript
Cookies.create(name, value, seconds)  // Returns true
Cookies.read(name)                     // Returns string | null
Cookies.remove(name)                   // Calls create with -1 seconds
```

**Storage Location**: `document.cookie` (browser cookies)

**Used Cookies**:
1. `token`: JWT authentication token (no expiration)
2. `new_user`: Email from registration (no expiration, for login pre-fill)

## Constraints

### Technology Lock-ins

**Vue.js Version Constraint** (`package.json`, line 18):
- **Version**: Vue 2.5.16
- **Impact**: Vue 3 migration would require major refactor (Composition API, breaking changes)
- **Ecosystem Compatibility**: Tied to Vue 2 ecosystem (Bootstrap-Vue 2.x, Vue Router 3.x)

**Node/Build Toolchain**:
- Vue CLI 3.0.0-rc.10 (release candidate, not stable)
- Node.js >= 6.x required (`README.md`, line 11)
- Babel, Webpack abstracted through Vue CLI

**Browser Compatibility** (`.browserslistrc`):
```
> 1%
last 2 versions
not ie <= 8
```
- No IE8 or lower support
- Targets browsers with >1% market share
- Last 2 versions of all browsers

**Backend Coupling**:
- Hardcoded backend URL: `http://localhost:3000` in 2 locations
- **Change Impact**: Requires source code modification + rebuild for different environments
- No environment variable configuration

**SCSS/Styling**:
- 130 SCSS files (custom Bootstrap 4 theme)
- Node-sass dependency (deprecated, should migrate to dart-sass)
- Heavy customization makes Bootstrap upgrades difficult

### Performance Constraints

**Bundle Size**:
- 244 files, 134,770 total lines
- Large vendor dependencies (Bootstrap-Vue, Vuex, Router, Transitions)
- No code splitting implemented (all JS in single bundle)

**Image Assets**:
- 9 JPG files (img/theme/*.jpg)
- 8 PNG files
- 5 SVG files
- Lazy loading enabled via `vue-lazyload` plugin

**Font Loading**:
- External Google Fonts (blocking CSS request)
- Font Awesome loaded from local vendor folder
- Nucleo icon set in vendor folder

### Security Constraints

**Authentication Vulnerabilities**:

1. **No Token Expiration Checking** (`src/layout/AppHeader.vue`, lines 77-81):
   ```javascript
   const token = Cookies.read("token");
   if (token) {
     const user = jwtDecode(token);  // No expiration check
     this.$store.dispatch("LOGIN", user);
   }
   ```
   - Expired tokens accepted
   - Tampered tokens not validated
   - No backend verification on session restore

2. **Plaintext Password Transmission**:
   - Passwords sent as plaintext in JSON body
   - Relies on HTTPS at deployment (not enforced in code)

3. **CORS Configuration**:
   - `mode: "cors"` in fetch requests
   - Credentials: `same-origin` (cookies not sent cross-origin)
   - Backend must whitelist frontend origin

4. **XSS Risks**:
   - User data rendered without sanitization in header: `{{ user.name }}`
   - Vue.js escapes by default, but risk if backend returns HTML

5. **Cookie Security**:
   - No `HttpOnly` flag (JavaScript can read token)
   - No `Secure` flag (works on HTTP)
   - No `SameSite` attribute (CSRF risk)

**Compliance Gaps**:
- **GDPR**: No cookie consent banner, no privacy policy beyond dummy link
- **CCPA**: No "Do Not Sell My Data" option
- **PCI-DSS**: Not applicable (no payment processing)
- **HIPAA**: Not applicable (no health data)

### Deployment Constraints

**Production Build** (`package.json`, line 7):
```json
"build": "vue-cli-service build"
```
- Outputs to `dist/` directory
- Static file hosting required
- No server-side rendering (SSR)

**Serving Production Build** (`serveme.js`):
```javascript
var express = require("express");
var serveStatic = require("serve-static");

var app = express();
app.use(serveStatic("dist", { index: ["index.html"] }));
app.listen(9001);
```
- Simple Express server for demo
- Port 9001 hardcoded
- No environment variables
- **Not Production-Ready**: No HTTPS, logging, error handling, process management

**Backend Dependency**:
- Frontend useless without running backend
- Backend must implement exact API contract
- No mock API for frontend-only development

## Technical Debt

### Hardcoded Values

**Backend URLs** (2 instances):
1. `src/views/Login.vue`, line 154: `const url = "http://localhost:3000/api/users/login";`
2. `src/views/Register.vue`, line 187: `const url = "http://localhost:3000/api/users/signup";`

**Solution Required**: Environment-based configuration file or `.env` variables

**Port Numbers**:
- Dev server: 8080 (`package.json`, line 6)
- Production server: 9001 (`serveme.js`, line 5)

**Default Values**:
- Empty surname: `surname: " "` (`src/views/Register.vue`, line 182)

### Debug Code in Production

**Console Statements** (8 instances):
1. `src/layout/AppHeader.vue`, line 89: `console.log(Cookies.remove("token"));`
2. `src/views/Login.vue`, line 181: `console.log(userData, token);`
3. `src/views/Register.vue`, line 164: `console.log(" *** Input errors");`
4. Commented-out logs in Register.vue (lines 168-170)
5. `src/views/components/Icons.vue`, line 74: `console.log(evt);`

**Risk**: ESLint configured to error on `console` in production (`.eslintrc.js`, line 8), but logs remain in code

### Code Duplication

**Validation Logic**:
- Email validation regex duplicated in Login.vue and Register.vue
- Form validation pattern repeated with slight variations
- **Refactor Needed**: Extract to shared validation utilities

**Fetch Patterns**:
- Fetch configuration duplicated in Login and Register
- Error handling pattern repeated
- **Refactor Needed**: API service layer with shared fetch wrapper

**Component Patterns**:
- BaseInput, BaseCheckbox, BaseRadio have similar boilerplate
- Random ID generation pattern repeated: `Math.random().toString(16).slice(2)`

### Dead/Unused Code

**Alternative Router** (`src/starterRouter.js`):
- Defines minimal routing for "Starter" layout
- Not imported in `main.js` (main router used instead)
- **Purpose Unclear**: Possibly template for new projects

**Unused Dependencies**:
- `connect` (line 13, package.json) - only used in serveme.js
- `lite-server` (line 31, package.json) - devDependency, not referenced in scripts

**Non-Functional UI Elements**:
- Social login buttons (GitHub, Google) - no event handlers
- "Forgot password?" link - href="#", no functionality
- Privacy Policy link in Register - href="#", no functionality
- Contact form in Landing.vue - Submit button has no handler

### Deprecated Dependencies

**Node-Sass** (`package.json`, line 32):
- **Status**: Deprecated as of October 2020
- **Impact**: May fail on newer Node.js versions
- **Solution**: Migrate to `sass` (Dart Sass)

**Vue CLI RC Version** (`package.json`, lines 27-29):
- Using release candidate versions (3.0.0-rc.10)
- Not stable release
- **Impact**: Potential bugs, no LTS support

**Bootstrap-Vue RC** (`package.json`, line 12):
- Version 2.0.0-rc.11 (release candidate)
- Current stable version is 2.23.1
- **Impact**: Missing features, bug fixes

### Missing Error Handling

**Network Failures**:
- No `.catch()` on fetch promises in Login.vue or Register.vue
- Uncaught network errors will crash application
- No retry logic

**Malformed Responses**:
- Assumes backend always returns `{errors, user}` structure
- No validation of response schema
- Will fail silently if response structure changes

**Token Decode Failures**:
- `jwtDecode(token)` can throw exception if token malformed
- Not wrapped in try-catch (`src/layout/AppHeader.vue`, line 80)

**Example from Login.vue** (lines 167-184):
```javascript
.then(res => res.json())
.then(data => {
  const { errors, user } = data;
  if (errors) { /* ... */ }
  if (user) { /* ... */ }
});
// NO .catch() handler
```

### Missing Features

**Loading States**:
- No spinner/loading indicator during API calls
- Form buttons remain enabled during submission (can double-submit)

**Input Validation**:
- No real-time validation (only on submit)
- Password strength shown as static "strong" text (not calculated)
- No password confirmation field

**Accessibility**:
- Missing ARIA labels on many form fields
- Modal focus trap not implemented
- Keyboard navigation incomplete

**Routing**:
- No 404 page
- No route guards (all pages public)
- No navigation guards (can't prevent navigation)

**State Persistence**:
- User state lost on refresh if token expires
- No background token refresh mechanism

## Assumptions

### Explicit Assumptions (Verified in Code)

1. **Backend API Contract** (`README.md`, lines 3-9):
   - Backend expected at `localhost:3000`
   - Endpoints: `/api/users/login`, `/api/users/signup`
   - Backend must support CORS for `http://localhost:8080` origin
   - Backend returns JWT in `user.token` field

2. **JWT Structure** (`src/layout/AppHeader.vue`, line 80):
   - Token can be decoded by `jwt-decode` library
   - Decoded token contains user fields (name, surname, email)
   - Token is self-contained (no additional lookup needed)

3. **User Attributes** (`src/layout/AppHeader.vue`, line 54):
   - All users have `name` and `surname` properties
   - Both are displayed in header when logged in

4. **Cookie Behavior**:
   - Cookies persist across sessions (no expiration)
   - Browser allows JavaScript cookie access
   - Cookies shared between localhost:8080 (dev) and localhost:3000 (backend)

5. **Browser Capabilities**:
   - Modern browser with ES6+ support
   - Fetch API available
   - Cookies enabled
   - JavaScript enabled

### Inferred Assumptions (Marked as Inferences)

1. **HTTPS in Production** (INFERENCE):
   - Code sends plaintext passwords
   - Assumes HTTPS deployed, but not enforced in code

2. **Backend Validation** (INFERENCE):
   - Frontend validation duplicates backend validation
   - Backend enforces email uniqueness, password strength
   - Backend validates JWT signatures (frontend does not)

3. **Token Expiration** (INFERENCE):
   - JWT contains `exp` claim
   - Backend validates expiration
   - Frontend does not check expiration

4. **User Roles/Permissions** (INFERENCE):
   - No role-based access control in frontend
   - All authenticated users have same permissions
   - Backend may enforce roles

5. **Data Retention** (INFERENCE):
   - No explicit data deletion/export features
   - Backend handles GDPR data deletion requests
   - User profiles permanent (no self-serve delete)

6. **Scalability** (INFERENCE):
   - Single-server deployment assumed (no load balancing logic)
   - No client-side caching strategy
   - Full page reload on navigation

7. **Multi-Tenancy** (INFERENCE):
   - Single-tenant application
   - No organization/workspace concept
   - One user pool for entire application

## Open Questions

### Authentication & Authorization

1. **JWT Expiration**: 
   - What is the token expiration time configured in backend?
   - Should frontend auto-refresh tokens before expiration?
   - How to handle expired token scenarios?

2. **Token Validation**:
   - Should frontend validate JWT signature?
   - Should session restoration ping backend to verify token?
   - What's the backend's token revocation strategy?

3. **Password Requirements**:
   - Backend password policy? (min length, complexity rules)
   - Is "password strength: strong" meant to be dynamic?
   - Password reset flow - fully unimplemented?

4. **Social Login**:
   - GitHub/Google buttons - planned feature or just UI mockup?
   - OAuth provider configuration?
   - Backend endpoints for OAuth callbacks?

5. **Multi-Factor Authentication**:
   - Any plans for 2FA/MFA?
   - TOTP support?

### Backend Integration

6. **API Versioning**:
   - Current API version (`/api/users/...`)?
   - Versioning strategy for breaking changes?

7. **Error Response Format**:
   - Is `{errors: {field: string}}` the standard format?
   - HTTP status codes used? (400, 401, 422?)
   - Rate limiting headers?

8. **Payload Validation**:
   - Why does login wrap credentials in `{user: {email, password}}` but registration doesn't?
   - Intentional design or inconsistency?

9. **User Data Schema**:
   - What other fields exist in user object beyond name, surname, email?
   - Profile picture URL?
   - User metadata (created_at, last_login, etc.)?

10. **Environment Configuration**:
    - Recommended way to configure backend URL for staging/production?
    - Environment variables? Config file?

### Business Logic

11. **Email Confirmation**:
    - Is email verification required after registration?
    - Any email confirmation flow?

12. **Username vs Email**:
    - "name" field labeled as "Name" or "Username"?
    - Can users change their name/email after registration?

13. **Profile Management**:
    - Profile page shows static data - is edit profile implemented?
    - Avatar upload functionality?
    - Settings page planned?

14. **Remember Me Checkbox**:
    - Checkbox exists in Login.vue but not connected to logic
    - Intended to control token expiration?
    - Separate session vs persistent token?

### Technical Architecture

15. **State Management**:
    - Why Vuex for single user object? Overkill or future expansion planned?
    - Other state planned (notifications, app config, etc.)?

16. **Code Splitting**:
    - Why no lazy-loaded routes?
    - Performance concerns with single bundle?

17. **Alternative Router**:
    - Purpose of `starterRouter.js`?
    - Template for custom projects?
    - Should it be removed?

18. **Component Library**:
    - Base components (BaseButton, BaseInput, etc.) - internal library or published package?
    - Versioning strategy for design system?

### Deployment & Operations

19. **Monitoring**:
    - Error tracking service (Sentry, Rollbar)?
    - Analytics (Google Analytics, Mixpanel)?

20. **CI/CD**:
    - Deployment pipeline?
    - Automated testing (none visible in codebase)?

21. **Production Serving**:
    - `serveme.js` for production or just demo?
    - Recommended production hosting (Netlify, S3, Nginx)?

22. **HTTPS Enforcement**:
    - Backend HTTPS endpoints configured?
    - Frontend redirect HTTP to HTTPS?

### Compliance & Legal

23. **Privacy Policy**:
    - Actual privacy policy document location?
    - Cookie consent implementation plan?

24. **Terms of Service**:
    - TOS document for production?
    - User agreement acceptance flow?

25. **Data Retention**:
    - User data retention policy?
    - Account deletion process?

### Testing

26. **Test Coverage**:
    - No test files visible - testing strategy?
    - Unit tests for components?
    - E2E tests for workflows?

27. **API Mocking**:
    - Mock backend for frontend development/testing?
    - MSW, JSON-server, or similar?

---

**Document Generated**: Based on codebase analysis of https://github.com/app-generator/vuejs-argon-design-system.git

**Codebase Stats**: 244 files, 134,770 lines, 56 Vue components, 13 JavaScript files

**Analysis Confidence**: High - All findings cited with file paths and line numbers from actual source code