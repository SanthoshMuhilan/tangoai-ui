import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ChatBotIcon from '../Icons/ChatBotIcon.webp';

import ChatBot from '../components/ChatBot';

import CognizantIcon from '../Icons/CognizantIcon.svg';



function ComparePage() {

  const [file1Content, setFile1Content] = useState('');

  const [file2Content, setFile2Content] = useState('');

  const [showChat, setShowChat] = useState(false);

  const [pendingChatMessage, setPendingChatMessage] = useState(null);

  // Add differencesURL state at the top
  const [differencesURL, setDifferencesURL] = useState('');
  const [comparisonSummary, setComparisonSummary] = useState('');
  const [prompt, setPrompt] = useState('');
  const [showPromptPopup, setShowPromptPopup] = useState(false);

  const file1Ref = useRef(null);

  const file2Ref = useRef(null);

  const navigate = useNavigate();



  // New state for popup

  const [showComparePopup, setShowComparePopup] = useState(false);





  const pageRefs = [useRef(null), useRef(null), useRef(null)];



  // Add file name states at the top
  const [file1Name, setFile1Name] = useState('');
  const [file2Name, setFile2Name] = useState('');

  const handleFileChange = (e, setFileContent, fileNum) => {

    const file = e.target.files[0];

    if (file) {

      const reader = new FileReader();

      reader.onload = (event) => {

        setFileContent(event.target.result);
        if (fileNum === 1) setFile1Name(file.name);
        if (fileNum === 2) setFile2Name(file.name);
        setPendingChatMessage(

          `File ${fileNum} uploaded: "${file.name}". Do you need any details about this file?`

        );

        setShowChat(true);

      };

      reader.readAsText(file);

    }

  };



  const handleReset = () => {

    setFile1Content('');

    setFile2Content('');

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


  const handleDownloadPDF = () => {
    if (differencesURL) {
      const link = document.createElement('a');
      link.href = differencesURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Prompt Popup Component
  const PromptPopup = ({ onProceed, onCancel }) => (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100vh',
        background: 'rgba(0,0,0,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 3000,
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
          padding: '32px 40px',
          minWidth: 600,
          minHeight: 200,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <h3 style={{ color: '#3A294F', marginBottom: 16 }}>Enter Prompt</h3>
        <input
        autoFocus
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Type your prompt to guide and personalize the comparison process."
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #bbb',
            fontSize: '1rem',
            marginBottom: 24,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button
            onClick={() => {
              setShowPromptPopup(false);
              onProceed();
            }}
            style={{
              background: '#7373be',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '8px 28px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
              transition: 'background 0.2s',
            }}
          >
            Proceed
          </button>
          <button
            onClick={() => {
              setShowPromptPopup(false);
              setPrompt('');
            }}
            style={{
              background: '#bbb',
              color: 'black',
              border: 'none',
              borderRadius: 8,
              padding: '8px 28px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
              transition: 'background 0.2s',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
  // Modified Compare Button handler to show prompt popup
  const handleCompareButtonClickPopup = () => {
    if (showChat) setShowChat(false);
    setShowPromptPopup(true);
  };

  // Actual compare logic, called after prompt is processed
  const handleCompareButtonClick = async () => {
    try {

      if (showChat) setShowChat(false);
      const file1blob = new Blob([file1Content])
      const file2blob = new Blob([file2Content])
      const finalPrompt = prompt && prompt.trim().length > 0 ? prompt: "Compare the two documents and highlight the differences.";
     const userId = localStorage.getItem('userId'); // Replace with actual user ID logic if needed      
     const form = new FormData();
     console.log('UserID', userId);
     form.append('file1', file1blob, file1Name);
     form.append('file2', file2blob, file2Name);
     console.log('File Names', file1Name, file2Name);
     form.append('prompt', finalPrompt);
     form.append('userId', userId);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/compare`, {
        method: 'POST',
        body: form
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Data from backend:', data);
      setShowComparePopup(true);

      setDifferencesURL(data.pdf_url_sas);
      setComparisonSummary(data.comparsion_overallsummary);
      console.log('Message', data.comparsion_overallsummary);

    } catch (error) {
      console.error('API call error:', error);
    }
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
      background: 'rgba(90, 108, 168, 0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'auto',
      backdropFilter: 'blur(12px)',
    }}
  >
    <div
      style={{
        background: 'white',
        borderRadius: 20,
        boxShadow: '0 12px 48px rgba(44,62,80,0.22)',
        padding: 40,
        maxWidth: 900, // resized for better fit
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
      {/* Only Download button, no search bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '0 auto 24px auto',
        maxWidth: 900
      }}>
        <button
          onClick={handleDownloadPDF}
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
          maxWidth: 900,
          minWidth: 600,
          maxHeight: 350,
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
              <th style={{ width: 160 }}>File 1</th>
              <th style={{ width: 160 }}>File 2</th>
              <th style={{ width: 400 }}>Comparison Summary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ wordBreak: 'break-all', fontSize: '1rem', padding: '8px' }}>{file1Name}</td>
              <td style={{ wordBreak: 'break-all', fontSize: '1rem', padding: '8px' }}>{file2Name}</td>
              <td style={{
                wordBreak: 'break-word',
                fontSize: '0.98rem',
                padding: '8px',
                maxWidth: 400,
                whiteSpace: 'pre-line',
                overflowWrap: 'break-word'
              }}>
                {comparisonSummary}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

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

            <button onClick={handleCompareButtonClickPopup} className="button-comparepage">Compare</button>

            <button onClick={handleReset} className="button-comparepage">Reset</button>

            <button onClick={() => navigate('/history')} className="button-comparepage">History</button>

          </div>

          {/* Prompt Popup */}
          {showPromptPopup && (
            <PromptPopup
              onProceed={handleCompareButtonClick}
              onCancel={() => setShowPromptPopup(false)}
            />
          )}

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
