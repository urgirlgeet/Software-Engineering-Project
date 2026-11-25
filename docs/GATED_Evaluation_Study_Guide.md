# GATED: Software Engineering Evaluation Study Guide

This guide is a viva revision aid for the Software Engineering concepts behind
GATED: Apartment Tracker. It combines core theory with project-specific facts.
Use the SRS and final report as the source of truth for formal requirements and
the current implementation; where they differ, the difference is called out
instead of being presented as a completed feature.

## A one-minute project explanation

GATED is a cross-platform apartment-society management application. Residents
can register against a society and flat, raise and track complaints, read
notices, reserve facilities and view maintenance bills. Administrators manage
complaints, notices and bills; maintenance staff update assigned complaints;
security staff have a dashboard and a visitor-request prototype. The client
uses React Native with Expo SDK 57, TypeScript and Expo Router. Supabase
provides authentication and a PostgreSQL database. Database policies and
functions protect the persisted society services. Visitor requests are not
persisted, payment is simulated, and some SRS requirements remain incomplete.

## 1. Software Engineering fundamentals

**Software Engineering** is the systematic, disciplined and measurable
application of engineering principles to software development, operation and
maintenance. It includes more than programming: requirements, design,
implementation, verification, release, maintenance and project management.

Good software should be correct, reliable, usable, secure, efficient,
maintainable and portable. These qualities can compete: for example, adding
strict access checks may add work to a user flow but improve security.
Engineering makes these trade-offs explicit and tests them against agreed
requirements.

**Software process** is the organized set of activities used to build and
maintain a product. A typical lifecycle is:

1. **Feasibility and planning:** define the problem, scope, risks, resources
   and schedule.
2. **Requirements:** discover stakeholder needs and record what the system
   must do and the constraints it must meet.
3. **Design:** decide architecture, modules, data, interfaces and security.
4. **Implementation:** turn the design into code and database changes.
5. **Verification and validation:** check the product against its
   specification and users' actual needs.
6. **Deployment and operation:** release it into its target environment and
   monitor its use.
7. **Maintenance:** correct faults, adapt to change and improve the system.

**Verification versus validation**

- Verification asks, “Are we building the product right?” It checks artifacts
  against their specifications, for example reviewing a schema constraint or
  running a type check.
- Validation asks, “Are we building the right product?” It checks that the
  delivered workflows solve the stakeholder's problem, for example asking a
  resident to complete a complaint workflow.

### SDLC models

| Model | Main idea | Strength | Limitation / suitable context |
| --- | --- | --- | --- |
| Waterfall | Complete each phase before moving to the next | Clear milestones and documentation | Change is costly; best when requirements are stable |
| V-Model | Pair each development phase with a corresponding test phase | Testing and traceability are planned early | Less flexible when requirements change |
| Iterative | Revisit and improve the system through repeated cycles | Feedback can refine the product | Requires careful version and scope management |
| Incremental | Deliver useful groups of features in stages | Working value arrives early | Integrating increments needs good architecture |
| Prototyping | Build a quick model to clarify requirements or UI | Helps stakeholders discover needs | A prototype can be mistaken for a production system |
| Spiral | Repeat risk analysis, development and evaluation | Good for large, high-risk projects | Can be expensive and process-heavy |
| Agile / Scrum | Deliver small increments, inspect feedback and adapt | Supports changing requirements and frequent demos | Needs active collaboration and disciplined prioritization |

GATED is naturally explainable as an **incremental and iterative** project:
features such as authentication, complaint workflows and apartment services
were added in stages and documentation was revised as implementation evolved.
Do not claim a formal Scrum process unless the team actually used its roles,
events and artifacts.

## 2. Requirements and the SRS

A **requirement** states a capability, quality or constraint the system needs
to satisfy. A good requirement is clear, necessary, feasible, consistent,
verifiable and traceable.

- A **functional requirement (FR)** describes a service or behavior, such as
  assigning a complaint to maintenance staff.
- A **non-functional requirement (NFR)** describes a quality or constraint,
  such as a response-time target or role-based data isolation.
- A **business rule (BR)** is a domain constraint, such as preventing
  overlapping facility bookings.

