import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
  typescript: true,
});

// Dynamic URL based on environment
const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export const STRIPE_CONFIG = {
  PRICE_ID: process.env.STRIPE_PRICE_ID, // The $19 Product ID from .env
  SUCCESS_URL: `${BASE_URL}/dashboard?success=true&claim_id={CHECKOUT_SESSION_ID}`,
  CANCEL_URL: `${BASE_URL}/dashboard?canceled=true`,
};
