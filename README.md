Full-Stack E-Commerce Platform: "The প্রফেসর"
=============================================

This repository contains the complete source code for "The প্রফেসর," a modern, full-featured e-commerce platform built with a Django backend and a React frontend. The application is designed to be a robust, scalable, and user-friendly online store with a comprehensive admin dashboard for complete site management.

Table of Contents
-----------------

1.  [Core Technologies](https://www.google.com/search?q=#core-technologies)
    
2.  [Backend Features (Django)](https://www.google.com/search?q=#backend-features-django)
    
3.  [Frontend Features (React)](https://www.google.com/search?q=#frontend-features-react)
    
4.  [Installation & Setup](https://www.google.com/search?q=#installation--setup)
    
5.  [Project Structure](https://www.google.com/search?q=#project-structure)
    

Core Technologies
-----------------

### Backend

*   **Framework:** Django & Django REST Framework (DRF)
    
*   **Authentication:** Djoser with JSON Web Tokens (JWT) for secure, stateless authentication.
    
*   **Database:** SQLite (for development)
    
*   **Admin Panel:** django-unfold for a modern admin interface.
    
*   **Other:** django-solo for singleton models (Site Configuration), django-filter for API filtering.
    

### Frontend

*   **Framework:** React (with Vite for fast development)
    
*   **State Management:** Redux Toolkit for a centralized, predictable state container.
    
*   **Routing:** React Router for client-side navigation.
    
*   **Styling:** Tailwind CSS for a utility-first, fully responsive design.
    
*   **UI Components:** swiper/react for carousels, react-image-gallery for product image galleries, lucide-react for icons.
    

Backend Features (Django)
-------------------------

### 1\. Custom User & Authentication System

*   **Custom User Model:** Uses email as the primary identifier instead of a username.
    
*   **JWT Authentication:** Secure token-based authentication with access and refresh tokens to maintain user sessions without frequent logouts.
    
*   **User Roles & Permissions:** Utilizes Django's built-in Group model to define roles (e.g., Staff, Manager). API endpoints are protected, granting permissions based on user roles (is\_staff).
    
*   **Djoser Integration:** Handles all standard authentication endpoints (login, register, password reset, etc.) out of the box.
    

### 2\. Product & Inventory Management

*   **Product Catalog:** Models for Products, Categories, Colors, and Sizes.
    
*   **Inventory System:** Each product has a stock\_quantity that is automatically decremented upon a successful order.
    
*   **Product Attributes:** Products can be assigned multiple colors and sizes (Many-to-Many relationship).
    
*   **Product Tags:** Special tags like "New," "Hot," or "Special" can be assigned to products for display on the frontend.
    
*   **Featured Products:** A boolean flag (is\_featured) allows specific products to be showcased on the homepage.
    
*   **Multiple Images:** Each product supports a main image and a gallery of additional images.
    
*   **Automatic Image Deletion:** A signal-based system automatically deletes unused image files from the server when products or images are updated or deleted, saving storage space.
    

### 3\. Dynamic Content Management

*   **Site Configuration:** A singleton model allows admins to manage global site settings (site name, logo, contact info, video URLs) from a single place.
    
*   **Homepage Carousel:** A dedicated HeroSlide model allows admins to create, edit, and manage slides for the homepage carousel, each with its own image, title, and link.
    
*   **Featured Categories:** A boolean flag (is\_featured) on the Category model allows admins to control which categories are displayed prominently on the homepage.
    

### 4\. E-Commerce Functionality

*   **Order Management:** A dedicated orders app with models for Order and OrderItem to track customer purchases, total price, shipping details, and order status.
    
*   **Wishlist System:** Users can save products to a personal wishlist, which is tied to their account.
    
*   **Review System:** Authenticated users can submit a star rating and a comment for any product. The system prevents a user from reviewing the same product more than once.
    
*   **Efficient Data Fetching:** The API uses database annotations (Avg, Count) to efficiently calculate and provide the average rating and review count for products.
    

### 5\. Admin & Public APIs

*   **Separated APIs:** The system is architected with two main API prefixes:
    
    *   /api/: For public, read-only data (e.g., fetching products for the shop page).
        
    *   /api/manage/: For secure, authenticated endpoints for user-specific actions (wishlist, orders) and admin management (CRUD operations on products, categories, users, etc.).
        
*   **Advanced Filtering & Searching:** The product list endpoint supports filtering by category, color, size, price range, and tags, as well as full-text search.
    
*   **Pagination:** All list endpoints are paginated to ensure efficient data loading.
    

Frontend Features (React)
-------------------------

### 1\. Modern Frontend Stack

*   **Vite:** Provides a lightning-fast development server and optimized build process.
    
*   **Redux Toolkit:** Centralized state management for the entire application, including slices for products, categories, cart, auth, orders, users, and more.
    
*   **Responsive Design:** Built with Tailwind CSS, the entire application is "pixel-perfect responsive" and provides an optimal user experience on mobile, tablet, and desktop devices.
    

### 2\. User-Facing Features

*   **Dynamic Homepage:** Features a theme-styled carousel, a grid of featured categories, a section for featured products, a brand video player, latest arrivals, and a newsletter signup form.
    
*   **Advanced Shop Page:**
    
    *   Live search that updates as the user types.
        
    *   A comprehensive filtering sidebar to filter products by category, color, and size.
        
    *   Clean, paginated product grid.
        
*   **Detailed Product Page:**
    
    *   Image gallery with thumbnail navigation and zoom functionality.
        
    *   Displays product details, including available colors, sizes, and stock status.
        
    *   Tabbed section for description and a full review system.
        
    *   Review submission form with a star rating system for logged-in users.
        
    *   A "Related Products" section.
        
*   **Shopping Cart & Checkout:**
    
    *   Fully functional shopping cart with the ability to add, remove, and update item quantities.
        
    *   A mock checkout page to simulate the payment process and create an order.
        
*   **User Account System:**
    
    *   Secure login and registration pages.
        
    *   **Automatic Token Refresh:** A custom API utility automatically refreshes the user's session using the refresh token, preventing them from being logged out when the access token expires.
        
    *   **User Dashboard:** A dedicated section for users to view their complete order history.
        
    *   **Wishlist Page:** Allows users to view and manage their saved products.
        

### 3\. Comprehensive Admin Dashboard

*   A dedicated, secure section of the application for staff and admins.
    
*   **Product Management:** Full CRUD (Create, Read, Update, Delete) functionality for products, including a toggle switch to mark products as "featured."
    
*   **Category Management:** Full CRUD functionality for categories, including a toggle switch to mark them as "featured."
    
*   **Attribute Management:** Interface to add or delete product colors and sizes.
    
*   **Order Management:** View all customer orders and update their status (e.g., from "Pending" to "Shipped"). Includes a notification badge for new pending orders.
    
*   **User Management:** View all users and manage their status (active/inactive) and roles (assigning them to groups like "Staff").
    
*   **Hero Section Management:** Full CRUD functionality for the homepage carousel slides.
    
*   **Site Settings Management:** A form to update all global site configuration data, including the site name, logos, brand video URL, and contact information.
    

Installation & Setup
--------------------

### Backend

1.  Navigate to the backend directory.
    
2.  Create a virtual environment: python -m venv venv
    
3.  Activate it: source venv/bin/activate (Linux/macOS) or venv\\Scripts\\activate (Windows).
    
4.  Install dependencies: pip install -r requirements.txt
    
5.  Run migrations: python manage.py migrate
    
6.  Create a superuser: python manage.py createsuperuser
    
7.  Start the server: python manage.py runserver
    

### Frontend

1.  Navigate to the frontend directory.
    
2.  Install dependencies: npm install
    
3.  Start the development server: npm run dev
    

