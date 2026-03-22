import React, { useState, useEffect, useCallback } from 'react'
import { Card, cards as initialCards } from '../data'

export const App: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    // Shuffling on mount
    const shuffled = [...initialCards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
  }, [])

  const nextCard = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % cards.length)
    setIsFlipped(false)
  }, [cards.length])

  const prevCard = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
    setIsFlipped(false)
  }, [cards.length])

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev)
  }, [])

  if (cards.length === 0) {
    return (
      <div className="tw-fixed tw-inset-0 tw-bg-neutral-100 dark:tw-bg-neutral-900 tw-text-neutral-900 dark:tw-text-neutral-100 tw-flex tw-items-center tw-justify-center">
        <div className="tw-text-center">
          <p className="tw-animate-pulse">Loading cards...</p>
        </div>
      </div>
    )
  }

  const currentCard = cards[currentIndex]

  return (
    <div className="tw-fixed tw-inset-0 tw-bg-neutral-100 dark:tw-bg-neutral-900 tw-text-neutral-900 dark:tw-text-neutral-100 tw-overflow-hidden tw-select-none">
      {/* Touch Zones */}
      <div className="tw-absolute tw-inset-0 tw-flex tw-z-20">
        <div
          className="tw-w-1/4 tw-h-full tw-cursor-pointer active:tw-bg-black/5 dark:active:tw-bg-white/5 tw-transition-colors"
          onClick={prevCard}
          onTouchEnd={(e) => {
            e.preventDefault()
            prevCard()
          }}
          aria-label="Previous card"
        />
        <div
          className="tw-w-1/2 tw-h-full tw-cursor-pointer active:tw-bg-black/5 dark:active:tw-bg-white/5 tw-transition-colors"
          onClick={toggleFlip}
          onTouchEnd={(e) => {
            e.preventDefault()
            toggleFlip()
          }}
          aria-label="Flip card"
        />
        <div
          className="tw-w-1/4 tw-h-full tw-cursor-pointer active:tw-bg-black/5 dark:active:tw-bg-white/5 tw-transition-colors"
          onClick={nextCard}
          onTouchEnd={(e) => {
            e.preventDefault()
            nextCard()
          }}
          aria-label="Next card"
        />
      </div>

      {/* Main Content Area */}
      <div className="tw-absolute tw-inset-0 tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-4 md:tw-p-8">
        <div className="tw-w-full tw-max-w-4xl tw-aspect-[16/9] tw-bg-white dark:tw-bg-neutral-800 tw-rounded-3xl tw-shadow-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-8 tw-relative tw-overflow-hidden">
          {!isFlipped ? (
            <div className="tw-text-center">
              <div className="tw-text-4xl md:tw-text-6xl tw-font-bold tw-mb-8 tw-leading-relaxed">
                {currentCard.question.map((segment, idx) => (
                  <ruby key={idx} className="tw-mx-1">
                    {segment.text}
                    {segment.rt && (
                      <rt className="tw-text-base md:tw-text-xl tw-text-neutral-500 dark:tw-text-neutral-400">
                        {segment.rt}
                      </rt>
                    )}
                  </ruby>
                ))}
              </div>
              <div className="tw-text-xl md:tw-text-2xl tw-text-neutral-500 dark:tw-text-neutral-400 tw-italic">
                {currentCard.translation}
              </div>
            </div>
          ) : (
            <div className="tw-w-full tw-h-full tw-flex tw-flex-col">
              <h2 className="tw-text-2xl md:tw-text-3xl tw-font-bold tw-mb-6 tw-text-center tw-border-b tw-border-neutral-200 dark:tw-border-neutral-700 tw-pb-4">
                Example Answers
              </h2>
              <div className="tw-flex-1 tw-overflow-y-auto tw-flex tw-items-center tw-justify-center">
                <ul className="tw-space-y-4 tw-max-w-2xl">
                  {currentCard.answers.map((answer, idx) => (
                    <li
                      key={idx}
                      className="tw-text-lg md:tw-text-xl tw-border-l-4 tw-border-blue-500 tw-pl-4 tw-py-1"
                    >
                      {answer}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Card Indicator */}
          <div className="tw-absolute tw-bottom-4 tw-right-6 tw-text-xs md:tw-text-sm tw-text-neutral-400 dark:tw-text-neutral-500 tw-font-mono">
            {currentIndex + 1} / {cards.length}
          </div>
        </div>

        {/* Instructions Helper */}
        <div className="tw-mt-6 tw-flex tw-gap-8 tw-text-[10px] md:tw-text-xs tw-uppercase tw-tracking-widest tw-text-neutral-400 dark:tw-text-neutral-500 tw-opacity-50">
          <span>← Previous</span>
          <span>Flip Card</span>
          <span>Next →</span>
        </div>
      </div>
    </div>
  )
}
