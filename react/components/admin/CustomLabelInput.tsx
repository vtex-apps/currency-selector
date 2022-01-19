import React, { useState } from 'react'

interface ICustomLabelInput {
  //   onLabelChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: any
}

const CustomLabelInput = ({ value }: ICustomLabelInput) => {
  const [inputValue, setInputValue] = useState(value)

  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e) return
    setInputValue(e.target.value)
    value = e.target.value
  }

  return <input value={inputValue} onChange={onChangeInputValue}></input>
}

export default CustomLabelInput
