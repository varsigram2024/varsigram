# VARSIGRAM API Documentation

## Authentication Endpoints

### 1. Sign Up
- **Endpoint**: `/api/auth/signup`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "fullName": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: 201 Created
  ```json
  {
    "userId": "string",
    "email": "string",
    "token": "string"
  }
  ```

### 2. Email Verification
- **Endpoint**: `/api/auth/verify-email`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "userId": "string",
    "code": "string"
  }
  ```
- **Response**: 200 OK
  ```json
  {
    "verified": true
  }
  ```

### 3. Phone Verification
- **Endpoint**: `/api/auth/verify-phone`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "userId": "string",
    "phoneNumber": "string",
    "countryCode": "string"
  }
  ```
- **Response**: 200 OK
  ```json
  {
    "verified": true
  }
  ```

### 4. Login
- **Endpoint**: `/api/auth/login`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: 200 OK
  ```json
  {
    "userId": "string",
    "token": "string"
  }
  ```

### 5. Google OAuth
- **Endpoint**: `/api/auth/google`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "token": "string" // Google OAuth token
  }
  ```
- **Response**: 200 OK
  ```json
  {
    "userId": "string",
    "token": "string"
  }
  ```

## Profile Endpoints

### 1. Academic Details
- **Endpoint**: `/api/profile/academic`
- **Method**: PUT
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
  ```json
  {
    "faculty": "string",
    "department": "string"
  }
  ```
- **Response**: 200 OK
  ```json
  {
    "updated": true
  }
  ```

### 2. Personal Details
- **Endpoint**: `/api/profile/personal`
- **Method**: PUT
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
  ```json
  {
    "gender": "string",
    "religion": "string",
    "dateOfBirth": "string"
  }
  ```
- **Response**: 200 OK
  ```json
  {
    "updated": true
  }
  ```

### 3. Academic Level
- **Endpoint**: `/api/profile/level`
- **Method**: PUT
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
  ```json
  {
    "level": "string"
  }
  ```
- **Response**: 200 OK
  ```json
  {
    "updated": true
  }
  ```