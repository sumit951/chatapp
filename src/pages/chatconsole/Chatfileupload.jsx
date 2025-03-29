import React, { useState } from "react";

const Chatfileupload = ({ onFileSelect,parentselectedFiles,setfilesblank }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + selectedFiles.length > 5) {
      alert("You can upload a maximum of 5 files.");
      return;
    }

    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    onFileSelect([...selectedFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onFileSelect(updatedFiles);
  };

  const handleRemoveAllFile = () => {
    setSelectedFiles([]);
  };
  //console.log(parentselectedFiles);
  
  if(parentselectedFiles)
  {
    setTimeout(() => {
    setSelectedFiles([])
    setfilesblank(false)
    },600)
  }

  return (
    <div className="file-upload">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        accept="image/*, .pdf, .docx, .txt"
        hidden
        id="file-input"
      />
      {selectedFiles.length>0 && <button type="button" className="btn btn-danger ms-2 float-end" onClick={() => handleRemoveAllFile()} title="Remove All">Remove All <i className="fa fa-close ms-1"></i></button>}
      <label htmlFor="file-input">
        <i className="attachment-icon"><i className="fa fa-paperclip "></i></i>
        
      </label>
      <div className="row file-preview">
        {selectedFiles.map((file, index) => (
          <div key={index} className="col-md-3">
            <div className="file-preview-item">
            <div className="col-md-6 chip-info">{file.name}</div>
            <div className="col-md-3">
                <button type="button" className="btn btn-danger" onClick={() => handleRemoveFile(index)}><i className="fa fa-trash ms-1"></i></button>
            </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Chatfileupload;