# EVision Software Requirements Specification

## 1. Document Control

### 1.1 Product

EVision is an enterprise SaaS platform for managing EV charging networks. It supports charging station monitoring, live session tracking, network analytics, user administration, alerts, station health monitoring, and map-based station discovery.

### 1.2 Version

Version: 1.0

Status: Draft for approval

Date: 2026-06-29

### 1.3 Intended Audience

- Product owners and business stakeholders
- Engineering leads and software engineers
- UI/UX designers
- QA engineers
- DevOps and deployment engineers
- Security reviewers

### 1.4 Approval Gate

This document represents Step 1 of the delivery workflow. Implementation, LLD, schemas, API contracts, folder generation, and coding must not begin until this SRS is reviewed and approved.

## 2. Product Overview

### 2.1 Purpose

EVision enables EV charging network operators to run day-to-day charging infrastructure operations from a single web application. The platform provides a real-time operational view of stations, sessions, alerts, revenue, energy usage, and network health.

### 2.2 Product Positioning

EVision should feel like a production-grade SaaS operations console, not a tutorial project. It should support professional workflows for users responsible for monitoring charging infrastructure, responding to station issues, analyzing performance, and managing operators.

### 2.3 Business Goals

- Improve charging network visibility.
- Reduce response time for offline or degraded stations.
- Support operational decisions through analytics.
- Enable role-based team access.
- Provide scalable foundations for real-world EV network growth.
- Support real-time awareness of charging activity and station health.

### 2.4 Success Metrics

- Operators can identify offline stations within seconds.
- Dashboard KPIs load quickly and remain understandable at a glance.
- Users can search, filter, and inspect stations without workflow friction.
- Analytics provide clear trends for energy, revenue, usage, and availability.
- Real-time alerts appear without manual page refresh.
- Admins can safely manage users and roles.
- The codebase remains modular, testable, and maintainable.

## 3. Scope

### 3.1 In Scope

- Authentication with login, logout, refresh tokens, protected routes, and role-based access.
- SaaS dashboard with operational KPIs, recent alerts, recent sessions, quick actions, and top stations.
- Interactive station map using React Leaflet and Leaflet.
- Charging station management with list, details, create, update, delete, search, sort, pagination, and filters.
- Charging session management with live and historical sessions.
- Analytics dashboards using Recharts.
- Real-time notifications through Socket.IO.
- User management for admins.
- Settings and profile screens.
- MongoDB data modeling through Mongoose.
- Realistic seed data for stations, users, and sessions.
- REST APIs for all major resources.
- Frontend and backend environment configuration.
- README with setup instructions in a later step.

### 3.2 Out of Scope for Initial Release

- Actual charger hardware integration.
- Payment gateway processing.
- OCPP protocol implementation.
- Native mobile applications.
- Multi-tenant billing and subscription plans.
- Advanced route optimization using external paid map APIs.
- Real identity provider integrations such as SSO, SAML, or OAuth.
- Production observability tooling beyond baseline logging and error handling.

### 3.3 Future Enhancements

- OCPP integration.
- Predictive maintenance.
- Fleet management.
- Pricing rules and tariff management.
- Demand forecasting.
- Multi-tenant organization hierarchy.
- Webhook integrations.
- Native mobile apps for field technicians.

## 4. Stakeholders and User Roles

### 4.1 Stakeholders

- Network operations team
- Regional charging station managers
- Administrators
- Field maintenance teams
- Business analysts
- Executive stakeholders

### 4.2 Roles

#### Admin

Admins have full platform access. They can manage users, roles, settings, stations, sessions, analytics, and notifications.

#### Operator

Operators can monitor stations, manage stations, view sessions, respond to alerts, and inspect analytics. Operators cannot manage users or global security settings.

#### Viewer

Viewers have read-only access to dashboard, stations, sessions, analytics, notifications, and map views. Viewers cannot create, update, or delete operational records.

