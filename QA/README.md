# BugTracker — QA & Testing Portfolio

> A practical QA documentation project demonstrating manual testing, API
> validation, database verification, defect reporting, and test documentation
> for the BugTracker application.

---

## Testing Objective

The objective of this QA project is to validate the BugTracker application's
functionality, reliability, authentication, authorization, bug-management
workflows, and data handling.

Testing is performed against the deployed BugTracker application.

 **Live Application:** https://bugtrackk.netlify.app/

---

##  QA Skills Demonstrated

| Area | Coverage |
|---|---|
| Manual Testing | ✅ |
| Functional Testing | ✅ |
| Positive Testing | ✅ |
| Negative Testing | ✅ |
| Validation Testing | ✅ |
| Regression Testing | 🔄 In Progress |
| Authentication Testing | 🔄 In Progress |
| Authorization Testing | 🔄 In Progress |
| API Testing | 🔄 In Progress |
| Database Validation | 🔄 In Progress |
| Defect Reporting | 🔄 In Progress |
| Test Documentation | ✅ |

---

## 🧰 Tools & Technologies

- **Manual Testing**
- **Postman** — API Testing
- **MongoDB** — Database Validation
- **Git & GitHub** — Version Control & Documentation
- **Browser DevTools** — Web Application Debugging
- **Selenium + Java** — UI Automation Exposure

---

# 📂 QA Documentation

### 📋 Test Cases

Detailed test cases covering the application's major functional areas.

- [Authentication Test Cases](./Test-Cases/Authentication-Test-Cases.md)
- [Bug Management Test Cases](./Test-Cases/Bug-Management-Test-Cases.md)
- [Authorization Test Cases](./Test-Cases/Authorization-Test-Cases.md)

---

### Bug Reports

Defects identified during testing are documented with:

- Bug ID
- Title
- Module
- Environment
- Steps to reproduce
- Expected result
- Actual result
- Severity
- Priority
- Evidence
- Status

[View Bug Reports](./Bug-Reports/)

---

### Test Scenarios

High-level testing scenarios covering:

- Authentication
- User management
- Bug creation
- Bug editing
- Bug deletion
- Bug viewing
- Role-based access
- Input validation
- Negative scenarios

[View Test Scenarios](./Test-Scenarios/)

---

### API Testing

API testing documentation will cover:

- HTTP methods
- Request and response validation
- Status-code validation
- Authentication
- Authorization
- Positive and negative API scenarios
- JSON response validation

[View API Testing](./API-Testing/)

---

### 🗄️ Database Validation

Database testing will be used to verify that application actions result in
the expected backend data.

Example validation flow:

```text
User Action
    ↓
Frontend
    ↓
REST API
    ↓
Backend
    ↓
MongoDB