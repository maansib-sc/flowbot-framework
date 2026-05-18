import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import '@react-pdf-viewer/core/lib/styles/index.css';
import styles from './ReferenceView.module.css';
import config from '@/config/constants';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
interface PdfViewerProps {
  link: string;
  pageNumber: number;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ link, pageNumber }) => {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [numPages, setNumPages] = useState<number | null>(null);
  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(link, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'API-KEY': config.NEXT_PUBLIC_BACKEND_CONNECTOR_KEY
          },
        });
        if (response.status == 200) {
          const pdfBlob = await response.blob();
          const pdfUrl = URL.createObjectURL(pdfBlob);
          setPdfUrl(pdfUrl);
        } else {
          throw new Error('pdf not existing in the dms')
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPdf();
  }, [link]);
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(() => numPages);
  };

  if (!pdfUrl) {
    return null; 
  }
  else {
    return (
      <div className={styles.pdf_container_outer} >
        <style>
          {`
            .react-pdf__Page__textContent {
              color:black !important;
              position: absolute !important;
            }
            
            .react-pdf__Page {
              width: 100% !important;
              height: auto !important;
            }
        `}
        </style>
        <div className={styles.pdf_container}>
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
            {numPages && numPages >= pageNumber && (
              <Page pageNumber={pageNumber} />
            )}
          </Document>
        </div>
      </div>
    )
  }
};
export default PdfViewer;