import ApartmentAnalysisForm from "../apartment-analysis-form"
import { Building, TrendingUp, DollarSign, BarChart3, Gift } from "lucide-react"
import { Logo } from "@/components/logo"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-investor-cream to-white">
      {/* Header with Logo */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <Logo size="lg" />
          <div className="text-sm text-investor-slate">Professional Apartment Analysis</div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-wealth-gradient text-white py-16 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center"></div>
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Turn Property Data Into <span className="text-investor-gold">Profitable Decisions</span>
            </h1>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              Professional-grade apartment analysis that helps investors identify opportunities others miss.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                <TrendingUp className="text-investor-gold mr-3 h-5 w-5" />
                <span>Maximize ROI</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                <DollarSign className="text-investor-gold mr-3 h-5 w-5" />
                <span>Optimize Offers</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                <BarChart3 className="text-investor-gold mr-3 h-5 w-5" />
                <span>AI-Powered Insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-7xl py-12">
        {/* Free Trial Banner */}
        <div className="bg-investor-gold/20 border border-investor-gold/30 rounded-xl p-6 mb-10 shadow-premium">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-investor-gold/30 p-3 rounded-full mr-4">
                <Gift className="h-8 w-8 text-investor-navy" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-investor-navy mb-1">Try Before You Buy</h3>
                <p className="text-investor-slate">
                  Get <span className="font-semibold">2 free property analyses</span> to experience the power of our
                  AI-driven insights.
                </p>
              </div>
            </div>
            <div className="bg-white px-5 py-3 rounded-lg border border-investor-gold/20 text-investor-navy text-sm font-medium animate-float">
              No credit card required for free analyses!
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-investor-navy mb-4">AI-Powered Apartment Analysis</h2>
          <p className="text-investor-slate text-lg max-w-3xl mx-auto">
            Make confident investment decisions with our sophisticated analysis tool trusted by professional real estate
            investors.
          </p>
        </div>

        {/* Pricing Info */}
        <div className="bg-white border border-investor-sand rounded-xl p-6 mb-10 shadow-premium">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-xl font-semibold text-investor-navy mb-2 flex items-center">
                <Building className="mr-2 h-5 w-5 text-investor-gold" />
                Free Analysis, Premium Downloads
              </h3>
              <p className="text-investor-slate mb-2">
                Our AI-powered analysis is completely free to use for your first 2 properties. Analyze as many
                properties as you want after subscribing.
              </p>
              <p className="text-investor-slate">
                To download more reports and offer letters as PDF files, choose from our flexible plans starting at just
                $9.99.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-investor-gold/10 text-investor-navy rounded-lg px-5 py-3 border border-investor-gold/20 animate-pulse-subtle">
                <span className="font-semibold">Pro Tip:</span> Serious investors typically save 5-10x their
                subscription cost on their first deal.
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <ApartmentAnalysisForm />

        {/* Testimonials */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-investor-sand shadow-premium">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-investor-navy text-white flex items-center justify-center font-bold text-xl">
                JD
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-investor-navy">John Donovan</h4>
                <p className="text-sm text-investor-slate">Multi-family Investor</p>
              </div>
            </div>
            <p className="text-investor-slate italic">
              "This tool helped me identify a property with hidden value that others missed. The AI analysis gave me the
              confidence to make an offer that was accepted."
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-investor-sand shadow-premium">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-investor-burgundy text-white flex items-center justify-center font-bold text-xl">
                SR
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-investor-navy">Sarah Reynolds</h4>
                <p className="text-sm text-investor-slate">Real Estate Syndicator</p>
              </div>
            </div>
            <p className="text-investor-slate italic">
              "The detailed reports impressed my investors and helped us close on a 24-unit building. The professional
              offer letters give us a competitive edge."
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-investor-sand shadow-premium">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-investor-green text-white flex items-center justify-center font-bold text-xl">
                MK
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-investor-navy">Michael Kwan</h4>
                <p className="text-sm text-investor-slate">Commercial Broker</p>
              </div>
            </div>
            <p className="text-investor-slate italic">
              "I recommend this tool to all my clients. It helps them make faster decisions and gives them the
              confidence to move forward on properties with potential."
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-investor-navy text-white py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Logo size="md" variant="full" />
              <p className="text-white/70 text-sm mt-2">Professional apartment analysis for serious investors</p>
            </div>
            <div className="text-white/70 text-sm">
              © {new Date().getFullYear()} AptWisdom.com. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

