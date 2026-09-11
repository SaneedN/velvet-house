import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

const ReviewsContext = createContext(null)
const REVIEWS_KEY = 'velvet-house-reviews'

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(REVIEWS_KEY)
      setReviews(raw ? JSON.parse(raw) : [])
    } catch {
      setReviews([])
    }
  }, [])

  const addReview = useCallback((review) => {
    setReviews((prev) => {
      const next = [
        { ...review, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now() },
        ...prev,
      ]
      try {
        window.localStorage.setItem(REVIEWS_KEY, JSON.stringify(next))
      } catch {
        // best effort only
      }
      return next
    })
  }, [])

  return <ReviewsContext.Provider value={{ reviews, addReview }}>{children}</ReviewsContext.Provider>
}

export function useReviews() {
  const ctx = useContext(ReviewsContext)
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider')
  return ctx
}