export const THIRD_PERSON_AUTO_ROTATE_SPEED = -0.5

export function shouldAutoRotateThirdPerson(mode, isDragging) {
  return mode === 'Third person' && !isDragging
}
