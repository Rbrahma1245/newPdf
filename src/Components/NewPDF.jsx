import React, { Component } from 'react';
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { saveAs } from 'file-saver';

import discount from './discount.jpg';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

class NewPDF extends Component {
  constructor() {
    super();
    this.state = {
      numPages: null,
      pageNumber: 1,
      pdfFile: null,
    };
  }

  onDocumentLoadSuccess({ numPages }) {
    this.setState({ numPages: numPages });
  }

  validatePDF(e) {
    let selectedFile = e.target.files[0];
    let fileType = ['application/pdf'];

    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();

        reader.onload = (e) => {
          const arrayBuffer = e.target.result;
          const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
          this.setState({ pdfFile: blob });
        };

        reader.readAsArrayBuffer(selectedFile);
      } else {
        this.setState({ pdfFile: null });
      }
    } else {
      console.log('Please select a file');
    }
  }

  renderCustomPage(pageNumber) {
    return (
      <div key={pageNumber} style={{ position: 'relative' }}>
        <Page pageNumber={pageNumber}  />
        <img
          src={discount}
          style={{
            position: 'absolute',
            zIndex: 1,
            top: '50%',
            left: '50%',
            objectFit: 'contain',
            border: '1px solid black',
            width: '150px',
            height: '150px',
            transform: 'translate(-50%, -50%)', // Center the image
          }}
          alt="Discount"
        />
      </div>
    );
  }

  handleNextPage() {
    this.setState((prevState) => ({
      pageNumber: prevState.pageNumber + 1,
    }));
  }

  handlePrevPage() {
    this.setState((prevState) => ({
      pageNumber: Math.max(1, prevState.pageNumber - 1),
    }));
  }

  handleDownloadPDF() {
    const { pdfFile } = this.state;
    saveAs(pdfFile, 'downloaded_pdf.pdf');
  }

  render() {
    const { pageNumber, numPages } = this.state;

    return (
      <div>
        <h2>Upload PDF</h2>
        <div className="display-container">
          <div>
            <input type="file" accept=".pdf" onChange={this.validatePDF.bind(this)} />
          </div>
        </div>
        <Document file={this.state.pdfFile} onLoadSuccess={this.onDocumentLoadSuccess.bind(this)}>
          {Array.from(new Array(numPages), (el, index) => this.renderCustomPage(index + 1))}
        </Document>
        <p>
          Page {pageNumber} of {numPages}
        </p>
        <button onClick={this.handlePrevPage.bind(this)} disabled={pageNumber === 1}>
          Prev
        </button>
        <button onClick={this.handleNextPage.bind(this)} disabled={pageNumber === numPages}>
          Next
        </button>
        <button onClick={this.handleDownloadPDF.bind(this)}>Download</button>
      </div>
    );
  }
}

export default NewPDF;
