# Flipzon Flash Sale API
## Overview

The Flipzon Flash Sale API is designed to handle high-traffic sales events for an eCommerce platform, where a limited quantity of iPhones are sold at a specific time. This project provides backend functionality to manage flash sales, including handling user authentication, managing product stock, and processing orders during high-demand periods.


## Features

- **Flash Sale Management:** Schedule and manage flash sales for limited stock items.
- **User Authentication:** Login and signup functionality for users.
- **Order Placement:** Place orders for products during a flash sale.
- **Stock Management:** Handle stock levels and enforce limits on orders.
- **Testing:** Includes unit and stress tests to ensure the API handles high traffic.


## Installation

### Prerequisites

- Node.js and npm
- MongoDB (local or cloud instance)

### Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/saurabhs402/Flipzon.git
   cd Flipzon
2. **Install Dependencies:**
     ```
     npm install
    ```
3. **Set Up Environment Variables:**

     Create a .env file in the root directory and add the following:

     ```
      PORT=3000

      CONN_STR='mongodb-atlas-conn-string' or 'mongodb://localhost:27017/flashsale'

      JWT_SECRET_STR='your_jwt_secret_key'

     ```

4. **Run Migrations:**

     Ensure your MongoDB instance is running, then:

     ```
     npm run migrate
     ```
5. **Start the Server:**
     ```
     npm start
     ```

      The API will be available at http://localhost:3000 .


## API Endpoints
 ### Authentication
 1. **POST /api/auth/signup**

    Sign up a new user.

    **Example Request:**
    - **Body**
     ```
      {
         "username": "testuser",
         "email": "test@example.com",
         "password": "password123"
      }
      ```
     **Example Response:**
      ```
         {
            "token": "jwt_token_here",
            "message": "User registered successfully"
          }
      ```
2. **POST /api/auth/login**

   Authenticate a user and get a JWT token.

   **Example Request:**
   - **Body**

    ```
      {
        "email": "test@example.com",
        "password": "password123"
      }
     ```
   **Example Response:**
   ```
    {
     "token": "jwt_token_here"
    }
   ```

### Flash Sale

1. **POST /api/product**

   Create a new product

      **Example Request:**

    - **Headers**
      
      Authorization <token>
    - **Body**
     ```
      {
      "name": "iPhone 14",
      "price": 999.99,
      "stock": 500
      }

     ```
   **Example Response:**
      ```
     {

     "message": "Product created successfully",
     "product": {
        "_id": "605c72ef7d5f0a001f647a2c",
        "name": "iPhone 14",
        "price": 999.99,
        "stock": 500,
        "__v": 0
        }
    }

     ```

2. **POST /api/sale**

   Create a new sale

     **Example Request:**

    - **Headers**

      Authorization <token>
    - **Body**
     ```
      {
       "productId": "605c72ef7d5f0a001f647a2c",
       "quantity": 20,
       }
     ```
   **Example Response:**
      ```
     {
      "message": "Sale created successfully",
      "sale": {
         "_id": "605c72ef7d5f0a001f647a2d",
         "product": "605c72ef7d5f0a001f647a2c",
         "quantity": 20,
         "__v": 0
       }
    }
     ```

3. **GET /api/sale/:id**---(here id is saleId)

    Get details of a specific sale.

     **Example Request:**

    - **Headers**
      
      Authorization <token>

     **Example Response:**
    ```
    {
      "saleId": "sale_id_here",
       "product": "product_name_here",
       "price": 1000,
       "availableStock": 999,
       "startTime": "start_time_here",
       "endTime": ""end_time_here""
    }
    ```
4. **POST /api/order** 

    Place an order for the flash sale.

    **Example Request:**

     - **Headers**
      
         Authorization <token>
     ```
     {
      "productId": "product_id_here",
      "quantity": 1
     }
    ```
   **Example Response:**
   ```
   {
    "message": "Order placed successfully"
   }
   ```

## Testing
### Unit Tests
Unit tests are implemented using Mocha and Chai. To run the tests:

1.**Run Tests:**
```
npm run test
```




