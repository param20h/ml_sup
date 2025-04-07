import React, { useState } from 'react';
import InputForm from './components/InputForm';
import styles from './App.module.css';
import { Toaster } from 'sonner';

const App = () => {
  const [result, setResult] = useState(null);

  return (
    <div className={styles.container}>
      <Toaster position="top-right" richColors />
      <h1 className={styles.title}>Suspicious URL Detector</h1>
      <InputForm setResult={setResult} />

      {result && (
        <div className={styles.result}>
          <h2>Status: {result.suspicious ? "🚨 Suspicious" : "✅ Safe"}</h2>

          {result.reputation && (
            <p><strong>Reputation:</strong> {result.reputation}</p>
          )}

          {result.confidence && (
            <p><strong>Confidence:</strong> {result.confidence}%</p>
          )}

          {result.tags?.length > 0 && (
            <div className={styles.tags}>
              {result.tags.map((tag, i) => (
                <span key={i} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}

          {result.blacklisted_on?.length > 0 ? (
            <p>🚫 Blacklisted on: {result.blacklisted_on.join(', ')}</p>
          ) : (
            <p>🛡️ Not blacklisted anywhere!</p>
          )}

          {result.hosting_info && (
            <p>🌍 Hosted in <strong>{result.hosting_info.country}</strong> by <strong>{result.hosting_info.hosting_provider}</strong></p>
          )}

          {result.dns_info && (
            <div>
              <p><strong>DNS Records:</strong></p>
              <ul>
                {Object.entries(result.dns_info).map(([key, value]) => (
                  <li key={key}>{key.toUpperCase()}: {Array.isArray(value) ? value.join(', ') : value}</li>
                ))}
              </ul>
            </div>
          )}

          {result.redirect_info?.length > 0 && (
            <div>
              <p><strong>Redirections:</strong></p>
              <ul>
                {result.redirect_info.map((redirect, index) => (
                  <li key={index}>➡️ {redirect}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {localStorage.getItem('urlHistory') && (
        <div className={styles.result}>
          <h3>Previous Checks:</h3>
          <ul>
            {JSON.parse(localStorage.getItem('urlHistory')).map((item, idx) => (
              <li key={idx}>
                🔗 {item.url} — {item.result?.suspicious ? "🚨 Suspicious" : "✅ Safe"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
