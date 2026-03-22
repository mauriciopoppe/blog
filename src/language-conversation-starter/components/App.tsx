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

  const handlePrev = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (e.type === 'touchend') e.preventDefault()
    prevCard()
  }, [prevCard])

  const handleNext = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (e.type === 'touchend') e.preventDefault()
    nextCard()
  }, [nextCard])

  const handleFlip = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (e.type === 'touchend') e.preventDefault()
    toggleFlip()
  }, [toggleFlip])

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
      {/* Touch Zones (Active only when NOT flipped) */}
      {!isFlipped && (
        <div className="tw-absolute tw-inset-0 tw-flex tw-z-30">
          <div
            className="tw-w-1/4 tw-h-full tw-cursor-pointer active:tw-bg-black/5 dark:active:tw-bg-white/5 tw-transition-colors"
            onClick={handlePrev}
            onTouchEnd={handlePrev}
            aria-label="Previous card"
          />
          <div
            className="tw-w-1/2 tw-h-full tw-cursor-pointer active:tw-bg-black/5 dark:active:tw-bg-white/5 tw-transition-colors"
            onClick={handleFlip}
            onTouchEnd={handleFlip}
            aria-label="Flip card"
          />
          <div
            className="tw-w-1/4 tw-h-full tw-cursor-pointer active:tw-bg-black/5 dark:active:tw-bg-white/5 tw-transition-colors"
            onClick={handleNext}
            onTouchEnd={handleNext}
            aria-label="Next card"
          />
        </div>
      )}

      {/* Main Content Area */}
      <div
        className="tw-absolute tw-inset-0 tw-flex tw-flex-col tw-items-center tw-justify-center tw-z-10"
        onClick={isFlipped ? toggleFlip : undefined}
      >
        <div className="tw-w-full tw-max-w-5xl tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-relative tw-overflow-hidden">
          {!isFlipped ? (
            <div className="tw-text-center tw-px-4">
              <div className="tw-text-3xl md:tw-text-5xl tw-font-bold tw-mb-8 tw-leading-relaxed">
                {currentCard.question.map((segment, idx) => (
                  <ruby key={idx} className="tw-mx-1">
                    {segment.text}
                    {segment.rt && (
                      <rt className="tw-text-base md:tw-text-2xl tw-text-neutral-500 dark:tw-text-neutral-400">
                        {segment.rt}
                      </rt>
                    )}
                  </ruby>
                ))}
              </div>
              <div className="tw-text-xl md:tw-text-3xl tw-text-neutral-500 dark:tw-text-neutral-400 tw-italic">
                {currentCard.translation}
              </div>
            </div>
          ) : (
            <div className="tw-w-full tw-max-h-full tw-flex tw-flex-col">
              <div className="tw-flex-1 tw-overflow-y-auto tw-flex tw-flex-col tw-items-center">
                <ul className="tw-space-y-2 tw-max-w-3xl tw-w-full tw-px-6 tw-py-12">
                  {currentCard.answers.slice(0, 3).map((answer, idx) => (
                    <li key={idx} className="tw-border-l-4 tw-border-blue-500 tw-pl-6 tw-py-2">
                      <div className="tw-text-base md:tw-text-lg tw-mb-0.5 tw-leading-relaxed">
                        {answer.segments.map((segment, sIdx) => (
                          <ruby key={sIdx} className="tw-mr-1">
                            {segment.text}
                            {segment.rt && (
                              <rt className="tw-text-xs md:tw-text-sm tw-text-neutral-500 dark:tw-text-neutral-400">
                                {segment.rt}
                              </rt>
                            )}
                          </ruby>
                        ))}
                      </div>
                      <div className="tw-text-sm md:tw-text-base tw-text-neutral-500 dark:tw-text-neutral-400 tw-italic">
                        {answer.translation}
                      </div>
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
        <div className="tw-absolute tw-bottom-4 tw-left-1/2 tw--translate-x-1/2 tw-flex tw-gap-8 tw-text-[10px] md:tw-text-xs tw-uppercase tw-tracking-widest tw-text-neutral-400 dark:tw-text-neutral-500 tw-opacity-30">
          <span>← Prev</span>
          <span>Flip</span>
          <span>Next →</span>
        </div>
      </div>
    </div>
  )
}