The **Software Requirements Specification (SRS)** records the agreed scope,
actors, functional and non-functional requirements, business rules and other
constraints. It is a communication and test-planning baseline, not proof that
every requirement has been implemented.

**Requirements engineering** typically includes elicitation (interviews,
observation, document study), analysis, prioritization, specification,
validation and change management. Ambiguous words such as “fast” should be
made measurable, such as “within 500 ms under stated network conditions.”

**Traceability** links each requirement to design elements, implementation
and test cases. A requirements traceability matrix (RTM) helps identify
untested requirements and tests that have no requirement. GATED's SRS matrix
is in [the test-case document](./test-cases.md).

**Acceptance criteria** are observable conditions for deciding whether a
feature is complete. For example, an invalid apartment number should be
rejected and must not create an account.

### Use cases and user stories

A **use case** describes how an actor interacts with the system to achieve a
goal, including the normal path and alternatives or failures. In GATED,
“Resident submits a complaint” is a use case: the resident enters a subject,
category, priority and description; the application validates the fields and
stores a complaint; an error path handles invalid input or a failed request.

A **user story** is a short agile statement, often written “As a [role], I
want [capability], so that [benefit].” It is useful for planning but does not
replace detailed acceptance criteria or security rules.

## 3. UML, DFD and data modelling

**UML (Unified Modeling Language)** is a standard visual language for
describing software structure and behavior. It is not a programming language
and a diagram is not necessarily a complete design.

- **Use-case diagram:** actors outside the system boundary and goals they can
  perform. GATED's actors include Resident, Society Admin, Maintenance Staff
  and Security Staff.
- **Class diagram:** classes, attributes, operations and relationships.
  Association means a relationship; inheritance means an “is-a” relationship.
- **Sequence diagram:** time-ordered messages among actors or objects. It can
  explain signup, authentication or complaint assignment.
- **Activity diagram:** actions and decisions in a workflow, such as
  submitting, assigning and resolving a complaint.
- **Component diagram:** software modules and their dependencies.
- **Deployment diagram:** runtime nodes and the software deployed on them,
  such as a mobile/web client and a hosted backend.

An **ER diagram** models data entities, attributes and relationships. GATED's
main data concepts include users, societies, apartments, complaints, notices,
facility reservations and maintenance bills. Do not confuse an ER diagram
with a class diagram: classes describe software objects; entities describe
persistent data.

A **Data Flow Diagram (DFD)** shows how data moves through processes, external
entities and data stores. A context diagram (Level 0) shows the whole system
and its external actors; a Level 1 DFD decomposes the system into major
processes. Arrows are data flows, not control-flow arrows. A diagram of tables
and foreign-key relationships is an ER/schema diagram, not a DFD.

**Normalization** organizes relational data to reduce duplication and
update anomalies. In 1NF, attributes contain atomic values; 2NF removes
partial dependencies on part of a composite key; 3NF removes transitive
dependencies of non-key attributes. Normalization improves consistency, while
careful indexes support query performance.

## 4. Testing concepts

**Testing** executes or examines software to find defects and provide evidence
about quality. Testing can show that defects exist; it cannot prove that
software is completely defect-free.

### Test levels

- **Unit testing:** checks a small function or component in isolation.
- **Integration testing:** checks interactions between modules or services,
  such as the app and Supabase.
- **System testing:** checks the complete application against its
  requirements.
- **Acceptance testing:** checks whether users or evaluators accept the
  product for its intended use.

### Test types and techniques

- **Functional testing** checks behavior against requirements.
- **Non-functional testing** checks qualities such as performance, security,
  usability, reliability and portability.
- **Regression testing** reruns relevant tests after a change to find
  unintended breakage.
- **Black-box testing** derives cases from inputs and expected outputs without
  relying on internal code.
- **White-box testing** uses code structure to choose cases and coverage.
- **Equivalence partitioning** groups inputs expected to behave alike and
  samples each group.
- **Boundary-value analysis** tests edges, such as a 6-character minimum
  password with values just below and at the boundary.
- **Negative testing** supplies invalid or unauthorized input to ensure the
  system handles it safely.

A useful test case records an ID, requirement, preconditions, steps, test
data, expected result and actual result. A defect report adds a reproducible
description, environment, severity and evidence.

