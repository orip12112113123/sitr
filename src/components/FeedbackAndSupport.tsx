'use client';

import { useState, useEffect } from 'react';
import FeedbackPopup from './FeedbackPopup';
import ChatSupport from './ChatSupport';

export default function FeedbackAndSupport() {
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    // Check if user has already seen the feedback popup in this session
    const feedbackShown = sessionStorage.getItem('feedbackShown');

    if (!feedbackShown) {
      // Show feedback popup after 30 seconds
      const timer = setTimeout(() => {
        setShowFeedback(true);
        sessionStorage.setItem('feedbackShown', 'true');
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {showFeedback && <FeedbackPopup onClose={() => setShowFeedback(false)} />}
      <ChatSupport />
    </>
  );
}
