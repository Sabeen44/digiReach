# DigiReach

DigiReach is a digital signage SaaS platform that allows businesses to upload, manage, and organize digital ads across multiple store locations. Built with React, Vite, Supabase, and Stripe, it provides a fast, modern dashboard for managing content.

---

## Overview

DigiReach helps local businesses streamline their digital advertising workflow. Users can upload ads, assign them to store locations, manage their subscription, and access a clean, intuitive dashboard.

---

## Features

### Platform
- Upload and manage digital ads
- Organize ads by store and location
- Real-time dashboard updates
- Clean, responsive UI built with Tailwind CSS

### Authentication
- Email/password login via Supabase Auth
- Protected routes
- Global session handling with AuthContext

### File Storage
- Secure uploads to Supabase Storage
- Files stored under each user’s unique folder
- Automatic public URL generation
- Metadata stored in the database

### Billing
- Stripe Checkout integration
- Free and Pro plans
- Subscription status synced via webhooks
- Feature gating based on plan

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router

### Backend / Infrastructure
- Supabase (Auth, Database, Storage)
- Supabase Edge Functions (optional)
- Stripe (billing)

### Deployment
- Vercel (frontend)
- Supabase (backend + storage)

---

## Project Structure

src/
components/      # Reusable UI components
pages/           # Route-level pages
hooks/           # Custom hooks
context/         # AuthContext and providers
lib/             # Supabase client and utilities
styles/          # Global styles
types/           # TypeScript types (if using TS)

---

## Authentication Flow

1. User signs up or logs in through Supabase Auth  
2. Session is returned and stored in AuthContext  
3. Protected routes check for an active session  
4. Subscription status is fetched and stored  
5. Users without a plan are gated from premium features  

---

## File Upload Flow

1. User selects a location  
2. File is renamed using `crypto.randomUUID()`  
3. File is uploaded to Supabase Storage 
4. Public URL is generated  
5. Metadata is inserted into the database  
6. Dashboard updates to show the new ad  

---

## Billing Flow

1. User selects a subscription plan  
2. Stripe Checkout session is created  
3. On success, Stripe webhook updates subscription status  
4. Supabase stores subscription state  
5. App unlocks premium features  

---

## Deployment

- Frontend deployed on Vercel  
- Backend, database, and storage handled by Supabase  
- Environment variables configured for both environments  
- Optional: Edge Functions for secure server-side logic  

---

## Roadmap

- Team accounts  
- Analytics dashboard  
- Ad scheduling (time/day)  
- AI-powered ad generation  
- Mobile-friendly admin dashboard  

---

## Author

Built by Sabeen  
Full-stack developer focused on modern UI, SaaS products, and clean editorial design