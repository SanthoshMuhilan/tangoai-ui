import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import { Link, useNavigate } from 'react-router-dom';
import ChatBotIcon from '../Icons/ChatBotIcon.webp';
import ChatBot from '../components/ChatBot';
import CognizantIcon from '../Icons/CognizantIcon.svg';

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
  const [file1Name, setFile1Name] = useState('');
  const [file2Name, setFile2Name] = useState('');
  const navigate = useNavigate();

  // New state for popup
  const [showComparePopup, setShowComparePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const pageRefs = [useRef(null), useRef(null), useRef(null)];

  const handleFileChange = (e, setFileContent, fileNum) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target.result);
        setPendingChatMessage(
          `File ${fileNum} uploaded: "${file.name}". Do you need any details about this file?`
        );
        setShowChat(true);
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
        file1Content,
        file2Content,
        date: new Date().toLocaleString(),
      },
      ...history,
    ].slice(0, 10); // Keep only last 10
    setHistory(newHistory);
    localStorage.setItem('compareHistory', JSON.stringify(newHistory));

    // Show popup window with compare table
    setShowComparePopup(true);
  };

  const handleReset = () => {
    setFile1Content('');
    setFile2Content('');
    setDiffRows([]);
    if (file1Ref.current) file1Ref.current.value = '';
    if (file2Ref.current) file2Ref.current.value = '';
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

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      setSearchResults([]);
      return;
    }
    const filtered = diffRows.filter(
      row =>
        row.file1.toLowerCase().includes(term.toLowerCase()) ||
        row.file2.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleDownloadSearchPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Search Results', 10, 15);

    let y = 25;
    doc.setFontSize(12);
    doc.text('Line   File 1   File 2', 10, y);
    y += 8;

    (searchResults.length ? searchResults : diffRows).forEach(row => {
      if (y > 270) {
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

    doc.save('search-results.pdf');
  };

  // Popup window for compare table
  const ComparePopup = ({ onClose }) => (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 2000,
        width: '100vw',
        height: '100vh',
        background: 'rgba(90, 108, 168, 0.45)', // blue overlay with transparency
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        backdropFilter: 'blur(12px)', // strong blur
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 20,
          boxShadow: '0 12px 48px rgba(44,62,80,0.22)',
          padding: 40,
          maxWidth: 1200,
          width: '95vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: '#7373be',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: 40,
            height: 40,
            fontSize: 24,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
          }}
          aria-label="Close"
        >
          ×
        </button>
        <h3 style={{ textAlign: 'center', marginBottom: 24, color: '#7373be', fontSize: 28, fontFamily: 'Arial, sans-serif' }}>
          Comparison Table
        </h3>
        {/* Search Bar with Icon and Download Button in the same row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '0 auto 24px auto',
          maxWidth: 1000
        }}>
          <div style={{ display: 'flex', alignItems: 'center', maxWidth: 400 }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
              <circle cx="11" cy="11" r="7" stroke="#7373be" strokeWidth="2"/>
              <line x1="16.018" y1="16.485" x2="21" y2="21" stroke="#7373be" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search results..."
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              style={{
                border: '1px solid #bbb',
                borderRadius: 8,
                padding: '8px 16px',
                fontSize: '1rem',
                width: 300,
                outline: 'none'
              }}
            />
          </div>
          <button
            onClick={handleDownloadSearchPDF}
            style={{
              background: 'rgb(137, 137, 218)',
              color: 'black',
              border: 'none',
              borderRadius: 8,
              padding: '8px 28px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
              transition: 'background 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontOpticalSizing: 'auto',
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <path fill="currentColor" d="M10 2a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4A1 1 0 1 1 5.707 9.293L8 11.586V3a1 1 0 0 1 1-1Zm-7 13a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Z"/>
            </svg>
            Download
          </button>
        </div>
        <div
          className="compare-table-scroll w-full mx-auto"
          style={{
            maxWidth: 1000,
            minWidth: 1000,
            maxHeight: 400,
            overflowY: 'auto',
            border: '1px solid #eee',
            borderRadius: 10,
            background: '#fafaff',
            position: 'relative',
          }}
        >
          <table className="compare-table w-full text-base">
            <thead>
              <tr>
                <th>Line</th>
                <th>File 1</th>
                <th>File 2</th>
              </tr>
            </thead>
            <tbody>
              {(searchResults.length ? searchResults : diffRows).map(row => (
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
    </div>
  );

  const handleCompareButtonClick = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file1Name,
          file2Name,
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Data from backend:', data);
      // You can set state here if you want to display the data
      // setDiffRows(data.diffRows); // Example if your API returns diffRows
    } catch (error) {
      console.error('API call error:', error);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative w-full"
      style={{
        overflowY: 'auto',
        height: '100vh',
      }}
    >
      {/* Fixed Navigation Bar */}
      <nav
        className="navbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1100,
          background: '#000048',
          boxShadow: '0 2px 12px rgba(44,62,80,0.08)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <div className="navbar-content">
          <div className="navbar-brand flex items-center gap-2" style={{ alignItems: 'center' }}>
            <img src={CognizantIcon} alt="Cognizant" style={{ width: 32, height: 32, display: 'inline-block', verticalAlign: 'middle', gap: 2 }} />
            <span className="navbar-title" style={{ display: 'inline-block', verticalAlign: 'middle', lineHeight: '32px' }}>Tango AI</span>
          </div>
        </div>
        <div className="navbar-left">
          <Link to="/home" className="navbar-link">Home</Link>
          <Link to="/" className="navbar-link ml-4">FAQ</Link>
          <Link to="/" className="navbar-link ml-4">Logout</Link>
        </div>
      </nav>

      {/* Add top padding so content is not hidden behind fixed nav */}
      <div style={{ paddingTop: 80, width: '100%' }}>
        {/* Page 1: Title and Info */}
        <div ref={pageRefs[0]}>
          <h2 className="page-title mb-8 text-center">Compare Documents</h2>
          {/* Info Box */}
          <div
            style={{
              background: 'rgba(248, 247, 255, 0.55)',
              border: '1px solid #bdbdfc',
              borderRadius: 18,
              padding: '18px 28px',
              margin: '0 auto 32px auto',
              maxWidth: 1200,
              width: '100%',
              color: '#3A294F',
              fontSize: '1.08rem',
              boxShadow: '0 4px 16px rgba(44,62,80,0.10)',
              textAlign: 'left',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <strong>How to use:</strong>
            <ul style={{ marginTop: 10, marginBottom: 0, marginLeft: 18 }}>
              <li>Upload your first and second document using the fields below.</li>
              <li>Click <b>Compare</b> to instantly see the differences highlighted.</li>
              <li>You can preview each file before comparing.</li>
              <li>Use the <b>Reset</b> button to clear files and start over.</li>
              <li>Access your previous comparisons using the <b>History</b> button.</li>
            </ul>
          </div>
        </div>

        {/* Page 2: Upload Section */}
        <div ref={pageRefs[1]}>
          <div className="upload-files-section flex flex-col md:flex-row gap-0 justify-center items-start w-full max-w-3xl mx-auto mb-8">
            {/* First File Upload */}
            <div className="upload-card flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <label className="block mb-3 font-semibold text-lg text-gray-700 gap-2">File 1</label>
              <br />
              <div className="flex items-center gap-2 w-full justify-center mb-10">
                <input
                  ref={file1Ref}
                  type="file"
                  onChange={e => handleFileChange(e, setFile1Content, 1)}
                  className="file-upload-input"
                />
                {/* Preview */}
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
                                pre { background: transparent; color: #3A294F; font-size: 1.08rem; border: none; box-shadow: none; padding: 0; margin: 0; text-align: left; }
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
                  </div>
                )}
              </div>
            </div>
            {/* Second File Upload */}
            <div className="upload-card flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <label className="block mb-4 font-semibold text-lg text-gray-700">File 2</label>
              <br />
              <div className="flex items-center gap-6 w-full justify-center">
                <input
                  ref={file2Ref}
                  type="file"
                  onChange={e => handleFileChange(e, setFile2Content, 2)}
                  className="file-upload-input gap-100"
                />
                {/* Preview  */}
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
                                pre { background: transparent; color: #3A294F; font-size: 1.08rem; border: none; box-shadow: none; padding: 0; margin: 0; text-align: left; }
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page 3: Compare Buttons and Results */}
        <div ref={pageRefs[2]}>
          <div className="compare-btn-group">
            <button onClick={handleCompareButtonClick} className="button-comparepage">Compare</button>
            <button onClick={handleReset} className="button-comparepage">Reset</button>
            <button onClick={() => navigate('/history')} className="button-comparepage">History</button>
          </div>
          {/* Display Differences in Popup */}
          {showComparePopup && (
            <ComparePopup onClose={() => setShowComparePopup(false)} />
          )}
        </div>
      </div>

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