GATED's [test cases](./test-cases.md) are a **manual test design**, not a
claim that every case has been executed. The result column must be filled in
from actual runs. The cases include validation, role/society isolation,
complaint lifecycle, database constraints, platform build and known gaps.
The performance targets need timed measurements on a stated device and
network; they cannot be claimed from a written test case alone.

## 5. GATED design and implementation

### Architecture and technology

GATED uses a client–server architecture:

1. The React Native client runs on Android, iOS or the web.
2. Expo Router maps files under `src/app/` to screens and routes.
3. The Supabase JavaScript client communicates with Supabase Auth and the
   hosted PostgreSQL database.
4. Row Level Security (RLS), database constraints, triggers and RPC functions
   enforce important data rules at the backend.

The stack in the repository is Expo SDK 57, React Native 0.86, React 19,
TypeScript, Expo Router, Supabase and PostgreSQL. Reusable UI is under
`src/components/`, shared client setup is under `src/lib/`, and SQL changes
are under `supabase/migrations/`.

**Why enforce rules in the database?** A client-side check improves feedback
but can be bypassed by calling the API directly or using another client.
Database constraints and RLS are authoritative for persisted data. For
example, a resident may not be able to see another resident's reservation,
so a client-only overlap check cannot reliably prevent double booking.

### Main workflows

- **Signup:** enter account details, choose a society and verify a resident's
  apartment against the society registry; Supabase Auth and a database
  trigger create the profile.
- **Complaint:** resident submits a request; an administrator assigns it to
  maintenance staff; staff mark it in progress and resolve it with a note.
- **Notices:** administrators publish society-scoped notices; society
  members read them.
- **Facility booking:** residents request a future time slot. Database logic
  rejects an overlapping reservation for the same society and facility.
- **Maintenance bill:** an administrator creates a bill for an apartment and
  billing month; a resident can mark it paid for demonstration. This is not a
  real payment transaction.
- **Visitor request:** a resident can fill in the prototype form, but entries
  are held in screen memory and are not persisted as gate entry/exit logs.

### Data and database concepts

Relational tables represent entities, with primary keys identifying rows and
foreign keys linking related records. `NOT NULL`, `CHECK`, `UNIQUE` and
foreign-key constraints protect invariants. Indexes speed up common lookups
but require storage and update work.

**ACID** describes reliable database transactions: atomicity (all or nothing),
consistency (valid states), isolation (concurrent work does not corrupt
results) and durability (committed changes persist). GATED's booking trigger
checks the interval condition `existing.start < requested.end` and
`existing.end > requested.start`; a transaction-scoped advisory lock helps
serialize competing bookings for the same facility.

**Authentication versus authorization:** authentication establishes who the
user is; authorization decides what that user may do. Supabase Auth handles
credentials and sessions. The app routes users by profile role, while RLS
policies enforce access to database rows. UI hiding alone is not a security
boundary.

### SRS versus delivered behavior

| Topic | What the SRS asks for | What to say about the current project |
| --- | --- | --- |
| Admin approval (FR-1.4, BR-3) | New Society Admin accounts stay pending until an existing admin approves them | The current signup path does not enforce this approval state; it is an identified gap |
| Visitor verification (FR-5.1–5.2) | Security staff save visitor entry details and exit time | The visitor UI is a prototype; requests are not persisted and entry/exit logging is incomplete |
| Role selection and provisioning | The SRS describes four roles; deployment guidance says staff should be provisioned by an administrator | Explain the difference between the SRS wording and the current backend setup; do not claim approval is complete |
| Credential storage | The SRS calls for secure asynchronous device storage | The current client uses AsyncStorage on native and browser local storage on web; do not describe these as encrypted secure storage |
| Response/startup performance | API calls within 500 ms and dashboard within 2 seconds | These are targets, not verified results; measurements require a defined device, network and test run |
| Payments | View and record bill payment | The app changes a payment status for demonstration; no money is transferred |
| Deployment | Run on web and mobile | A web export can be prepared from this repository; a public deployment needs a host account and configured Supabase project |

The SRS and final report are not identical in scope. Notices, facility
reservations and billing are described in the final report and test suite even
though they are not detailed as functional SRS features. The viva answer should
acknowledge this as scope evolution, not silently rewrite the SRS.