### 4.3 Permission Matrix

| Capability | Admin | Operator | Viewer |
| --- | --- | --- | --- |
| Login/logout | Yes | Yes | Yes |
| View dashboard | Yes | Yes | Yes |
| View stations | Yes | Yes | Yes |
| Create station | Yes | Yes | No |
| Update station | Yes | Yes | No |
| Delete station | Yes | No | No |
| View sessions | Yes | Yes | Yes |
| Export sessions | Yes | Yes | No |
| View analytics | Yes | Yes | Yes |
| View notifications | Yes | Yes | Yes |
| Mark notifications as read | Yes | Yes | No |
| Manage users | Yes | No | No |
| Manage roles | Yes | No | No |
| Update profile | Yes | Yes | Yes |
| Update global settings | Yes | No | No |

## 5. User Personas

### 5.1 Network Operations Manager

Needs a high-level view of network health, revenue, energy delivery, station availability, and active issues. Uses dashboard and analytics most frequently.

### 5.2 Charging Network Operator

Monitors active sessions, station status, alerts, and map activity throughout the day. Needs fast search, filtering, and clear station state indicators.

### 5.3 Field Maintenance Coordinator

Uses station details, maintenance history, alerts, and station health status to prioritize field work.

### 5.4 Business Analyst

Uses analytics to understand city-wise usage, energy trends, peak times, revenue patterns, station utilization, and charging success rate.

### 5.5 System Administrator

Manages users, roles, access, and platform settings.

## 6. Assumptions and Dependencies

### 6.1 Assumptions

- Users access EVision through modern desktop, tablet, and mobile browsers.
- MongoDB Atlas is used for hosted database storage.
- The frontend is deployed to Vercel.
- The backend is deployed to Render.
- Real-time features use Socket.IO over WebSocket with polling fallback.
- Initial station and session data may be generated through seed scripts.
- Map rendering depends on Leaflet-compatible map tiles.

### 6.2 Dependencies

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Redux Toolkit
- TanStack Query
- React Hook Form
- Zod
- Axios
- React Leaflet and Leaflet
- Recharts
- Framer Motion
- Socket.IO Client
- Node.js
- Express.js
- Socket.IO
- Mongoose
- MongoDB
- JWT
- Bcrypt

## 7. Functional Requirements

### 7.1 Authentication and Authorization

#### FR-AUTH-001 Login

The system shall allow users to log in with email and password.

Acceptance criteria:

- Users can submit credentials through a login form.
- Invalid credentials show a clear error message.
- Successful login stores access state securely on the client.
- Authenticated users are routed to the dashboard.

#### FR-AUTH-002 Logout

The system shall allow authenticated users to log out.

Acceptance criteria:

- Logout clears client authentication state.
- Logout invalidates or rotates refresh token state on the server where applicable.
- The user is redirected to the login page.

#### FR-AUTH-003 Refresh Token

The system shall support access token renewal using refresh tokens.

Acceptance criteria:

- Expired access tokens can be refreshed without forcing login.
- Invalid refresh tokens require reauthentication.
- Refresh token flow must not expose sensitive token data unnecessarily.

#### FR-AUTH-004 Protected Routes

The system shall prevent unauthenticated access to protected pages.

Acceptance criteria:

- Unauthenticated users are redirected to login.
- Authenticated users cannot access the login page unless they log out.

#### FR-AUTH-005 Role-Based Access Control

The system shall enforce Admin, Operator, and Viewer permissions.

Acceptance criteria:

- UI actions are hidden or disabled based on role.
- Backend APIs enforce the same permissions independently.
- Unauthorized requests return appropriate HTTP errors.

### 7.2 Dashboard

#### FR-DASH-001 KPI Cards

The dashboard shall display operational KPI cards.

Required KPIs:

- Total stations
- Online stations
- Offline stations
- Charging sessions
- Revenue
- Energy delivered
- Carbon saved
- Average charging time
- Peak usage

