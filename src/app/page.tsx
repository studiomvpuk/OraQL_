import Link from 'next/link';
import { ArrowRight, TrendingUp, Target, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen surface-warm">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f9f7f3]/95 backdrop-blur-sm border-b border-[#e5dfd6]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#d4a574] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <span className="text-lg font-bold text-[#1a1815]">OraQL_</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth?mode=login"
              className="text-[#1a1815] hover:text-[#d4a574] transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/auth?mode=register"
              className="px-6 py-2 bg-[#1a1815] text-[#f9f7f3] rounded-lg hover:bg-[#2a2520] transition-colors font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-20 right-10 deco-letter warm">O</div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-[#1a1815] mb-6 leading-tight">
              Smarter bets start with better data
            </h1>
            <p className="text-xl text-[#3a3530] mb-8 font-light">
              OraQL_ combines advanced analytics, real-time market data, and predictive intelligence
              to transform how you make betting decisions.
            </p>
            <div className="flex gap-4">
              <Link
                href="/auth?mode=register"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#1a1815] text-[#f9f7f3] rounded-lg hover:bg-[#2a2520] transition-colors font-medium"
              >
                Start Free Trial
                <ArrowRight size={18} />
              </Link>
              <button className="px-8 py-3 border-2 border-[#1a1815] text-[#1a1815] rounded-lg hover:bg-[#f5f1e8] transition-colors font-medium">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#1a1815] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#f9f7f3] mb-16 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#2a2520] p-8 rounded-lg">
              <div className="w-12 h-12 bg-[#d4a574] rounded-lg flex items-center justify-center text-[#1a1815] font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-[#f9f7f3] mb-3">Connect Your Data</h3>
              <p className="text-[#b8b0a5] font-light">
                Integrate your betting accounts and configure your preferred sports and markets.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#2a2520] p-8 rounded-lg">
              <div className="w-12 h-12 bg-[#d4a574] rounded-lg flex items-center justify-center text-[#1a1815] font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-[#f9f7f3] mb-3">Get Smart Picks</h3>
              <p className="text-[#b8b0a5] font-light">
                Receive AI-powered betting recommendations with confidence scores and detailed analysis.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#2a2520] p-8 rounded-lg">
              <div className="w-12 h-12 bg-[#d4a574] rounded-lg flex items-center justify-center text-[#1a1815] font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-[#f9f7f3] mb-3">Track & Optimize</h3>
              <p className="text-[#b8b0a5] font-light">
                Monitor your results and refine your strategy with real-time performance analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 surface-warm">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#1a1815] mb-16 text-center">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-8 border border-[#e5dfd6]">
              <TrendingUp className="w-8 h-8 text-[#d4a574] mb-4" />
              <h3 className="text-lg font-bold text-[#1a1815] mb-2">Live Market Analysis</h3>
              <p className="text-[#3a3530] font-light">
                Real-time odds tracking and market movement analysis across all major sportsbooks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-8 border border-[#e5dfd6]">
              <Target className="w-8 h-8 text-[#d4a574] mb-4" />
              <h3 className="text-lg font-bold text-[#1a1815] mb-2">Precision Predictions</h3>
              <p className="text-[#3a3530] font-light">
                Machine learning models trained on millions of historical outcomes for accurate forecasts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-8 border border-[#e5dfd6]">
              <Zap className="w-8 h-8 text-[#d4a574] mb-4" />
              <h3 className="text-lg font-bold text-[#1a1815] mb-2">Instant Alerts</h3>
              <p className="text-[#3a3530] font-light">
                Get notified immediately when high-confidence opportunities match your criteria.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg p-8 border border-[#e5dfd6]">
              <TrendingUp className="w-8 h-8 text-[#d4a574] mb-4" />
              <h3 className="text-lg font-bold text-[#1a1815] mb-2">Performance Tracking</h3>
              <p className="text-[#3a3530] font-light">
                Comprehensive dashboards showing ROI, win rate, and detailed performance metrics.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-lg p-8 border border-[#e5dfd6]">
              <Target className="w-8 h-8 text-[#d4a574] mb-4" />
              <h3 className="text-lg font-bold text-[#1a1815] mb-2">Smart Filters</h3>
              <p className="text-[#3a3530] font-light">
                Advanced filtering by sport, league, probability range, and custom criteria.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-lg p-8 border border-[#e5dfd6]">
              <Zap className="w-8 h-8 text-[#d4a574] mb-4" />
              <h3 className="text-lg font-bold text-[#1a1815] mb-2">Custom Builder</h3>
              <p className="text-[#3a3530] font-light">
                Build custom parlays and multi-leg bets with combined probability calculations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#2a2520] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-[#f9f7f3] mb-6">Ready to elevate your betting game?</h2>
          <p className="text-lg text-[#b8b0a5] mb-8 font-light">
            Join thousands of bettors making smarter decisions with OraQL_.
          </p>
          <Link
            href="/auth?mode=register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#d4a574] text-[#1a1815] rounded-lg hover:bg-[#c99465] transition-colors font-bold text-lg"
          >
            Start Your Free Trial
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1815] text-[#b8b0a5] py-12 border-t border-[#2a2520]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#d4a574] rounded-lg flex items-center justify-center">
                  <span className="text-[#1a1815] font-bold text-xs">O</span>
                </div>
                <span className="font-bold text-[#f9f7f3]">OraQL_</span>
              </div>
              <p className="text-sm font-light">Sports betting intelligence, redefined.</p>
            </div>
            <div>
              <h4 className="font-bold text-[#f9f7f3] mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-[#d4a574] transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#d4a574] transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#d4a574] transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#f9f7f3] mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-[#d4a574] transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#d4a574] transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#d4a574] transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#f9f7f3] mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-[#d4a574] transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#d4a574] transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#d4a574] transition-colors">
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#2a2520] pt-8 text-center text-sm">
            <p>© 2024 OraQL_. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
