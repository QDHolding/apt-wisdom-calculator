# APT Wisdom - Apartment Investment Analysis Calculator

A comprehensive apartment building investment analysis tool powered by AI. Generate detailed property reports, cap rate analysis, and professional offer letters with integrated payment processing.

## Features

- 🏢 **Comprehensive Property Analysis** - Input property details and get AI-powered investment analysis
- 📊 **Financial Metrics** - Cap rate calculations, cash flow analysis, NOI projections
- 📄 **Professional Reports** - Generate downloadable PDF reports and offer letters
- 💳 **Payment Integration** - Stripe-powered subscription system with free trial (2 reports)
- 🤖 **AI-Powered** - OpenAI GPT-4 integration for intelligent analysis and recommendations
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **AI**: OpenAI GPT-4 via AI SDK
- **Payments**: Stripe
- **PDF Generation**: jsPDF with custom formatting
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/apt-wisdom-calculator.git
cd apt-wisdom-calculator
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:
```env
OPENAI_API_KEY=your_openai_api_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

1. **Property Analysis**: Fill out the comprehensive property form with address, pricing, unit mix, and operating expenses
2. **AI Analysis**: Click "Run AI Analysis" to generate detailed investment report
3. **Offer Generation**: Proceed to generate professional offer templates and letters
4. **PDF Downloads**: Download formatted reports (2 free, then paid subscription required)

## API Routes

- `/api/analyze-property` - Generate AI property analysis
- `/api/generate-offer` - Create offer templates
- `/api/generate-offer-letter` - Generate formatted offer letters
- `/api/create-checkout-session` - Stripe payment processing
- `/api/webhook` - Stripe webhook handler

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

Make sure to set all environment variables and configure Stripe webhooks for production.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Private - All rights reserved