Acceptance criteria:

- KPI values are fetched from the backend.
- KPI cards show loading and error states.
- KPI cards are responsive across desktop, tablet, and mobile.

#### FR-DASH-002 Operational Widgets

The dashboard shall display quick actions, recent alerts, recent charging sessions, and top performing stations.

Acceptance criteria:

- Recent alerts show severity, station, timestamp, and status.
- Recent sessions show station, user or vehicle context, energy, cost, and status.
- Top stations show utilization, revenue, energy, and availability.
- Quick actions route users to common workflows.

### 7.3 Interactive Map

#### FR-MAP-001 Station Map

The system shall display charging stations on an interactive map.

Acceptance criteria:

- Stations render as map markers.
- Available stations use green markers.
- Busy stations use orange markers.
- Offline stations use red markers.
- Marker popups show station details.

#### FR-MAP-002 Map Controls

The map shall support zoom controls, fullscreen mode, current location, and responsive layout.

Acceptance criteria:

- Users can zoom in and out.
- Users can enter and exit fullscreen mode.
- Users can center the map on their current location if browser permission is granted.
- Map layout remains usable on mobile and desktop.

#### FR-MAP-003 Station Search and Filtering

The map shall support searching and filtering stations.

Acceptance criteria:

- Users can search by city.
- Users can search by station name.
- Users can filter by station status, connector type, availability, and capacity where data exists.
- Search results update map markers and station list context.

#### FR-MAP-004 Nearby Stations

The system shall allow users to find nearby charging stations.

Acceptance criteria:

- If location permission is granted, nearby stations are calculated relative to user coordinates.
- Results show distance and station availability.
- Users can select a nearby station to view map details.

#### FR-MAP-005 Route, Radius, and Vehicle Animation

The map shall support route drawing, charging radius visualization, and animated vehicle movement.

Acceptance criteria:

- Users can draw or display a route to a selected station.
- Users can display a charging radius around a location or station.
- Vehicle movement animation can be shown along a route.
- These features degrade gracefully if required location data is unavailable.

### 7.4 Charging Stations

#### FR-STN-001 Station List

The system shall provide a charging station list.

Acceptance criteria:

- List supports pagination.
- List supports sorting.
- List supports search.
- List supports filtering by status, city, connector type, and availability.

#### FR-STN-002 Station CRUD

The system shall support creating, reading, updating, and deleting charging stations based on permissions.

Acceptance criteria:

- Admins and Operators can create and update stations.
- Only Admins can delete stations.
- Viewers can view stations only.
- Forms validate input before submission.
- Server-side validation protects the API.

#### FR-STN-003 Station Details

The system shall provide a station details page.

Acceptance criteria:

- Details include location, status, connector types, charging capacity, utilization, availability, and maintenance history.
- Details show recent sessions for the station.
- Details show station health indicators.

### 7.5 Charging Sessions

#### FR-SES-001 Live Charging Sessions

The system shall show currently active charging sessions.

Acceptance criteria:

- Live sessions update through real-time events or background refetching.
- Users can see status, station, vehicle, energy delivered, duration, and cost.

#### FR-SES-002 Charging History

The system shall provide historical charging sessions.

Acceptance criteria:

- History supports pagination, search, sorting, and filters.
- Filters include date range, station, status, city, and connector where applicable.

#### FR-SES-003 Session Details

The system shall provide a detailed session view.

Acceptance criteria:

- Details include station, vehicle, user context, duration, cost, energy delivered, status, start time, and end time.

#### FR-SES-004 Export CSV

The system shall allow authorized users to export session data as CSV.

Acceptance criteria:

- Admins and Operators can export.
- Viewers cannot export.
- Export respects selected filters where applicable.

### 7.6 Analytics

#### FR-ANL-001 Analytics Charts

The analytics module shall display reusable responsive charts.