## 6. Deployment preparation

The repository is configured for a static Expo web export (`web.output` is
`static`). A web deployment can be prepared as follows:

1. Install the lockfile-pinned packages with `npm ci`.
2. Apply the signup and apartment-services migrations to the intended
   Supabase project and populate the society/apartment registry.
3. Run `npx expo export --platform web`. The deployable static site is emitted
   in `dist/`.
4. Upload the contents of `dist/` to a static host such as Netlify or another
   compatible host.
5. Configure the Supabase Auth site URL and redirect allowlist for the final
   domain. Open the deployed site and smoke-test signup, sign-in, role routing,
   database-backed features and a deep link.

The client uses a public Supabase publishable key. Never put a Supabase
`service_role` secret in the client or a static web build. Before using a real
society, verify RLS policies, provision staff through the trusted backend,
replace sample society and apartment data, and confirm the project URL/key
refer to the intended Supabase project. Payment remains simulated and visitor
logging remains incomplete.

This repository does not include evidence of a published live URL. A
successful local export is a build result, not a deployment. Native Android
store distribution also needs a package identifier, signing credentials and
an EAS/build configuration; those are not currently present in this checkout.

## 7. Viva questions with model answers

1. **What problem does GATED solve?**

   It centralizes common apartment-society workflows—resident complaints,
   notices, facility reservations and maintenance bills—in role-aware mobile
   and web screens instead of scattered manual processes.

2. **Why is this Software Engineering rather than only coding?**

   The project includes requirements and an SRS, diagrams and data design,
   implementation, database security, test planning, deployment preparation
   and maintenance considerations.

3. **Which SDLC model fits the project?**

   Incremental and iterative development fits: the app grew feature by
   feature, with documentation and implementation refined as the scope
   evolved. We should not claim Scrum unless its practices were followed.

4. **What is the difference between an SRS and a design document?**

   The SRS says what the system must do and its constraints. Design explains
   how the system is structured to meet those requirements.

5. **How do FRs differ from NFRs?**

   FRs specify observable system functions; NFRs specify qualities or
   constraints such as performance, security, usability or portability.

6. **What does the use-case diagram show?**

   It summarizes system goals from each actor's perspective. It does not show
   database structure or the time order of messages.

7. **How does a sequence diagram differ from an activity diagram?**

   A sequence diagram emphasizes time-ordered interactions between
   participants; an activity diagram emphasizes workflow steps and decisions.

8. **What is a DFD?**

   A Data Flow Diagram shows external entities, processes, data stores and
   data flowing among them. It is not a class or ER diagram.

9. **Why use RLS if the app already checks user roles?**

   Client checks can be bypassed. RLS evaluates access in the database for
   each request, providing a backend authorization boundary.

10. **How does GATED prevent two people booking the same slot?**

    The database checks for overlapping intervals for the same society and
    facility. A transaction lock protects the check from simultaneous
    requests; the client check is only an early user-friendly warning.

11. **What is the difference between integration and system testing?**

    Integration testing checks interactions between components, such as the
    client and Supabase. System testing checks the application as a whole
    against its requirements.

12. **What is regression testing?**

    Rerunning relevant tests after a change to find behavior that used to work
    but has broken as a side effect.

13. **What does a passing test case prove?**

    It provides evidence that one defined scenario passed in one environment.
    It does not prove that all requirements or environments are defect-free.

14. **Which important SRS gaps should you disclose?**

    Admin approval and persistent visitor entry/exit are incomplete. The
    performance and secure-storage requirements also need verification or
    implementation. Bill payment is simulated.

15. **Has the app been deployed?**

    Be precise: a static web export can be built and uploaded to a host, but
    this checkout has no published live URL. A local build is not the same as
    a public deployment.

## 8. Last-minute revision checklist

- Explain the four roles and one end-to-end complaint lifecycle.
- Distinguish SRS, design, implementation, test case and test result.
- Be ready to describe one use-case, one sequence flow, and the difference
  between DFD and ERD.
- Explain how RLS and database constraints provide protection beyond UI
  validation.
- State what is implemented, what is a prototype, and what remains a gap.
- Do not claim all 92 cases passed, a live URL exists, real payments occur, or
  visitor requests are saved unless those facts are verified.
