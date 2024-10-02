# Nextjs Saas Multitenat RBAC

Boilerplate for a multitenant SaaS application with Nodejs, Nextjs and Postgres.

## Features

- Multitenant
- RBAC
- Postgres
- Nextjs
- TypeScript

## Functional Requirements

### Authentication

- [ ] It should be able to authenticate users with email and password
- [ ] It should be able to authenticate users with Github
- [ ] It should be able to recover passwords using email
- [ ] It should be able to create an account using email, name and password

### Organizations

- [ ] It should be able to create a new organizations
- [ ] It should be able to transfer ownership of an organization
- [ ] It should be able to get organizations
- [ ] It should be able to update an organization
- [ ] It should be able to shut down an organization

### Invites
- [ ] It should be able to invite a new member to an organization (email, role)
- [ ] It should be able to accept an invite
- [ ] It should be able to revoke a pending an invitation

### Members

- [ ] It should be able to get organization members
- [ ] It should be able to update a member role

### Projects

- [ ] It should be able to create a new project (name, url, description, organizationId)
- [ ] It should be able to get projects within an organization
- [ ] It should be able to update a project (name, url, description)
- [ ] It should be able to delete a project

### Billing

- [ ] It should be able to get billing details for organization ($28 per project / $10 per member excluding **billing role**)

### Roles

- Administrator (ADMIN)
- Member (MEMBER)
- Billing (BILLING)

## Business Rules

### Permission Table

| Action                 |  ADMIN  | MEMBER | BILLING | Anonymous |
| ---------------------- | ------ | ------- | -------- | ---------- |
| Update Organization    | ✅     | ❌      | ❌       | ❌         |
| Delete Organization    | ✅     | ❌      | ❌       | ❌         |
| Create Organization    | ✅     | ✅      | ✅       | ❌         |
| Read Organization      | ✅     | ✅      | ✅       | ❌         |
| Invite Member          | ✅     | ❌      | ❌       | ❌         |
| Revoke Invite          | ✅     | ❌      | ❌       | ❌         |
| Transfer Ownership     | ⚠️      | ❌      | ❌       | ❌         |
| List Members           | ✅     | ❌      | ❌       | ❌         |
| Update Member Role     | ✅     | ❌      | ❌       | ❌         |
| Delete Member          | ✅     | ⚠️       | ❌       | ❌         |
| List Projects          | ✅     | ✅      | ✅       | ❌         |
| Create a new Project   | ✅     | ✅      | ❌       | ❌         |
| Update Project         | ✅     | ⚠️      | ❌       | ❌         |
| Delete Project         | ✅     | ⚠️      | ❌       | ❌         |
| Get Billing Details    | ✅     | ❌      | ✅       | ❌         |
| Export Billing Details | ✅     | ❌      | ✅       | ❌         |
| Accept Invite          | ✅     | ✅      | ✅       | ❌         |
| Create Project         | ✅     | ✅      | ✅       | ❌         |
| Read Project           | ✅

> ✅ => Allowed | 
> ❌ => Not allowed | 
> ⚠️ => Allowed, but with conditions


## Getting Started

### Prerequisites

- Nodejs
- Postgres
- Docker

### Installation

```bash
npm install
```