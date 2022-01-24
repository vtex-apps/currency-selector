import React, { useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import CustomLabel from '../block/CustomLabel'
import Spinner from '../block/Spinner'

const CSS_HANDLES = [
  'list',
  'listElement',
  'container',
  'relativeContainer',
  'button',
  'buttonText',
] as const

const CurrencySelectorDropdown = ({
  currentSalesChannel,
  labelFormat,
  salesChannelList,
  onSalesChannelSelection,
  isLoading,
}: ComponentViewProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { handles, withModifiers } = useCssHandles(CSS_HANDLES)
  const relativeContainerRef = React.useRef<HTMLDivElement>(null)

  const handleOutsideClick = (event: MouseEvent) => {
    if (!relativeContainerRef.current?.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleSelection = (salesChannel: SalesChannelBlock) => {
    const closeModal = () => setIsOpen(false)

    onSalesChannelSelection(
      salesChannel.id.toString(),
      salesChannel.cultureInfo,
      closeModal
    )
  }

  const containerClasses = withModifiers('container', [isOpen ? 'active' : ''])

  return (
    <div
      className={`flex items-center justify-center relative ${containerClasses}`}
    >
      <div
        ref={relativeContainerRef}
        className={`${handles.relativeContainer}`}
      >
        {isLoading ? (
          <Spinner />
        ) : !currentSalesChannel ? null : (
          <>
            <button
              type="button"
              className={`link bg-transparent bn pointer c-on-base ${handles.button}`}
              onClick={handleClick}
            >
              <span className={`${handles.buttonText}`}>
                <CustomLabel
                  {...currentSalesChannel}
                  labelFormat={labelFormat}
                />
              </span>
            </button>
            <ul
              hidden={!isOpen}
              className={`absolute z-9999 list ph0 w-100 bg-base ${handles.list}`}
            >
              {salesChannelList
                .filter(salesChannel => !salesChannel.isCurrent)
                .map(salesChannel => (
                  <li
                    key={salesChannel.id}
                    className={`t-action--small pointer hover-bg-muted-5 tc f5 pa3 ${handles.listElement}`}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => handleSelection(salesChannel)}
                      onKeyDown={() => handleSelection(salesChannel)}
                      onTouchStartCapture={e => e.preventDefault()}
                      onTouchStart={() => handleSelection(salesChannel)}
                      onTouchMove={() => handleSelection(salesChannel)}
                    >
                      <CustomLabel
                        {...salesChannel}
                        labelFormat={labelFormat}
                      />
                    </div>
                  </li>
                ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

export default CurrencySelectorDropdown