Required charts:

- Revenue trend
- Energy consumption
- Charging sessions
- Peak usage
- Station utilization
- Charging success rate
- Average charging time
- Connector distribution
- Monthly revenue
- Revenue vs energy
- Carbon saved
- Top stations
- City-wise usage
- Station availability

Acceptance criteria:

- Charts use Recharts.
- Charts support loading states.
- Charts support empty states.
- Charts are responsive.
- Chart components are reusable.

#### FR-ANL-002 Analytics Filters

Analytics shall support useful filtering.

Acceptance criteria:

- Users can filter by date range.
- Users can filter by city or station where relevant.
- Filter state updates chart data consistently.

### 7.7 Notifications

#### FR-NOT-001 Real-Time Notifications

The system shall provide real-time notifications.

Notification types:

- Station offline
- Charging completed
- Maintenance due
- High demand
- New operator

Acceptance criteria:

- New notifications appear without page refresh.
- Notifications show type, severity, message, timestamp, and read state.
- Authorized users can mark notifications as read.

#### FR-NOT-002 Notification Center

The system shall provide a notifications page.

Acceptance criteria:

- Notifications support search, filtering, and pagination.
- Users can filter by severity, type, and read status.

### 7.8 User Management

#### FR-USR-001 Admin User List

Admins shall be able to view platform users.

Acceptance criteria:

- User list supports search, pagination, and filters.
- User list shows name, email, role, status, and last active date.

#### FR-USR-002 Manage Users

Admins shall be able to create, update, disable, and assign roles to users.

Acceptance criteria:

- Only Admins can access user management actions.
- User forms validate input.
- Role changes take effect in authorization decisions.

### 7.9 Settings and Profile

#### FR-SET-001 Theme Settings

The system shall support light and dark mode.

Acceptance criteria:

- Users can switch theme mode.
- Theme choice persists across sessions.
- UI remains accessible in both modes.

#### FR-SET-002 Notification Settings

Users shall be able to configure notification preferences.

Acceptance criteria:

- Users can toggle notification categories where supported.
- Preferences persist to backend or local state depending on design decision in LLD.

#### FR-SET-003 Profile Settings

Users shall be able to update their profile.

Acceptance criteria:

- Users can update name and basic profile details.
- Email updates, if supported, must be validated.

### 7.10 Error and Not Found Pages

#### FR-ERR-001 404 Page

The system shall provide a custom 404 page.

Acceptance criteria:

- Unknown routes show a branded 404 experience.
- Users can navigate back to the dashboard or prior page.

#### FR-ERR-002 Error Handling

The system shall provide consistent error handling.

Acceptance criteria:

- API errors are displayed in useful, non-technical language.
- Validation errors are shown next to relevant fields.
- Unexpected errors are logged on the server.

## 8. Backend API Scope

The backend shall expose REST APIs for:

- Authentication
- Dashboard
- Stations
- Sessions
- Analytics
- Users
- Notifications
- Settings

API design must follow REST conventions, use predictable naming, return consistent response shapes, validate inputs, enforce authorization, and handle errors consistently.

Detailed API contracts will be produced in Step 4.

## 9. Data Requirements

### 9.1 Core Entities

The system shall model:

- User
- Role or role field
- Charging station
- Connector
- Charging session
- Notification
- Maintenance record
- Station health metric
- Settings or preferences

Detailed database schema will be produced in Step 3.

### 9.2 Seed Data

The system shall support realistic fake data generation:

- 100 charging stations
- 500 users
- 10,000 charging sessions

Seed data should include realistic city distribution, connector types, station statuses, session durations, costs, energy usage, and timestamps.

## 10. State Management Requirements

### 10.1 Redux Toolkit

Redux Toolkit shall manage client state for:

- Authentication
- Theme
- Notifications
- Current user

### 10.2 TanStack Query

TanStack Query shall manage server data for:

- Dashboard data
- Station data
- Session data
- Analytics data
- User data
- Notification data
- Settings data

Requirements:

- Use query keys consistently.
- Support caching and background refetching.
- Keep server data out of Redux unless there is a specific client-state reason.

## 11. Real-Time Requirements

### 11.1 Socket.IO Events

The system shall support real-time updates for:

- Live charging session updates
- Station status updates
- Notifications

### 11.2 Real-Time Behavior

Acceptance criteria:

- Connected clients receive relevant updates.
- UI updates are efficient and do not trigger unnecessary full-page rerenders.
- Reconnect behavior is handled gracefully.
- Users do not see duplicate notifications after reconnect where preventable.

## 12. UI and UX Requirements

### 12.1 Visual Style

EVision shall use a premium SaaS dashboard design language.

Design attributes:

- Professional
- Clean
- Information-dense without feeling cluttered
- Accessible
- Responsive
- Consistent spacing and typography
- Enterprise-ready

### 12.2 Layout

Required layout elements:

- App shell with sidebar navigation.
- Top bar with search, notifications, profile access, and theme control.
- Responsive navigation for tablet and mobile.
- Content pages optimized for repeated operations.

### 12.3 Accessibility

Requirements:

- Keyboard navigable controls.
- Visible focus states.
- Sufficient color contrast.
- Accessible form labels and validation messages.
- Semantic headings and landmarks.
- Non-color indicators where status is important.

### 12.4 Responsiveness

The application shall support:

- Desktop
- Tablet
- Mobile

Acceptance criteria:

- Core workflows remain usable on mobile.
- Tables adapt through responsive layouts, horizontal scrolling, or condensed views where appropriate.
- Map remains usable on small screens.

### 12.5 Motion

Framer Motion may be used for tasteful transitions and micro-interactions.

Requirements:

- Motion must not interfere with task completion.
- Animations should be subtle and professional.
- Reduced motion preferences should be respected where practical.

## 13. Forms and Validation Requirements

### 13.1 Form Stack

Forms shall use React Hook Form and Zod.

### 13.2 Reusable Form Components

The frontend shall include reusable form primitives such as:

- Text input
- Select
- Checkbox or switch
- Textarea
- Date range input
- Search input
- Form error display

### 13.3 Validation

Requirements:

- Client-side validation through Zod.
- Server-side validation for all mutating APIs.
- Clear validation messages.
- No business-critical validation may exist only on the client.

## 14. Performance Requirements

### 14.1 Frontend Performance

Requirements:

- Lazy-load large routes and expensive components where appropriate.
- Dynamically import map-heavy or chart-heavy modules if needed.
- Use pagination for large lists.
- Use debounced search for user-entered filters.
- Avoid unnecessary rerenders with memoization where meaningful.
- Keep UI responsive during loading states.

### 14.2 Backend Performance

Requirements:

- Use database indexes for common query patterns.
- Paginate list APIs.
- Avoid returning unbounded datasets.
- Use lean queries or projection where appropriate.
- Validate and sanitize query parameters.

### 14.3 Data Volume Targets

The system shall perform acceptably with at least:

- 100 stations
- 500 users
- 10,000 sessions

The architecture should allow scaling beyond this initial dataset.

## 15. Security Requirements

### 15.1 Authentication Security

Requirements:

- Passwords must be hashed with bcrypt.
- JWT access tokens must have reasonable expiration.
- Refresh tokens must be protected and revocable where feasible.
- Sensitive secrets must come from environment variables.

### 15.2 Authorization Security

Requirements:

- Backend must enforce role-based authorization.
- Frontend authorization checks are for user experience only and must not be trusted as security boundaries.

### 15.3 API Security

Requirements:

- Validate request bodies, params, and query strings.
- Return safe error messages to clients.
- Avoid leaking stack traces.
- Apply CORS configuration.
- Apply basic HTTP security middleware where appropriate.
- Protect against common injection risks through proper Mongoose query usage and validation.

