# Signup

> ## Success
- [x] Receive a `POST` request on `api/signup` route.
- [x] Validate required fields: **name**, **email**, **password** and **passwordConfirmation**
- [x] Validate **password** and **passwordConfirmation** are equals
- [x] Validate **email** is valid
- [x] Check if **email** is unique
- [x] Make password hash
- [x] Create a user account with provided data and password hash
- [x] Generate a access token from user ID
- [x] Update user data with access token
- [x] Return 200 with access token

> ## Exceptions
- [x] Return **404** if `API` doesn't exist.
- [x] Return **400** if **name**, **email**, **password** or **passwordConfirmation** is not provided 
- [x] Return **400** if **password** and **passwordConfirmation** doesn't match
- [x] Return **400** if a invalid **email** is provided
- [x] Return **403** if provided **email** is already in use
- [x] Return **500** if an error occurs while hashing the password
- [x] Return **500** if an error occurs while creating the user account
- [x] Return **500** if an error occurs while generating the access token
- [x] Return **500** if an error occurs while updating the user's access token
