import { useNavigate } from 'react-router-dom'
import { Button } from '../../ui/Button'
import { ChevronLeft } from 'lucide-react'

export const BackButton = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(-1)
  }

  return (
    <div className="bg-background border-b-2 border-foreground py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Button variant="outline" size="sm" onClick={handleClick}>
          <ChevronLeft className="w-4 h-4 mr-1" strokeWidth={2.5} />
          <span className="uppercase font-bold text-xs tracking-wide">Back</span>
        </Button>
      </div>
    </div>
  )
}
