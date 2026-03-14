import { Analytiq, identify, reset, track } from 'analytiq/react'
import { useEffect, useContext } from 'react'
import { AuthContext } from './context/AuthContext'

export function AnalyticsProvider({ children }) {
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (user && user._id) {
      identify(user._id)
    } else {
      reset()
    }
  }, [user])

  return (
    <>
      <Analytiq apiKey={import.meta.env.VITE_ANALYTIQ_API_KEY} />
      {children}
    </>
  )
}

export { track }
