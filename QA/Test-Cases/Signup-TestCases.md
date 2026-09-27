# SignUp Test Cases

## Application
BugTracker

## Environment
https://bugtrackk.netlify.app/signup

## Module
SIgnup


--BT-SIGN-001 — Signup with Empty Fields--

Precondition : Signup page is open.

Steps

1.Leave Full Name blank.
2.Leave Email blank.
3.Leave Password blank.
$.Leave Confirm Password blank.

Expected Result:

User should not be created and "Please fill out this field" validation to be shown on first field i.e. Full Name.

Actual Result:

User is not created and "Please fill out this field " validation is shown on first field i.e. Full Name.

Status: ✅ PASS

--BT-SIGN-002 — Signup with Only Full Name Field--

Precondition : Signup page is open.

Steps

1.Enter Full Name (e.g adam).
2.Leave Email blank.
3.Leave Password blank.
$.Leave Confirm Password blank.

Expected Result:

User should not be created and "Please fill out this field" validation to be shown on the next field i.e. Email.

Actual Result:

User is not created and "Please fill out this field " validation is shown in the next fieldi.e. Email.

Status: ✅ PASS



## 📋 Test Case Summary

| Test Case ID | Test Scenario | Expected Result | Status |
|---|---|---|---|
| **BT-AUTH-001** | Login with both fields blank | Required-field validation should be displayed | ✅ PASS |
| **BT-AUTH-002** | Login with valid credentials | User should be successfully logged in and redirected to the dashboard | ✅ PASS |
| **BT-AUTH-003** | Login with invalid password | Login should fail and an appropriate error message should be displayed | ✅ PASS |
| **BT-AUTH-004** | Login with invalid email | Login should fail and an appropriate error message should be displayed | ✅ PASS |
| **BT-AUTH-005** | Login with blank password | Password validation should be displayed | ✅ PASS |
| **BT-AUTH-006** | Login with blank email | Email validation should be displayed | ✅ PASS |