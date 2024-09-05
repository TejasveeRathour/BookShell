# BookShell
BookShell is an online platform created using the MERN stack (MongoDB, Express.js, React, Node.js) for selling books. The application allows users to browse through a variety of books, add them to their cart, and make secure payments through Razorpay. Additionally, the platform offers a Cash on Delivery (COD) option. The project is structured into a client-side (frontend) and a server-side (backend) setup, and it pulls relevant data from four different databases.

# Features
1.	User Authentication: Secure login and registration system.
2.	Book Catalog: Browse through a variety of books, with details on each.
3.	Shopping Cart: Add and remove books from the cart.
4.	Order History: View previous orders and their details.
5.	Favorite Books: Mark books as favorites and view them later.
6.	Responsive Design: The layout adapts to different screen sizes for a seamless user experience.
7.	Payment Integration: Razorpay is integrated for online payments, with an option for COD.

# Technology Stack
# Frontend
1.	React.js: User interface development.
2.	React Router: Client-side routing.
3.	Redux: State management.
4.	CSS: Styling components for responsiveness and aesthetics.
# Backend
1.	Node.js: Server-side JavaScript runtime.
2.	Express.js: Web framework for handling routes and server logic.
3.	MongoDB: NoSQL database for storing user, book, and order data.
4.	Razorpay API: Integrated for handling online payments.

# Database Structure
The project utilizes four main databases:

1.	Users: Stores user details, including authentication information.
2.	Books: Contains all the information about the books available on the platform.
3.	Orders: Logs the order history of users, including book details (excluding book ID).
4.	Favorites: Keeps track of users' favorite books for easy access later.

# Project Setup
# Prerequisites
1.	Node.js and npm installed.
2.	MongoDB instance running.
3.	Razorpay account for payment integration.

# Installation
1.	Clone the repository:
    git clone https://github.com/yourusername/BookShell.git

2.	Install dependencies for both frontend and backend:
    cd BookShell
    npm install
    cd client
    npm install

3.	Create a .env file in the root directory for environment variables (e.g., MongoDB URI, Razorpay API keys).
4.	Start the development server:
    cd ..
    npm run dev

# Usage
1.	Visit http://localhost:3000 to access the application.
2.	Browse books, add them to your cart, and proceed to checkout.
3.	Make payments using Razorpay or select the COD option.