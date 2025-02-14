# Splurge O' Scrooge

## Overview

**Splurge O' Scrooge** is a financial planning app designed to help users make smart spending decisions using the **50-30-20 rule**. The app integrates **React** for the frontend and **Node.js, Express, PostgreSQL** for the backend, with API support for Consumer Price Index Average Price Data.

## Features

- **Budget Strategy Planning**: Categorize expenses into Needs, Wants, and Savings.
- **Price Lookup**: Search average prices for various items.
- **Decision-Making Tool**: Get insights on whether to splurge or save.
- **User Authentication**: Signup/Login with JWT authentication.
- **State Management**: Implemented using React Context & Hooks.

---

## Technologies Used

### Frontend:

- React.js
- React Router
- Material UI

### Backend:

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM

### API Integration:

- **Consumer Price Index Average Price Data API**

---

## Installation

### 1. Clone the Repository

```sh
# Clone frontend and backend separately
git clone https://github.com/your-username/capstone-frontend.git
git clone https://github.com/your-username/capstone-backend.git
```

### 2. Install Dependencies

#### **Frontend**

```sh
cd capstone-frontend
npm install
```

#### **Backend**

```sh
cd ../capstone-backend
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the **backend** directory and add:

```env
DATABASE_URL=postgres://your-user:your-password@localhost:5432/your-database
JWT_SECRET=your-secret-key
PORT=5000
```

---

## Running the Application

### **Start Backend Server**

```sh
cd capstone-backend
npm run dev
```

### **Start Frontend Server**

```sh
cd ../capstone-frontend
npm start
```

The frontend will be available at [**http://localhost:3000**](http://localhost:3000), and the backend API will be running at [**http://localhost:5000**](http://localhost:5000).

---

## Running Tests

### **Run Unit Tests**

```sh
npm test tests/unit.js
```

### **Run Integration Tests**

```sh
npm test tests/integration.js
```

---

## API Routes

### **Auth Routes**

| Method | Endpoint           | Description                      |
| ------ | ------------------ | -------------------------------- |
| POST   | `/api/auth/signup` | Register a new user              |
| POST   | `/api/auth/login`  | Authenticate user and return JWT |

### **Budget Routes**

| Method | Endpoint      | Description             |
| ------ | ------------- | ----------------------- |
| GET    | `/api/budget` | Get user budget details |
| POST   | `/api/budget` | Create or update budget |

### **Price Lookup Routes**

| Method | Endpoint                            | Description                    |
| ------ | ----------------------------------- | ------------------------------ |
| GET    | `/api/price-lookup?query=ITEM_NAME` | Fetch average price of an item |

---

## Deployment

### **Deploy Backend to Supabase**

```sh
NODE_ENV: production
DATABASE_URL: https://trbztvdblzwjmucvqgxx.supabase.co
JWT_SECRET=secret-dev
```

### **Deploy Frontend to Render**

https://splurgeoscrooge-backend.onrender.com

---

## Contributing

Pull requests are welcome! Please follow these guidelines:

- Fork the repository
- Create a feature branch (`git checkout -b feature-name`)
- Commit changes (`git commit -m "Added new feature"`)
- Push to the branch (`git push origin feature-name`)
- Submit a pull request

---

## License

This project is licensed under the MIT License.

