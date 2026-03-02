import { useState, useEffect, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

interface DisplayBackButtonProps {
     children: ReactNode
}

export const DisplayBackButton = ({
     children,
}: DisplayBackButtonProps) => {
     const location = useLocation()
     const [backButtonShows, setBackButtonShows] = useState(false)

     useEffect(() => {
          if (location.pathname === '/') {
               setBackButtonShows(false)
          } else {
               setBackButtonShows(true)
          }
     }, [location])

     if (backButtonShows) {
          return <>{children}</>
     } else {
          return null
     }
}
