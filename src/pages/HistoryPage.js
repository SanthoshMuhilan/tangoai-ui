import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CognizantIcon from '../Icons/CognizantIcon.svg';

function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const form = new FormData();
    form.append('userId', userId);
    async function fetchHistory() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/historyResults?userId=${userId}`, {
          method: 'POST',
          body: form,
        });
        const data = await response.json();
        if (Array.isArray(data.historyResultdetails)) {
          setHistory(data.historyResultdetails);
        } else {
          setHistory([]);
        }
        console.log('Data from backend:', data);
      } catch (err) {
        setHistory([]);
      }
    }
    fetchHistory();
  }, []);

  const handleDownload = (item) => {
    if (item.pdfUrlSaS) {
      const link = document.createElement('a');
      link.href = item.pdfUrlSaS;
      link.download = 'comparison_result.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No PDF available for download.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center">
      {/* Fixed Navbar */}
      <nav
        className="navbar w-full"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
        }}
      >
        <div className="navbar-content">
          <img src={CognizantIcon} alt="Cognizant" style={{ width: 32, height: 32, display: 'inline-block', verticalAlign: 'middle', gap: 2 }} />
          <span className="navbar-title">Tango AI</span>
        </div>
        <div className="navbar-left">
          <Link to="/home" className="navbar-link">Home</Link>
          <Link to="/compare" className="navbar-link ml-4">Back to Compare</Link>
          <Link to="/" className="navbar-link ml-4">FAQ</Link>
          <Link to="/" className="navbar-link ml-4">Logout</Link>
        </div>
      </nav>
      {/* Fixed Title */}
      <h2
        className="page-title mb-8 text-center"
        style={{
          position: 'fixed',
          top: 64,
          left: 0,
          width: '100vw',
          zIndex: 99,
          margin: 10,
          padding: '16px 0',
          boxShadow: '0 2px 8px rgba(44,62,80,0.05)',
        }}
      >
        Comparison History
      </h2>
      {/* Scrollable Table */}
      <div
        className="w-full flex justify-center"
        style={{
          maxWidth: '100vw',
          overflowX: 'auto',
          overflowY: 'auto',
          padding: '0 16px',
          marginTop: 150, // Space for navbar and title
          height: 'calc(100vh - 120px)',
        }}
      >
        <table
          className="compare-table w-full max-w-4xl mx-auto"
          style={{
            minWidth: 900,
            tableLayout: 'fixed',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th style={{ width: 180 }}>File 1 Name</th>
              <th style={{ width: 180 }}>File 2 Name</th>
              <th style={{ width: 110 }}>Date</th>
              <th style={{ width: 260 }}>Summary</th>
              <th style={{ width: 180 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>{idx + 1}</td>
                  <td style={{ wordBreak: 'break-all' }}>{item.docId1}</td>
                  <td style={{ wordBreak: 'break-all' }}>{item.docId2}</td>
                  <td>{item.createdAt}</td>
                  <td>
                    <div style={{ maxHeight: 120, overflowY: 'auto', whiteSpace: 'pre-line', fontSize: '0.95em' }}>
                      {item.comparison_overallsummary}
                    </div>
                  </td>
                  <td>
                    <button
                      className="history-btn"
                      onClick={() => handleDownload(item)}
                      title="Download PDF"
                    >Download PDF</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-8">No history found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoryPage;