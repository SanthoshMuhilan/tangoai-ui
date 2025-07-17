import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';

import { Link, useNavigate } from 'react-router-dom';

import ChatBotIcon from '../Icons/ChatBotIcon.webp'; // Adjust path if needed

import ChatBot from '../components/ChatBot'; // Adjust path if needed


function ComparePage() {

  const [file1Content, setFile1Content] = useState('');

  const [file2Content, setFile2Content] = useState('');

  const [diffRows, setDiffRows] = useState([]);

  const [history, setHistory] = useState(() => {

    const saved = localStorage.getItem('compareHistory');

    return saved ? JSON.parse(saved) : [];

  });

  const [showChat, setShowChat] = useState(false);

  const [pendingChatMessage, setPendingChatMessage] = useState(null);

  const file1Ref = useRef(null);

  const file2Ref = useRef(null);

  const navigate = useNavigate();



  const handleFileChange = (e, setFileContent, fileNum) => {

    const file = e.target.files[0];

    if (file) {

      const reader = new FileReader();

      reader.onload = (event) => {

        setFileContent(event.target.result);

        setPendingChatMessage(

          `File ${fileNum} uploaded: "${file.name}". Do you need any details about this file?`

        );

        setShowChat(true); // Open chatbot window after upload

      };

      reader.readAsText(file);

    }

  };



  const compareFiles = () => {

    const lines1 = file1Content.split('\n');

    const lines2 = file2Content.split('\n');

    const maxLen = Math.max(lines1.length, lines2.length);

    const rows = [];

    for (let i = 0; i < maxLen; i++) {

      const line1 = lines1[i] || '';

      const line2 = lines2[i] || '';

      rows.push({

        line: i + 1,

        file1: line1,

        file2: line2,

        isDiff: line1 !== line2

      });

    }

    setDiffRows(rows);



    // Save to history

    const file1Name = file1Ref.current?.files[0]?.name || 'File 1';

    const file2Name = file2Ref.current?.files[0]?.name || 'File 2';

    const newHistory = [

      {

        file1Name,

        file2Name,

        file1Content, // add this

        file2Content, // add this

        date: new Date().toLocaleString(),

      },

      ...history,

    ].slice(0, 10); // Keep only last 10

    setHistory(newHistory);

    localStorage.setItem('compareHistory', JSON.stringify(newHistory));

  };



  const handleReset = () => {

    setFile1Content('');

    setFile2Content('');

    setDiffRows([]);

    if (file1Ref.current) file1Ref.current.value = '';

    if (file2Ref.current) file2Ref.current.value = '';

  };



  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Comparison Results', 10, 15);

    let y = 25;
    doc.setFontSize(12);
    doc.text('Line   File 1   File 2', 10, y);
    y += 8;

    diffRows.forEach(row => {
      if (y > 270) { // Avoid writing off the page
        doc.addPage();
        y = 15;
      }
      doc.text(
        `${row.line}    ${row.file1.substring(0, 30)}    ${row.file2.substring(0, 30)}`,
        10,
        y
      );
      y += 8;
    });

    doc.save('comparison-results.pdf');
  };



  const handleChatBotMessage = (msg) => {
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("chatbot-message", { detail: msg }));
    }
  };

  useEffect(() => {
    if (showChat && pendingChatMessage) {
      handleChatBotMessage(pendingChatMessage);
      setPendingChatMessage(null);
    }
  }, [showChat, pendingChatMessage]);

  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative w-full">

      <nav className="navbar">

  <div className="navbar-content">

    <span className="navbar-title">Tango AI</span>

    </div>



    <div className="navbar-left">

                <Link to="/home" className="navbar-link">Home</Link>

                <Link to="/" className="navbar-link ml-4">FAQ</Link>

                <Link to="/" className="navbar-link ml-4">Logout</Link>

             

            </div>

</nav>

      <h2 className="page-title mb-8 text-center">Compare Documents</h2>

      {/* Upload Files Section */}
