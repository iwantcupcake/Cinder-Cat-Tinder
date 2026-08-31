# Cinder - Tinder for Your Cat Obsession 🐱

A private, friends-only "Tinder for cats" web app built with Next.js 14, Supabase, and Framer Motion. Swipe right on your next feline crush and compare your cat taste compatibility with friends!

## Features

- **Swipe Interface**: Tinder-style card swiping with smooth animations using Framer Motion
- **Cat Images**: Integration with TheCatAPI and CATAAS for adorable cat photos
- **Authentication**: Secure email/password authentication via Supabase Auth
- **Compatibility Scoring**: Algorithm to compare cat taste preferences between users
- **Private & Friends-Only**: Share compatibility links with friends to compare preferences
- **Mobile-First Design**: Responsive layout optimized for mobile devices
- **Real-Time Actions**: Server Actions for instant swipe recording

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth + Postgres + RLS)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Tinder-like gradient theme (orange-pink gradient #FF6B35 to #FF4E7A, teal accent #00C2B3)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- TheCatAPI key (free at [thecatapi.com](https://thecatapi.com/))

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project" and create a new project
3. Wait for the project to be provisioned (takes a few minutes)
4. Navigate to your project settings

### 2. Set Up Database Schema

1. In your Supabase project, go to the SQL Editor
2. Copy the contents of `sql/schema.sql`
3. Paste and run the SQL script to create the required tables and RLS policies

The schema includes:
- `cat_images`: Stores cat image data with breed, color, and tags
- `swipes`: Records user swipe actions (like/nope)
- `compatibility_checks`: Stores computed compatibility scores

### 3. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Fill in your environment variables in `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
THECATAPI_KEY=your_thecatapi_key
```

**Where to find these keys:**
- **SUPABASE_URL**: In Supabase project settings → API → Project URL
- **SUPABASE_ANON_KEY**: In Supabase project settings → API → anon/public key
- **SUPABASE_SERVICE_ROLE_KEY**: In Supabase project settings → API → service_role key (⚠️ Keep this secret!)
- **THECATAPI_KEY**: Sign up at [thecatapi.com](https://thecatapi.com/) and get your free API key

### 4. Install Dependencies

```bash
npm install
```

### 5. Seed Cat Images

Run the seed script to populate your database with cat images:

```bash
npm run seed
```

This will fetch ~80 cat images from TheCatAPI (with fallback to CATAAS) and insert them into your database.

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
cinder/
├── actions/              # Server Actions
│   ├── authActions.ts   # Authentication actions
│   └── swipeActions.ts  # Swipe recording actions
├── components/          # React components
│   ├── Navbar.tsx      # Navigation bar
│   ├── SwipeCard.tsx   # Individual swipe card
│   └── SwipeDeck.tsx   # Card deck container
├── lib/                # Utility functions
│   ├── catImages.ts    # Cat image fetching and seeding
│   ├── compatibility.ts # Compatibility scoring algorithm
│   └── supabaseClient.ts # Supabase client configuration
├── scripts/            # Utility scripts
│   └── seedCatImages.ts # Database seeding script
├── sql/                # Database schema
│   └── schema.sql      # Supabase schema and RLS policies
├── src/
│   └── app/           # Next.js App Router pages
│       ├── app/       # Main swipe deck page
│       ├── compatibility/[userId]/ # Compatibility page
│       ├── login/     # Login page
│       ├── profile/   # User profile page
│       ├── signup/    # Signup page
│       ├── layout.tsx # Root layout
│       ├── page.tsx   # Landing page
│       ├── globals.css # Global styles
│       └── middleware.ts # Route protection
├── types/             # TypeScript types
│   └── database.ts   # Supabase generated types
└── package.json       # Dependencies and scripts
```

## Usage

### Authentication

1. Click "Sign up" on the landing page
2. Enter your email and create a password
3. You'll be automatically logged in and redirected to the swipe deck

### Swiping Cats

1. Navigate to the swipe deck (/app)
2. Swipe right (or click the heart) to like a cat
3. Swipe left (or click the X) to pass on a cat
4. Your swipes are recorded in real-time

### Checking Compatibility

1. Go to your profile page (/profile)
2. Click "Copy my compatibility link"
3. Share the link with a friend
4. When they open it, they'll see how compatible your cat tastes are

The compatibility algorithm considers:
- Swipe agreement (70% weight): How often you both like/dislike the same cats
- Attribute similarity (30% weight): Overlap in preferred breeds, colors, and traits

## API Routes & Pages

- `/` - Landing page
- `/login` - Email/password login
- `/signup` - Email/password signup
- `/app` - Protected swipe deck (requires authentication)
- `/profile` - User profile with compatibility link
- `/compatibility/[userId]` - Compatibility comparison page

## Database Schema

### cat_images
- `id` (UUID, primary key)
- `url` (TEXT, unique) - Image URL
- `source` (TEXT) - API source (thecatapi/cataas)
- `breed` (TEXT) - Cat breed
- `color` (TEXT) - Cat color
- `tags` (JSONB) - Array of personality traits
- `width` (INT) - Image width
- `height` (INT) - Image height
- `created_at` (TIMESTAMPTZ)

### swipes
- `id` (UUID, primary key)
- `user_id` (UUID, references auth.users)
- `cat_image_id` (UUID, references cat_images)
- `direction` (TEXT) - 'like' or 'nope'
- `created_at` (TIMESTAMPTZ)

### compatibility_checks
- `id` (UUID, primary key)
- `user_a_id` (UUID)
- `user_b_id` (UUID)
- `score` (NUMERIC) - Compatibility score (0-100)
- `explanation` (TEXT) - Human-readable explanation
- `created_at` (TIMESTAMPTZ)

## Security

- **Row Level Security (RLS)**: All database tables have RLS policies
- **Authentication**: Supabase Auth with email/password
- **Protected Routes**: Middleware protects /app, /profile, and /compatibility routes
- **Service Role**: Only server-side operations use service role key for seeding

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your project in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `THECATAPI_KEY`
4. Deploy!

### Environment Variables for Production

Make sure to add all environment variables in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `THECATAPI_KEY`

## Customization

### Color Palette

The app uses a Tinder-like gradient theme defined in `src/app/globals.css`:
- Primary gradient: `#FF6B35` to `#FF4E7A` (orange-pink)
- Background: `#F7F7F7` (off-white)
- Text: `#1F1F1F` (dark charcoal)
- Accent: `#00C2B3` (teal)

Modify these values in the CSS variables to change the color scheme.

### Compatibility Algorithm

The compatibility scoring algorithm in `lib/compatibility.ts` can be customized:
- Adjust the weight ratio (currently 70% agreement, 30% tag similarity)
- Modify the Jaccard similarity calculation
- Change the score thresholds for different compatibility levels

## Troubleshooting

### Supabase Connection Issues
- Verify your Supabase URL and keys are correct
- Check that your Supabase project is not paused
- Ensure RLS policies are properly configured

### Cat Images Not Loading
- Verify your TheCatAPI key is valid
- Check that the seed script ran successfully
- Ensure the cat_images table has data

### Authentication Not Working
- Verify email authentication is enabled in Supabase
- Check that your environment variables are set correctly
- Ensure you're using the correct Supabase project

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## Acknowledgments

- Cat images provided by [TheCatAPI](https://thecatapi.com/) and [CATAAS](https://cataas.com/)
- Built with [Next.js](https://nextjs.org/)
- Auth and database powered by [Supabase](https://supabase.com/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Icons from [Lucide](https://lucide.dev/)

Made with ❤️ for cat lovers everywhere!
