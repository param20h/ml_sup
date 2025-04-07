// Inside checkUrl.js

export const checkUrl = async (url) => {
  // Simulated checks
  const suspiciousUrls = {
    "http://free-vbucks-now.com": {
      suspicious: true,
      confidence: 93,
      tags: ["Phishing", "Scam"]
    },
    "https://paypal-login-security.info": {
      suspicious: true,
      confidence: 89,
      tags: ["Phishing"]
    },
    "https://update-your-bank-details.ru": {
      suspicious: true,
      confidence: 96,
      tags: ["Financial Fraud"]
    },
    "http://get-rich-fast.biz": {
      suspicious: true,
      confidence: 87,
      tags: ["Clickbait", "Scam"]
    },
    "https://facebook-account-verification.xyz": {
      suspicious: true,
      confidence: 91,
      tags: ["Phishing"]
    },
    "https://lpus.in": {
      suspicious: true,
      confidence: 100,
      tags: ["Phishing"]
    },
    "https://update-your-bank-details.ru": {
      suspicious: true,
      confidence: 98,
      tags: ["Phishing"]
    }
    
  };

  if (suspiciousUrls[url]) {
    return suspiciousUrls[url];
  }
  
  // Otherwise fallback to mock "safe" data with random confidence
  return {
    suspicious: false,
    confidence: Math.floor(Math.random() * 100) + 1, // Random between 1-100
    tags: []
  };
}
