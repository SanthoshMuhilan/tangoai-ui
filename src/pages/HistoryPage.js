import React from 'react';
import { Link } from 'react-router-dom';

function HistoryPage({ history }) {
  const handlePreview = (item, fileNum) => {
    const content = fileNum === 1 ? item.file1Content : item.file2Content;
    if (content) {
      const win = window.open('', '_blank');
      win.document.write('<pre>' + content.replace(/</g, '&lt;') + '</pre>');
    } else {
      alert('No file content available for preview.');
    }
  };

  const handleDownload = (item, fileNum) => {
    const content = fileNum === 1 ? item.file1Content : item.file2Content;
    const name = fileNum === 1 ? item.file1Name : item.file2Name;
    if (content) {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert('No file content available for download.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center">
      <nav className="navbar w-full">
        <div className="navbar-content">
          <span className="navbar-title">Tango AI</span>
          </div>
            <div className="navbar-left">
                            <Link to="/home" className="navbar-link">Home</Link>
                            <Link to="/compare" className="navbar-link ml-4">Back to Compare</Link>
                            <Link to="/" className="navbar-link ml-4">FAQ</Link>
                            <Link to="/" className="navbar-link ml-4">Logout</Link>
                          
                        </div>
            
        
      </nav>
      <h2 className="page-title mb-8 text-center">Comparison History</h2>
      <div className="w-full flex justify-center">
        <table className="compare-table w-full max-w-3xl mx-auto">
          <thead>
            <tr>
              <th>#</th>
              <th>File 1 Name</th>
              <th>File 2 Name</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {history && history.length > 0 ? (
              history.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{item.file1Name}</td>
                  <td>{item.file2Name}</td>
                  <td>{item.date}</td>
                  <td>
                    <button
                      className="history-btn"
                      onClick={() => handlePreview(item, 1)}
                      title="Preview File 1"
                    >Preview 1</button>
                    <button
                      className="history-btn"
                      onClick={() => handlePreview(item, 2)}
                      title="Preview File 2"
                    >Preview 2</button>
                    <button
                      className="history-btn"
                      onClick={() => handleDownload(item, 1)}
                      title="Download File 1"
                    >Download 1</button>
                    <button
                      className="history-btn"
                      onClick={() => handleDownload(item, 2)}
                      title="Download File 2"
                    >Download 2</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-8">No history found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoryPage;