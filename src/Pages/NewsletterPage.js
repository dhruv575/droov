import React from 'react';
import './NewsletterPage.css';

const NewsletterPage = () => {
  return (
    <div className="newsletter-page">
      <iframe
        src="https://forms.gle/pEcKx5htVBfrv2UQ8"
        width="100%"
        height="100%"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        title="Newsletter Signup"
      >
        Loading…
      </iframe>
    </div>
  );
};

export default NewsletterPage;
