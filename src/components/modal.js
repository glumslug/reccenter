import React from 'react'

const Modal = ({toggle, ballerIcons, members, loadBoard}) => {
  console.log(members)
  console.log(ballerIcons)
  return (
  <div className='modal-wrap'>  
    <div className='modal'>
        <button onClick={()=>toggle(false)}>X</button>
        {ballerIcons.map((icon, i)=>
          <img src={'https://reccenter-boardicons.s3.amazonaws.com/uploads/'+icon} onClick={()=>{loadBoard(members[i])}} alt="" />
        )}
      
    </div>
    </div>
  )
}

export default Modal