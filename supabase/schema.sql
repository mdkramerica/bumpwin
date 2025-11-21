
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE trip_status AS ENUM ('UPCOMING', 'COMPLETED', 'CANCELED');
CREATE TYPE claim_status AS ENUM ('DRAFT', 'PAID_UNLOCK', 'SUBMITTED', 'APPROVED');

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL,
  referral_code VARCHAR UNIQUE DEFAULT substring(md5(random()::text), 0, 8), -- Auto-generate 8-char code
  stripe_customer_id VARCHAR,
  total_referral_earnings DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trips
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  airline_code VARCHAR(3) NOT NULL,
  flight_number VARCHAR(10) NOT NULL,
  scheduled_departure TIMESTAMP WITH TIME ZONE NOT NULL,
  ticket_price DECIMAL(10, 2),
  status trip_status DEFAULT 'UPCOMING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Claims
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status claim_status DEFAULT 'DRAFT',
  estimated_payout DECIMAL(10, 2),
  
  -- The Paywall Key
  is_unlocked BOOLEAN DEFAULT FALSE, 
  stripe_session_id VARCHAR,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users view own trips" ON trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own claims" ON claims FOR SELECT USING (auth.uid() = user_id);
