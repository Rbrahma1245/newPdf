import React, { Component } from 'react'
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import discount from "./discount.jpg"

import { saveAs } from 'file-saver';

class PDF extends Component {
    constructor() {
        super()
        this.state = {
            numPages: null,
            pageNumber: 1,
            pdfFile: null,

        }
    }

    onDocumentLoadSuccess({ numPages }) {
        this.setState({ numPages: numPages });
    }


    // validatePDF(e) {
    //     let selectedFile = e.target.files[0];
    //     let fileType = ["application/pdf"];

    //     if (selectedFile) {
    //         if (selectedFile && fileType.includes(selectedFile.type)) {
    //             let reader = new FileReader();

    //             // reader.readAsDataURL(selectedFile);
    //             reader.onload = (e) => {
    //                 this.setState({ pdfFile: e.target.result });
    //             };
    //             reader.readAsArrayBuffer(selectedFile);
    //         } else {
    //             this.setState({ pdfFile: null });
    //         }
    //     } else {
    //         console.log("please select a file");
    //     }
    // }



    validatePDF(e) {
        let selectedFile = e.target.files[0];
        let fileType = ["application/pdf"];
      
        if (selectedFile) {
          if (selectedFile && fileType.includes(selectedFile.type)) {
            let reader = new FileReader();
      
            reader.onload = (e) => {
              const arrayBuffer = e.target.result;
              const blob = new Blob([arrayBuffer], { type: "application/pdf" });
              this.setState({ pdfFile: blob });
            };
      
            reader.readAsArrayBuffer(selectedFile);
          } else {
            this.setState({ pdfFile: null });
          }
        } else {
          console.log("please select a file");
        }
      }

      


    handleNextPage() {
        this.setState((prevState) => ({
            pageNumber: prevState.pageNumber + 1,
        }));
    }
    handlePrevPage() {
        this.setState((prevState) => ({
            pageNumber: prevState.pageNumber - 1,
        }));
        console.log(this.state.pageNumber);

    }

    handleDownloadPDF() {
        const { pdfFile } = this.state;
        saveAs(pdfFile, "downloaded_pdf.pdf");

    }

    render() {
        console.log(this.state.pdfFile, 'from render');
        return (
            <div>

                <h2>Upload PDF</h2>
                <div className="display-container">
                    <div>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={this.validatePDF.bind(this)}
                        />
                    </div>
                </div>
                <Document file={this.state.pdfFile} onLoadSuccess={this.onDocumentLoadSuccess.bind(this)}>

                    <Page pageNumber={this.state.pageNumber} />
                    <img src={discount} style={{
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        position: "absolute",
                        zIndex: 1,
                        top: "50%",
                        left: "50%",
                        objectFit: "contain",
                        border: "1px solid black",
                        width: "150px",
                        height: "150px"
                    }} />


                    <p>
                        Page {this.state.pageNumber} of {this.state.numPages}
                    </p>

                    <button onClick={this.handlePrevPage.bind(this)} disabled={this.state.pageNumber === 1}>Prev</button>

                    <button onClick={this.handleNextPage.bind(this)} disabled={this.state.pageNumber == this.state.numPages}>Next</button>

                </Document>
                <button onClick={this.handleDownloadPDF.bind(this)}>Download</button>


            </div>
        )
    }
}

export default PDF