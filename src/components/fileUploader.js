import React, {useRef} from 'react'

const FileUploader = ({onFileSelectError, onFileSelectSuccess}) => {
    const fileInput = useRef(null)

    const handleFileInput = (e) => {
        // handle validations
        onFileSelectSuccess(e.target.files[0])
    }

    return (
        <div>
            <input type="file" onChange={handleFileInput}/>
            <button onClick={e => fileInput.current && fileInput.current.click()} className="btn btn-primary"/>
        </div>
    )
}

export default FileUploader