import React from 'react'
import "./style.css"

function Input({type, label, state, setState, placeholder}) {
  return (
    <div className='input-wrapper'>
        <p className='label-input'>{label}</p>
        <input type={type} value={state} placeholder={placeholder} className="custom-input" onChange={(e)=>setState(e.target.value)}></input>
    </div>
  )
}

export default Input