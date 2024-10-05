import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Cookies from "js-cookie";
import './RatingSystem.css'; // Move styles to a CSS file

const RatingSystem = ({ aiAgentId, averageRating, ratingCount, userRating, userAddress, onRatingSubmit }) => {
  const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(userRating || 0); // Prefill with user rating if exists
  const token = Cookies.get("jwtToken");
  const tokenHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleRatingClick = () => {
    setIsRatingPopupOpen(true); // Always allow opening the popup
  };

  const handleStarHover = (ratingValue) => {
    if (!userRating) { // Only allow hover effects if user hasn't rated yet
      setHoverRating(ratingValue);
    }
  };

  const handleStarClick = (ratingValue) => {
    if (!userRating) { // Only allow rating click if user hasn't rated yet
      setSelectedRating(ratingValue);
    }
  };

  const handleSubmitRating = async () => {
    if (!userRating) {
      try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/rating/rate-ai-agent`, {
          aiAgentId,
          rating: selectedRating,
          userId: userAddress,
        });
        onRatingSubmit(selectedRating);
        setIsRatingPopupOpen(false);
      } catch (error) {
        console.error('Error submitting rating:', error);
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
          color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
          style={{ cursor: isInteractive ? 'pointer' : 'default' }}
          onMouseEnter={isInteractive && !userRating ? () => handleStarHover(ratingValue) : undefined}
          onMouseLeave={isInteractive && !userRating ? () => handleStarHover(0) : undefined}
          onClick={isInteractive && !userRating ? () => handleStarClick(ratingValue) : undefined}
        />
      );
    });
  };

  return (
    <div>
      <div>{renderStars(averageRating)}</div>
      <div>
        Average Rating: {averageRating.toFixed(1)} ({ratingCount} ratings)
      </div>
      <button onClick={handleRatingClick}>Give Feedback</button>
      {isRatingPopupOpen && (
        <div className="rating-popup-overlay">
          <div className="rating-popup">
            <h3>{userRating ? "Your Rating" : "Rate this AI Agent"}</h3>
            <div>{renderStars(hoverRating || selectedRating || userRating, true)}</div>
            <button onClick={handleSubmitRating} disabled={!!userRating || !selectedRating}>
              Submit Rating
            </button>
            <button onClick={() => setIsRatingPopupOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingSystem;
