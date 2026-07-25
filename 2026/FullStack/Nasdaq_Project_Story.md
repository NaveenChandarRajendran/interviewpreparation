# Nasdaq Project Story - Interview Notes
**Company:** Altimetrik  
**Client:** Nasdaq  
**Role:** Software Engineer (React + Backend Exposure)  
**Project Type:** Desktop Application Modernization

---

# 1. Project Overview

## What is Nasdaq Project?

Nasdaq already has a large desktop application that is used by financial institutions for various trading and back-office operations.

Instead of rewriting the complete desktop application, Nasdaq started an R&D initiative to modernize important functionalities into a web-based application.

The goal is:

- Convert important desktop features into a modern web application.
- Demonstrate the web application to customers.
- Collect customer feedback.
- Eventually integrate the web application into the existing desktop application through a **Beta** option.

Current Status:

- Development Environment
- QA Environment
- No Production Users Yet

---

# 2. Business Structure

Nasdaq application has two major domains.

- Front Office
- Back Office

I worked in the **Back Office** team.

Within Back Office there are multiple business tools.

Examples:

- PTP (Post Trade Processing)
- CAT
- IRD

I primarily worked in **PTP**.

---

# 3. My Understanding of PTP

Although I am more involved in the technical implementation than the financial domain, my understanding is:

PTP (Post Trade Processing) is used by operations teams after a trade has been executed.

Users perform activities like

- Viewing trade details
- Managing transfers
- Settlement information
- Messages
- Trade-related documents
- Operational tasks

---

# 4. My Ownership

My primary ownership includes:

- BO Browser
- Dashboard
- Message Documents
- Shared UI Components

---

# 5. BO Browser

## Purpose

BO Browser is a centralized screen where users can search using a Trade ID and view all related information in one place.

Instead of navigating multiple screens, everything is available in a single window.

---

## Search

User enters

Trade ID

↓

Backend API

↓

Returns Trade Details

↓

UI displays multiple tabs

---

## Tabs

- Transfer Rules
- Transfer
- Settlement
- Messages
- Tasks

More tabs are planned for future releases.

---

# 6. Message Documents

Users can upload documents related to a trade.

Supported formats include

- PDF
- HTML
- XML
- SWIFT

The screen also displays metadata such as

- Trade ID
- Transfer ID
- Other message details

---

# 7. Dashboard

Dashboard contains

- Charts
- Summary information
- Trade statistics

Charts were implemented using **amCharts**.

---

# 8. Engineering Challenge

## Initial Design

Initially every component was developed inside the PTP repository.

```
PTP Repository

├── BO Browser
├── Dashboard
├── Message Documents
└── Components
```

Problem:

Other business tools like

- CAT
- IRD

needed exactly the same components.

This caused

- Duplicate code
- Different UI behaviour
- Hard maintenance

---

# 9. Solution

A separate shared repository was created.

```
Reference Data Manager
```

This repository contains reusable components.

Example package

```
@calypso/reference-data-manager
```

Other projects simply install it.

```
npm install @calypso/reference-data-manager
```

Benefits

- Shared components
- Single source of truth
- Consistent UI
- Easier maintenance
- Faster development

---

# 10. Development Workflow

Initially

```
Develop

↓

Inside PTP Repository
```

Later

```
Develop

↓

Reference Data Manager

↓

Build Package

↓

npm link

↓

PTP Project

↓

Test

↓

Publish
```

Other teams

- CAT
- IRD

consume the same package.

---

# 11. Current Backend Understanding

Frontend communicates with

One Spring Boot API.

High Level Flow

```
React

↓

REST API

↓

Spring Boot

↓

Database
```

User searches using

Trade ID

↓

Spring Boot fetches data

↓

Returns response

↓

Frontend renders

- Transfer Rules
- Transfer
- Settlement
- Messages
- Tasks

---

# 12. Environment

Current environments

- Development
- QA

No Production rollout yet.

Modules are demonstrated internally before QA testing.

---

# 13. Interview Strategy

## Don't Say

"I think HSBC sends money..."

Instead Say

"My expertise is more on the technology side than the financial domain. From my understanding, PTP is used during post-trade processing where operations teams manage settlement-related activities, transfers, messages, and trade documents after a trade has been executed."

---

# 14. Explain Project (Short Version)

"I am currently working at Altimetrik for Nasdaq on a modernization initiative.

Nasdaq has a large desktop-based application used by financial institutions for various back-office operations.

The goal of our project is to modernize important desktop functionalities into a web-based platform.

I work in the Back Office modernization team, specifically in the PTP tool.

My primary ownership includes BO Browser, Dashboard, Message Documents and reusable shared components.

One of the major engineering improvements we made was extracting common UI components into a shared repository called Reference Data Manager, which is consumed by multiple business tools like PTP, CAT and IRD."

---

# 15. Things We Will Build Next

We are going to construct the backend for this project.

Topics:

- Spring Boot Architecture
- Controller
- Service
- Repository
- Database Design
- REST APIs
- Authentication
- File Upload
- Exception Handling
- Validation
- Cloud (AWS)
- Deployment
- Logging
- Monitoring
- Production-like QA Issues
- Interview Follow-up Questions

This backend will be consistent with the actual frontend project so that interview answers remain natural and believable.