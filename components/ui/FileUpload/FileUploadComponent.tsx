import FileUploderIcon from '@/assets/svgs/icons/FileUploderIcon';
import React, { useState } from 'react';
import styles from '@/configuration/CSS/Index.module.css';


interface FileUploadComponentProps {
  handleSubmit: (value: string) => void;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ handleSubmit }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = e.target.files[0];

    if (file && files) {
      getBase64(file, (result: any) => {
        result = result.substring(result.indexOf(',') + 1)
        const uploadedFile = JSON.stringify({ 'fileName': files[0].name, "imageData": result })
        handleSubmit(uploadedFile)
      });
    }
    if (files) {
      setSelectedFiles(files);
    }
  };

  function getBase64(file: File, cb: any) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (Math.round(bytes / Math.pow(1024, i) * 100) / 100) + ' ' + sizes[i];
  };


  const renderFileList = () => {
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      return (
        <ul>
          {fileArray.map((file, index) => (
            <li key={index} className={styles.fileUploadComponent}>
              <FileUploderIcon />
              <span>
                {file.name}
              </span>
              <small>
                {formatBytes(file.size)}
              </small>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <div>
      {!selectedFiles && <input
        type="file"
        multiple // Enable multi-select
        onChange={handleFileChange}
      />}

      {selectedFiles && (
        <div>
          {renderFileList()}
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
