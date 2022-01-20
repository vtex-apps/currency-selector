import type { FC } from 'react'
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { Alert } from 'vtex.styleguide'

interface AlertContextInterface {
  openAlert: (status: 'success' | 'error', entryMessage: string) => void
}

const AlertContext = createContext<AlertContextInterface>(
  {} as AlertContextInterface
)

const AlertProvider: FC = ({ children }) => {
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState<'success' | 'error' | ''>('')

  const handleClose = useCallback(() => {
    if (open) {
      setOpen('')
    }
  }, [open])

  const openAlert = (status: 'success' | 'error', entryMessage: string) => {
    setMessage(entryMessage)
    setOpen(status)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleClose()
    }, 5000)

    return () => {
      clearTimeout(timeout)
    }
  }, [handleClose, open])

  return (
    <AlertContext.Provider value={{ openAlert }}>
      {open ? (
        <div className="w-100 fixed z-max overflow-hidden">
          <div
            className="mt7"
            style={{ maxWidth: '520px', margin: '2rem auto' }}
          >
            <Alert type={open} onClose={handleClose}>
              {message}
            </Alert>
          </div>
        </div>
      ) : null}
      {children}
    </AlertContext.Provider>
  )
}

const useAlert = () => useContext(AlertContext)

export { AlertProvider, useAlert }
