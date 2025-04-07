import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import styles from './App.module.css';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const fakeHistory = [
  {
    url: "http://free-vbucks-now.com",
    result: { suspicious: true, confidence: 93, tags: ["Phishing", "Scam"] },
    time: new Date().toISOString()
  },
  {
    url: "https://paypal-login-security.info",
    result: { suspicious: true, confidence: 89, tags: ["Phishing"] },
    time: new Date().toISOString()
  },
  {
    url: "https://update-your-bank-details.ru",
    result: { suspicious: true, confidence: 96, tags: ["Financial Fraud"] },
    time: new Date().toISOString()
  },
  {
    url: "http://get-rich-fast.biz",
    result: { suspicious: true, confidence: 87, tags: ["Clickbait", "Scam"] },
    time: new Date().toISOString()
  },
  {
    url: "https://facebook-account-verification.xyz",
    result: { suspicious: true, confidence: 91, tags: ["Phishing"] },
    time: new Date().toISOString()
  }
];

const App = () => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('urlHistory')) {
      localStorage.setItem('urlHistory', JSON.stringify(fakeHistory));
    }
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 }
    })
  };

  return (
    <div className={styles.container}>
      <Toaster position="top-right" richColors />
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Suspicious URL Detector
      </motion.h1>

      <InputForm setResult={setResult} />

      <AnimatePresence>
        {result && (
          <motion.div
            className={styles.result}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Status: {result?.suspicious ? "🚨 Suspicious" : "✅ Safe"}</h2>
            {result.confidence && <p>Confidence: {result.confidence}%</p>}
            {result.tags?.length > 0 && (
              <div className={styles.tags}>
                {result.tags.map((tag, i) => (
                  <motion.span
                    key={i}
                    className={styles.tag}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {localStorage.getItem('urlHistory') && (
        <motion.div
          className={styles.result}
          initial="hidden"
          animate="visible"
        >
          <h3>Previous Checks:</h3>
          <ul>
            {JSON.parse(localStorage.getItem('urlHistory')).map((item, idx) => (
              <motion.li
                key={idx}
                custom={idx}
                variants={itemVariants}
              >
                🔗 {item.url} — {item.result?.suspicious ? "🚨 Suspicious" : "✅ Safe"}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default App;