<div className="upload-files-section flex flex-col md:flex-row gap-8 justify-center items-start w-full max-w-3xl mx-auto mb-8">

  {/* First File Upload */}
  <div className="upload-card flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center">
    <label className="block mb-3 font-semibold text-lg text-gray-700">Upload First File</label>
    <div className="flex items-center gap-2 w-full justify-center">
      <input
        ref={file1Ref}
        type="file"
        onChange={e => handleFileChange(e, setFile1Content, 1)}
        className="file-upload-input"
      />
      {/* Preview & Download Buttons */}
      {file1Content && (
        <div className="flex gap-2">
          <button
            type="button"
            title="Preview File"
            className="glass-btn"
            onClick={() => {
              const win = window.open();
              win.document.write(`
                <html>
                  <head>
                    <title>Preview</title>
                    <style>
                      body { background: rgba(255,255,255,0.18); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); color: #2d2d2d; font-family: "Reem Kufi", sans-serif; padding: 2rem; min-height: 100vh; margin: 0; }
                      pre { background: transparent; color: #3A294F; font-size: 1.08rem; border: none; box-shadow: none; padding: 0; margin: 0; }
                    </style>
                  </head>
                  <body class="preview-window-bg">
                    <pre>${file1Content.replace(/</g, '&lt;')}</pre>
                  </body>
                </html>
              `);
            }}
          >
            Preview
          </button>
          <button
            type="button"
            title="Download File"
            className="glass-btn"
            onClick={() => {
              const blob = new Blob([file1Content], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = file1Ref.current?.files[0]?.name || 'file1.txt';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download
          </button>
        </div>
      )}
    </div>
  </div>

  {/* Second File Upload */}
  <div className="upload-card flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center">
    <label className="block mb-3 font-semibold text-lg text-gray-700">Upload Second File</label>
    <div className="flex items-center gap-2 w-full justify-center">
      <input
        ref={file2Ref}
        type="file"
        onChange={e => handleFileChange(e, setFile2Content, 2)}
        className="file-upload-input"
      />
      {/* Preview & Download Buttons */}
      {file2Content && (
        <div className="flex gap-2">
          <button
            type="button"
            title="Preview File"
            className="glass-btn"
            onClick={() => {
              const win = window.open();
              win.document.write(`
                <html>
                  <head>
                    <title>Preview</title>
                    <style>
                      body { background: rgba(255,255,255,0.18); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); color: #2d2d2d; font-family: "Reem Kufi", sans-serif; padding: 2rem; min-height: 100vh; margin: 0; }
                      pre { background: transparent; color: #3A294F; font-size: 1.08rem; border: none; box-shadow: none; padding: 0; margin: 0; }
                    </style>
                  </head>
                  <body class="preview-window-bg">
                    <pre>${file2Content.replace(/</g, '&lt;')}</pre>
                  </body>
                </html>
              `);
            }}
          >
            Preview
          </button>
          <button
            type="button"
            title="Download File"
            className="glass-btn"
            onClick={() => {
              const blob = new Blob([file2Content], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = file2Ref.current?.files[0]?.name || 'file2.txt';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download
          </button>
        </div>
      )}
    </div>
  </div>
</div>

      <div className="compare-btn-group">

  <button onClick={compareFiles} className="button-comparepage">Compare</button>

  <button onClick={handleReset} className="button-comparepage">Reset</button>

  <button

    onClick={() => navigate('/history')}

    className="button-comparepage"

  >

    History

  </button>

  <button onClick={handleDownloadPDF} className="button-comparepage">Download</button>

</div>

      {/* Display Differences */}

      {diffRows.length > 0 && (

        <div className="w-full flex justify-center">

          <div className="compare-table-scroll w-full max-w-2xl mx-auto">

            <table className="compare-table w-full">

              <thead>

                <tr>

                  <th>Line</th>

                  <th>File 1</th>

                  <th>File 2</th>

                </tr>

              </thead>

              <tbody>
  {diffRows.map(row => (
    <tr key={row.line} className={row.isDiff ? 'diff-row' : ''}>
      <td className="font-semibold">{row.line}</td>
      <td className={row.isDiff ? 'diff-cell' : ''}>{row.file1}</td>
      <td className={row.isDiff ? 'diff-cell-right' : ''}>{row.file2}</td>
    </tr>
  ))}
</tbody>

            </table>

          </div>

        </div>

      )}

      {/* Chatbot Button */}

      <button

        className="chatbot-btn"

        title="Chat with us"

        onClick={() => setShowChat(true)}

        style={{

          position: 'fixed',

          bottom: '32px',

          right: '32px',

          background: 'white',

          border: 'none',

          borderRadius: '50%',

          boxShadow: '0 4px 16px rgba(44,62,80,0.18)',

          width: '64px',

          height: '64px',

          display: 'flex',

          alignItems: 'center',

          justifyContent: 'center',

          cursor: 'pointer',

          zIndex: 1000

        }}

      >

        <img src={ChatBotIcon} alt="Chat Bot" style={{ width: 50, height: 40 }} />

      </button>

      {showChat && <ChatBot onClose={() => setShowChat(false)} />}

    </div>

  );

}

export default ComparePage;


