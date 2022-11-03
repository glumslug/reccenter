import React from 'react'

const ModalYN = ({propFunction, toggle, prompt}) => {
  const handleYes = () => {
    propFunction()
    toggle(false)
  }
  return (
  <div className='modal-wrap'>  
    <div className='modal-yn'>
        <h3>{prompt}</h3>
        <div className="buttons">
          <div id="modal-no" onClick={()=>toggle(false)}>NO</div>
          <div id="modal-yes"onClick={()=>handleYes()}>YES</div>
        </div>
        
    </div>
    </div>
  )
}

export default ModalYN