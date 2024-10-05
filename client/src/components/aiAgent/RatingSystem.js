import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Cookies from "js-cookie";
import './RatingSystem.css';

const RatingSystem = ({ aiAgentId, averageRating, ratingCount, userRating, userAddress, onRatingSubmit }) => {
  const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(userRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = Cookies.get("jwtToken");
  const tokenHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (isRatingPopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isRatingPopupOpen]);

  const handleRatingClick = () => {
    setIsRatingPopupOpen(true);
  };

  const handleStarHover = (ratingValue) => {
    if (!userRating) {
      setHoverRating(ratingValue);
    }
  };

  const handleStarClick = (ratingValue) => {
    if (!userRating) {
      setSelectedRating(ratingValue);
    }
  };

  const handleSubmitRating = async () => {
    if (!userRating && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/rating/rate-ai-agent`, {
          aiAgentId,
          rating: selectedRating,
          userId: userAddress,
        }, tokenHeaders);
        onRatingSubmit(selectedRating);
        setIsRatingPopupOpen(false);
      } catch (error) {
        console.error('Error submitting rating:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderStars = (rating, isInteractive = false) => {
    return [...Array(5)].map((_, index) => {
      const ratingValue = index + 1;
      return (
        <FontAwesomeIcon
          key={index}
          icon={faStar}
          className={`star ${ratingValue <= (hoverRating || rating) ? 'filled' : ''} ${isInteractive ? 'interactive' : ''}`}
          onMouseEnter={isInteractive && !userRating ? () => handleStarHover(ratingValue) : undefined}
          onMouseLeave={isInteractive && !userRating ? () => handleStarHover(0) : undefined}
          onClick={isInteractive && !userRating ? () => handleStarClick(ratingValue) : undefined}
        />
      );
    });
  };

  return (
    <div className="rating-system">
      <div className="star-container">{renderStars(averageRating)}</div>
      <div className="average-rating">
        Average Rating: {averageRating.toFixed(1)} ({ratingCount} ratings)
      </div>
      <button className="rate-button" onClick={handleRatingClick}>Give Agent Rating</button>
      {isRatingPopupOpen && (
        <div className="rating-popup-overlay">
          <div className="rating-popup">
            <h3>{userRating ? "Your Rating" : "Rate this AI Agent"}</h3>
            <div className="popup-star-container">{renderStars(hoverRating || selectedRating || userRating, true)}</div>
            <button 
              className={`submit-button ${isSubmitting ? 'submitting' : ''}`} 
              onClick={handleSubmitRating} 
              disabled={!!userRating || !selectedRating || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
            <button className="close-button" onClick={() => setIsRatingPopupOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingSystem;