# Authentication Test Cases

## Application
BugTracker

## Environment
https://bugtrackk.netlify.app/

## Module
Authentication



--BT-AUTH-001 — Login with Empty Fields--

Precondition : Login page is open.

Steps

1.Leave Email blank.
2.Leave Password blank.
3.Click Login.

Expected Result:

User should not be logged in and "Please fill out this field." should be displayed.

Actual Result:

User is not logged in and "Please fill out this field." validation is displayed.

Status: ✅ PASS


--BT-AUTH-002 — Login with Valid Credentials--

Precondition: A valid user account exists.

Steps:

1.Enter a valid email.
2.Enter a valid password.
3.Click Login.

Expected Result: User should be successfully logged in and redirected to the dashboard.

Actual Result: User is successfully logged in and redirected to the dashboard.

Status: ✅ PASS


--BT-AUTH-003 — Login with Invalid Password--

Precondition: A valid user email exists.

Steps:
1.Enter a valid email.
2.Enter an incorrect password.
3.Click Login.

Expected Result: Login should fail and "Invalid email or password" message should be displayed.

Actual Result: Login fails and "Invalid email or password" message was displayed

Status: ✅ PASS

--BT-AUTH-004 — Login with Invalid Email--

Precondition: A valid user email exists.

Steps:
1.Enter an incorrect email.
2.Enter a valid password.
3.Click Login.

Expected Result: Login should fail and "Invalid email or password" message should be displayed.

Actual Result: Login fails and "Invalid email or password" message was displayed

Status: ✅ PASS

--BT-AUTH-005 — Login with Empty password field--

Precondition : A valid user exists.

Steps:

1.Enter a valid email.
2.Leave Password blank.
3.Click Login.

Expected Result:

User should not be logged in and "Please fill out this field." should be displayed in password field.

Actual Result:
user is not logged in and "Please fill out this field." is displayed in password field.

Status: ✅ PASS


--BT-AUTH-006 — Login with Empty email field--

Precondition : A valid user exists.

Steps:

1.Leave email blank.
2.Enter avalid password.
3.Click Login.

Expected Result:

User should not be logged in and "Please fill out this field." should be displayed in password field.

Actual Result:
user is not logged in and "Please fill out this field." is displayed in password field.

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