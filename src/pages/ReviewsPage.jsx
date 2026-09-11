import React, { useState } from 'react'
import { useReviews } from '../context/ReviewsContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ReviewsPage() {
  const { reviews, addReview } = useReviews()
  const { user } = useAuth()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!comment.trim()) return
    addReview({ name: user?.name || 'Guest', rating, comment: comment.trim() })
    setComment('')
    setRating(5)
  }

  return (
    <div className="panel">
      <h2>Reviews — help improve the tables</h2>
      <p className="subtitle">
        Leave a rating and a note on what's working or what to fix. Visible to anyone using this browser — reviews
        aren't shared across devices in this demo.
      </p>

      <form className="review-form" onSubmit={submit}>
        <div className="field">
          <label>Rating</label>
          <div className="star-row">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                className={`star-btn${n <= rating ? ' filled' : ''}`}
                onClick={() => setRating(n)}
                aria-label={`${n} star${n === 1 ? '' : 's'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="field" style={{ flex: 1, minWidth: 220 }}>
          <label>Your review</label>
          <textarea
            className="review-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you think?"
            rows={3}
          />
        </div>
        <button className="primary-btn" type="submit" style={{ alignSelf: 'flex-start' }}>
          Post review
        </button>
      </form>

      <hr className="divider" />

      {reviews.length === 0 ? (
        <div className="empty-state">No reviews yet — be the first to leave one.</div>
      ) : (
        <div className="review-list">
          {reviews.map((r) => (
            <div key={r.id} className="review-row">
              <div className="review-row-head">
                <span className="review-name">{r.name}</span>
                <span className="review-stars">
                  {'★'.repeat(r.rating)}
                  {'☆'.repeat(5 - r.rating)}
                </span>
                <span className="review-date">{formatDate(r.at)}</span>
              </div>
              <p className="review-comment">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}