import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const illustration = require('./LandingPageIllustration.jpg')

export const LandingPage = () => {
  return (
    <main className="min-h-screen bg-background border-b-4 border-foreground">
      {/* Hero: asymmetric two-panel layout */}
      <section className="max-w-[1420px] mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:py-24 lg:px-8">
        {/* Headline + image aligned: bottom of image = end of APPLICANTS */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12 items-stretch">
          <h2 className="order-2 lg:order-1 font-black text-4xl sm:text-6xl lg:text-8xl uppercase tracking-tighter leading-[0.9] text-foreground">
            Connecting the Best Companies to the Best Applicants
          </h2>
          <figure className="order-1 lg:order-2 w-full h-full min-h-[240px] sm:min-h-[320px] border-2 sm:border-4 border-foreground shadow-bauhaus-lg overflow-hidden">
            <img
              src={illustration}
              alt="Team investigating potential applicants"
              className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-300"
            />
          </figure>
        </div>
        {/* Rest of copy and CTA */}
        <div className="mt-8 sm:mt-10 lg:mt-12 space-y-3">
          <p className="font-bold text-xl sm:text-2xl lg:text-3xl uppercase text-foreground/90 max-w-xl">
            Since Day One.
          </p>
          <p className="font-medium text-base sm:text-lg text-foreground/80 max-w-lg">
            Streamline your job search today.
          </p>
          <div className="mt-8 sm:mt-10">
            <Link to="/pages/RoleSelectionPage">
              <Button variant="primary" size="lg" shape="square">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" strokeWidth={2.5} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
