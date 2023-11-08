import FileUploderIcon from '@/assets/svgs/icons/FileUploderIcon';
import React, { useState } from 'react';
import styles from '@/configuration/CSS/Index.module.css';


interface FileUploadComponentProps {
  handleSubmit: () => void;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ handleSubmit }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(files);
      handleSubmit(); // Call the handleSubmit function when files are selected
    }
  };

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
                <FileUploderIcon/>
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
