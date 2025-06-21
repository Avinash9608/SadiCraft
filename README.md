# ShaadiCraft: AI-Powered Matrimonial Biodata Generator

Welcome to ShaadiCraft! This is a modern, feature-rich web application built with Next.js, TypeScript, and Firebase. It allows users to create, customize, and download beautiful matrimonial biodatas, with a premium membership system for advanced features.

## Core Features

*   **User Authentication**: Secure user registration and login system powered by Firebase Authentication.
*   **Comprehensive Biodata Form**: A multi-tabbed interface for users to input all necessary details:
    *   Personal & Contact Information
    *   Family Background
    *   Educational Qualifications
    *   Professional Career
    *   Lifestyle & Hobbies
*   **AI Introduction Generator**: Utilizes **Genkit** and Google's AI models to automatically craft a warm, personalized introductory paragraph based on the user's profile, tailored to the chosen layout style.
*   **Real-time Preview**: A live preview panel that instantly reflects any changes made in the form, showing exactly how the final biodata will look.
*   **Layout Selection**: Users can choose between a sleek **Modern** layout and an elegant **Traditional** layout.
*   **Photo Upload**: Easy-to-use interface for uploading and managing a profile photograph.
*   **PDF Export**: Download the final, polished biodata in a high-quality PDF format, ready for sharing.

## Technical Architecture & Workflow

ShaadiCraft is built on a robust and scalable tech stack designed for a great user experience and reliable performance.

*   **Frontend**: **Next.js** (App Router) with **React** and **TypeScript**.
*   **UI**: **ShadCN UI** for pre-built, accessible components, styled with **Tailwind CSS**.
*   **Backend & Database**: **Firebase** serves as the backend, with **Firestore** for the database and **Firebase Authentication** for user management.
*   **Generative AI**: **Genkit** is used to define and manage flows that interact with Google's Gemini models for the AI introduction feature.

### How It Works

1.  **Registration & Login**: A new user creates an account, and a corresponding user document is created in Firestore with a default `free` membership plan.
2.  **Biodata Creation**: The user fills out the form on the `/create` page. Data is saved to `sessionStorage` in real-time to prevent loss.
3.  **Monetization & Feature Gating**: The application operates on a **freemium model** (Free, Silver, Gold, Platinum).
    *   Access to premium features (like the Traditional layout or ad-free experience) is controlled by the user's subscription plan.
    *   The **`AuthContext`** establishes a **real-time listener** to the user's document in Firestore. This ensures that when a plan is upgraded, features are unlocked instantly without a page refresh.
4.  **Checkout & Payment**:
    *   Users can upgrade their plan via the `/checkout` page.
    *   Payments are processed securely through **Razorpay**.
5.  **Subscription Activation**: Upon successful payment, a server action updates the user's document in Firestore with the new plan details (e.g., `plan: 'silver'`, expiry date). The real-time listener in the UI detects this change, unlocks the corresponding features, and redirects the user.
6.  **PDF Generation**: The app uses the `html2pdf.js` library to convert the live preview's HTML into a downloadable PDF.

This architecture provides a seamless flow from registration to payment and feature activation, creating a professional and reliable user experience.
