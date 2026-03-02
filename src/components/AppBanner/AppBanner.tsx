import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export const AppBanner = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const showBackButton = location.pathname !== '/' && location.pathname !== '/pages/RoleSelectionPage'

  return (
    <header className="bg-foreground border-b-4 border-foreground">
      <div className="max-w-[1420px] mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 px-3 py-2 bg-white text-foreground border-2 border-white hover:bg-background transition-colors duration-200 font-bold text-xs uppercase tracking-wide shadow-[2px_2px_0px_0px_white] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
              <span>Back</span>
            </button>
          )}
          <h1 className="font-black text-xl sm:text-2xl lg:text-3xl uppercase tracking-tighter text-white leading-[0.9]">
            Recruit.me
          </h1>
        </div>
      </div>
    </header>
  )
}
