# Nextjs Saas Multitenat RBAC

Boilerplate for a multitenant SaaS application with Nodejs, Nextjs and Postgres.

## Setup Nestjs

See how to setup Nestjs with **Fastify** in [@bruno-valero/nestjs-with-fastify-setup](https://gist.github.com/bruno-valero/f1cc806044527a1a7e41895c139a5acd)

See how to setup Nestjs with **auth Jwt**, **prisma ORM** and **Redis** for cache in [@bruno-valero/ nestjs-setup-with-auth-and-prisma-and-redis](https://gist.github.com/bruno-valero/9aa864c210fcb191da66cc9dbb4523d5)

## Features

- Multitenant
- RBAC
- Postgres
- Nextjs
- TypeScript

## Functional Requirements

### Authentication

- [ ] It should be able to create an account using email, name and password
- [ ] It should be able to authenticate users with email and password
- [ ] It should be able to authenticate users with Github
- [ ] It should be able to recover passwords using email

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
| Read Project           | ✅     | ⚠️       | ⚠️        | ❌         |
| List Projects          | ✅     | ✅      | ✅       | ❌         |
| Create a new Project   | ✅     | ✅      | ❌       | ❌         |
| Update Project         | ✅     | ⚠️      | ❌       | ❌         |
| Delete Project         | ✅     | ⚠️      | ❌       | ❌         |
| Get Billing Details    | ✅     | ❌      | ✅       | ❌         |
| Export Billing Details | ✅     | ❌      | ✅       | ❌         |
| Accept Invite          | ✅     | ✅      | ✅       | ❌         |

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
npm install && docker compose up -d
```

### Swagger

To access the swagger documentation, you can use the following url:

```bash
http://localhost:3333/docs
```