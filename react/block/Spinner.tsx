import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Spinner as VtexSpinner } from 'vtex.styleguide'

const CSS_HANDLES = ['loadingContainer'] as const

const Spinner = () => {
  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.loadingContainer}>
      <VtexSpinner color="currentColor" size={26} />
    </div>
  )
}

export default Spinner
