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