### 15.4 Data Privacy

Requirements:

- Do not expose password hashes.
- Limit user data in API responses.
- Avoid storing unnecessary sensitive vehicle or personal data.

## 16. Reliability and Error Handling

### 16.1 Client Reliability

Requirements:

- Show loading states for asynchronous views.
- Show empty states for no-data scenarios.
- Show retry options where useful.
- Preserve user context during background refetching.

### 16.2 Server Reliability

Requirements:

- Centralized error handling middleware.
- Consistent error response format.
- Server logs for unexpected failures.
- Graceful handling of database connection errors.

## 17. Maintainability Requirements

### 17.1 Architecture

The system shall use feature-based architecture.

Frontend folders:

- app
- components
- features
- services
- hooks
- store
- types
- utils
- constants
- styles

Backend folders:

- controllers
- routes
- middleware
- models
- services
- repositories
- validators
- config
- socket
- utils

### 17.2 Code Quality

Requirements:

- Strict TypeScript.
- No `any` unless justified and isolated.
- Reusable components.
- Reusable hooks.
- Reusable API layer.
- No business logic inside UI components.
- Proper error handling.
- Meaningful file and folder names.
- SOLID principles where applicable.

## 18. Deployment Requirements

### 18.1 Frontend

The frontend shall be deployable to Vercel.

### 18.2 Backend

The backend shall be deployable to Render.

### 18.3 Database

The database shall be hosted on MongoDB Atlas.

### 18.4 Configuration

Requirements:

- Environment variables for secrets, URLs, ports, database connection strings, JWT secrets, and frontend/backend origins.
- Separate local development and production configuration.
- No secrets committed to source control.

## 19. Testing Requirements

Detailed test implementation will be refined during LLD and implementation, but the system should support:

- Unit tests for utilities, services, validators, and reducers.
- Integration tests for backend routes and repositories.
- Component tests for critical UI components.
- End-to-end tests for login, dashboard, station browsing, and key admin workflows where feasible.

## 20. Non-Functional Requirements

### 20.1 Usability

The platform shall be intuitive for operations users and avoid unnecessary visual noise.

### 20.2 Scalability

The architecture shall support additional features, larger datasets, and future multi-tenant capabilities.

### 20.3 Compatibility

The application shall support recent versions of Chrome, Edge, Firefox, and Safari.

### 20.4 Availability

The application should be designed for reliable operation on managed hosting platforms.

### 20.5 Observability

The backend should include baseline logging. Future production observability can include structured logs, tracing, metrics, uptime checks, and alerting.

## 21. Constraints

- The project must be built incrementally.
- Each major step requires approval before proceeding.
- Business logic must not be placed inside UI components.
- The codebase must avoid large unmaintainable files.
- Mock code should not replace real architecture or core implementation.
- The solution must remain maintainable and scalable.

## 22. Open Questions

1. Should EVision support multi-tenant organizations in the initial release, or should that remain a future enhancement?
2. Should refresh tokens be stored in HTTP-only cookies, or should the implementation use another token storage strategy?
3. Which map tile provider should be used for production deployment?
4. Should generated seed users include real login-ready demo accounts for each role?
5. Should charging station delete be hard delete or soft delete?
6. Should notifications be global, user-specific, role-specific, or a combination?
7. Should station health metrics be stored as time-series records or summarized snapshots for the initial version?
8. Should route drawing rely only on internal geometry, or should it integrate with an external routing API later?

## 23. Acceptance Criteria for Step 1

This SRS is complete when:

- Product scope is clearly defined.
- User roles and permissions are identified.
- Functional requirements are listed for all requested pages and major features.
- Non-functional requirements are documented.
- Security, performance, deployment, maintainability, and data expectations are documented.
- Open questions are captured for stakeholder review.
- The project can proceed to Step 2, Low Level Design, after approval.

