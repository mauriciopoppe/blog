// Generated from sheena_ringo_crime_and_punishment.mid
// User defined exact semi-open intervals [start, end)
export interface MidiNote {
  time: number
  freq: number
  dur: number
  vel: number
  name: string
}

export interface MidiPhrase {
  title: string
  phraseIndex: number
  startBar: number
  startBeat: number
  endBar: number
  endBeat: number
  duration: number
  notes: MidiNote[]
}

export interface MidiSong {
  name: string
  artist: string
  icon: string
  bpm: number
  totalPhrases: number
  phrases: MidiPhrase[]
}

export const MIDI_SONGS: MidiSong[] = [
  {
    name: 'Crime and Punishment (罪と罰)',
    artist: 'Sheena Ringo',
    icon: '🥀',
    bpm: 119,
    totalPhrases: 21,
    phrases: [
      {
        title: 'Intro [1.1 - 9.1)',
        phraseIndex: 1,
        startBar: 1,
        startBeat: 1,
        endBar: 9,
        endBeat: 1,
        duration: 12.101,
        notes: [
          {
            time: 0.756,
            freq: 493.88,
            dur: 0.756,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 1.513,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 1.513,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 1.513,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 1.513,
            freq: 523.25,
            dur: 1.261,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 2.773,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 3.025,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 3.025,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 3.025,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 3.025,
            freq: 466.16,
            dur: 0.504,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 3.529,
            freq: 523.25,
            dur: 1.008,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 4.538,
            freq: 155.56,
            dur: 1.513,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 4.538,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 4.538,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 4.538,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 4.79,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 5.042,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 5.294,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 5.546,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 5.798,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 6.05,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 6.05,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 6.05,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 6.05,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 6.05,
            freq: 523.25,
            dur: 0.504,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 6.555,
            freq: 349.23,
            dur: 1.008,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.563,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 7.563,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 7.563,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 7.815,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 8.067,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 8.319,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 8.571,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 8.824,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 9.076,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 9.076,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 9.076,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 9.076,
            freq: 233.08,
            dur: 1.513,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 9.076,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 9.328,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 9.58,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 9.832,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 10.084,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 10.336,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 10.588,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 10.588,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 10.588,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 10.588,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 11.092,
            freq: 415.3,
            dur: 1.008,
            vel: 0.5,
            name: 'G#4'
          }
        ]
      },
      {
        title: 'Verse 1A (Shizuku wa ochite kuru...) [9.1 - 17.6)',
        phraseIndex: 2,
        startBar: 9,
        startBeat: 1,
        endBar: 17,
        endBeat: 6,
        duration: 13.361,
        notes: [
          {
            time: 0.756,
            freq: 493.88,
            dur: 0.756,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 1.513,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 1.513,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 1.513,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 1.513,
            freq: 523.25,
            dur: 1.261,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 2.773,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 3.025,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 3.025,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 3.025,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 3.025,
            freq: 466.16,
            dur: 0.504,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 3.529,
            freq: 523.25,
            dur: 1.008,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 4.538,
            freq: 155.56,
            dur: 1.513,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 4.538,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 4.538,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 4.538,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 4.79,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 5.042,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 5.294,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 5.546,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 5.798,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 6.05,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 6.05,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 6.05,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 6.05,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 6.05,
            freq: 523.25,
            dur: 0.504,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 6.555,
            freq: 349.23,
            dur: 1.008,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.563,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 7.563,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 7.563,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 7.815,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 8.067,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 8.319,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 8.571,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 8.824,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 9.076,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 9.076,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 9.076,
            freq: 233.08,
            dur: 1.513,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 9.076,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 9.076,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 9.328,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 9.58,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 9.832,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 10.084,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 10.336,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 10.588,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 10.588,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 10.588,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 10.588,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 11.092,
            freq: 415.3,
            dur: 1.008,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 12.101,
            freq: 164.81,
            dur: 0.756,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 12.101,
            freq: 196,
            dur: 0.756,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 12.101,
            freq: 130.81,
            dur: 0.756,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 12.101,
            freq: 261.63,
            dur: 0.756,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 12.353,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 12.353,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 12.353,
            freq: 466.16,
            dur: 0.504,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 12.857,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 12.857,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 12.857,
            freq: 466.16,
            dur: 0.504,
            vel: 0.5,
            name: 'A#4'
          }
        ]
      },
      {
        title: 'Verse 1B (Hoho wo tsutau namida...) [17.6 - 25.6)',
        phraseIndex: 3,
        startBar: 17,
        startBeat: 6,
        endBar: 25,
        endBeat: 6,
        duration: 12.101,
        notes: [
          {
            time: 0,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 0.252,
            freq: 110,
            dur: 1.513,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 0.252,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 0.252,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 0.252,
            freq: 87.31,
            dur: 1.513,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 0.252,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 0.756,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 1.513,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 1.765,
            freq: 110,
            dur: 0.756,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 1.765,
            freq: 130.81,
            dur: 0.756,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 1.765,
            freq: 174.61,
            dur: 0.756,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 1.765,
            freq: 87.31,
            dur: 0.756,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 1.765,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 2.269,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 2.521,
            freq: 87.31,
            dur: 0.252,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 2.521,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 2.773,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 3.025,
            freq: 103.83,
            dur: 0.252,
            vel: 0.5,
            name: 'G#2'
          },
          {
            time: 3.025,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 3.277,
            freq: 110,
            dur: 1.513,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 3.277,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 3.277,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 3.277,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 3.277,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 3.782,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 4.538,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 4.79,
            freq: 110,
            dur: 0.756,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 4.79,
            freq: 164.81,
            dur: 0.756,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 4.79,
            freq: 138.59,
            dur: 0.756,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 4.79,
            freq: 196,
            dur: 0.756,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 4.79,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 5.294,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 5.546,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 5.546,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 5.798,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 6.05,
            freq: 138.59,
            dur: 0.252,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 6.05,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 6.303,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 6.303,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 6.303,
            freq: 220,
            dur: 1.513,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 6.303,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 6.807,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.059,
            freq: 440,
            dur: 0.252,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 7.311,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.563,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.815,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 7.815,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 7.815,
            freq: 220,
            dur: 1.513,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 8.067,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 8.319,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 8.571,
            freq: 293.66,
            dur: 0.504,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 9.076,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 9.328,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 9.328,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 9.328,
            freq: 116.54,
            dur: 1.513,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 9.328,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 9.328,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 9.58,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 9.832,
            freq: 415.3,
            dur: 0.756,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 10.588,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 10.84,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 10.84,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 10.84,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 10.84,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 10.84,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 11.092,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 11.345,
            freq: 392,
            dur: 0.756,
            vel: 0.5,
            name: 'G4'
          }
        ]
      },
      {
        title: 'Chorus 1A (Yuganda machinami...) [25.6 - 33.6)',
        phraseIndex: 4,
        startBar: 25,
        startBeat: 6,
        endBar: 33,
        endBeat: 6,
        duration: 12.101,
        notes: [
          {
            time: 0,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 0.252,
            freq: 110,
            dur: 1.513,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 0.252,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 0.252,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 0.252,
            freq: 87.31,
            dur: 1.513,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 0.252,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 0.756,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 1.513,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 1.765,
            freq: 110,
            dur: 0.756,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 1.765,
            freq: 130.81,
            dur: 0.756,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 1.765,
            freq: 174.61,
            dur: 0.756,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 1.765,
            freq: 87.31,
            dur: 0.756,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 1.765,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 2.269,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 2.521,
            freq: 87.31,
            dur: 0.252,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 2.521,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 2.773,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 3.025,
            freq: 103.83,
            dur: 0.252,
            vel: 0.5,
            name: 'G#2'
          },
          {
            time: 3.025,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 3.277,
            freq: 110,
            dur: 1.513,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 3.277,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 3.277,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 3.277,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 3.277,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 3.782,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 4.538,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 4.79,
            freq: 110,
            dur: 0.756,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 4.79,
            freq: 164.81,
            dur: 0.756,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 4.79,
            freq: 138.59,
            dur: 0.756,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 4.79,
            freq: 196,
            dur: 0.756,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 4.79,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 5.294,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 5.546,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 5.546,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 5.798,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 6.05,
            freq: 138.59,
            dur: 0.252,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 6.05,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 6.303,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 6.303,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 6.303,
            freq: 220,
            dur: 1.513,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 6.303,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 6.807,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.059,
            freq: 440,
            dur: 0.252,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 7.311,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.563,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.815,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 7.815,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 7.815,
            freq: 220,
            dur: 1.513,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 8.067,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 8.319,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 8.571,
            freq: 293.66,
            dur: 0.504,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 9.076,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 9.328,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 9.328,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 9.328,
            freq: 116.54,
            dur: 1.513,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 9.328,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 9.328,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 9.58,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 9.832,
            freq: 415.3,
            dur: 0.756,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 10.588,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 10.84,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 10.84,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 10.84,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 10.84,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 10.84,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 11.092,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 11.345,
            freq: 392,
            dur: 1.008,
            vel: 0.5,
            name: 'G4'
          }
        ]
      },
      {
        title: 'Chorus 1B (Climax & Cadence) [33.6 - 41.4)',
        phraseIndex: 5,
        startBar: 33,
        startBeat: 6,
        endBar: 41,
        endBeat: 4,
        duration: 11.597,
        notes: [
          {
            time: 0.252,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 0.252,
            freq: 103.83,
            dur: 1.513,
            vel: 0.5,
            name: 'G#2'
          },
          {
            time: 0.252,
            freq: 87.31,
            dur: 1.513,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 0.252,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 0.504,
            freq: 369.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#4'
          },
          {
            time: 1.008,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 1.765,
            freq: 116.54,
            dur: 1.513,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 1.765,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 1.765,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 1.765,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 2.017,
            freq: 293.66,
            dur: 0.504,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 2.017,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 2.017,
            freq: 415.3,
            dur: 0.504,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 2.521,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 2.521,
            freq: 415.3,
            dur: 0.756,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 2.521,
            freq: 293.66,
            dur: 0.756,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 3.277,
            freq: 103.83,
            dur: 1.513,
            vel: 0.5,
            name: 'G#2'
          },
          {
            time: 3.277,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 3.277,
            freq: 87.31,
            dur: 1.513,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 3.277,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 3.529,
            freq: 415.3,
            dur: 0.504,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 3.529,
            freq: 311.13,
            dur: 0.504,
            vel: 0.5,
            name: 'D#4'
          },
          {
            time: 3.529,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 3.529,
            freq: 523.25,
            dur: 0.504,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 4.034,
            freq: 415.3,
            dur: 0.756,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 4.034,
            freq: 523.25,
            dur: 0.756,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 4.034,
            freq: 311.13,
            dur: 0.756,
            vel: 0.5,
            name: 'D#4'
          },
          {
            time: 4.034,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 4.79,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 4.79,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 4.79,
            freq: 116.54,
            dur: 1.513,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 4.79,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 5.042,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 5.042,
            freq: 293.66,
            dur: 0.504,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 5.042,
            freq: 415.3,
            dur: 0.504,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 5.546,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 5.546,
            freq: 293.66,
            dur: 0.756,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 5.546,
            freq: 415.3,
            dur: 0.756,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 6.303,
            freq: 103.83,
            dur: 1.513,
            vel: 0.5,
            name: 'G#2'
          },
          {
            time: 6.303,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 6.303,
            freq: 87.31,
            dur: 1.513,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 6.303,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 6.555,
            freq: 415.3,
            dur: 0.504,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 6.555,
            freq: 311.13,
            dur: 0.504,
            vel: 0.5,
            name: 'D#4'
          },
          {
            time: 6.555,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 6.555,
            freq: 523.25,
            dur: 0.504,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 7.059,
            freq: 415.3,
            dur: 0.756,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 7.059,
            freq: 523.25,
            dur: 0.756,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 7.059,
            freq: 311.13,
            dur: 0.756,
            vel: 0.5,
            name: 'D#4'
          },
          {
            time: 7.059,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.815,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 7.815,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 7.815,
            freq: 116.54,
            dur: 1.513,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 7.815,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 8.067,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 8.067,
            freq: 293.66,
            dur: 0.504,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 8.067,
            freq: 415.3,
            dur: 0.504,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 8.571,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 8.571,
            freq: 293.66,
            dur: 0.756,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 8.571,
            freq: 415.3,
            dur: 0.756,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 9.328,
            freq: 103.83,
            dur: 1.513,
            vel: 0.5,
            name: 'G#2'
          },
          {
            time: 9.328,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 9.328,
            freq: 87.31,
            dur: 1.513,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 9.328,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 9.58,
            freq: 415.3,
            dur: 0.504,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 9.58,
            freq: 311.13,
            dur: 0.504,
            vel: 0.5,
            name: 'D#4'
          },
          {
            time: 9.58,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 9.58,
            freq: 523.25,
            dur: 0.504,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 10.084,
            freq: 415.3,
            dur: 0.756,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 10.084,
            freq: 523.25,
            dur: 0.756,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 10.084,
            freq: 311.13,
            dur: 0.756,
            vel: 0.5,
            name: 'D#4'
          },
          {
            time: 10.084,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 10.84,
            freq: 116.54,
            dur: 1.513,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 10.84,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 10.84,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 10.84,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 11.092,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 11.092,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 11.092,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          }
        ]
      },
      {
        title: 'Interlude (Piano & Bass) [41.4 - 49.4)',
        phraseIndex: 6,
        startBar: 41,
        startBeat: 4,
        endBar: 49,
        endBeat: 4,
        duration: 12.101,
        notes: [
          {
            time: 0,
            freq: 493.88,
            dur: 0.756,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 0.756,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 0.756,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 0.756,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 0.756,
            freq: 523.25,
            dur: 1.261,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 2.017,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 2.269,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 2.269,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 2.269,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 2.269,
            freq: 466.16,
            dur: 0.504,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 2.773,
            freq: 523.25,
            dur: 1.008,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 3.782,
            freq: 155.56,
            dur: 1.513,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 3.782,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 3.782,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 3.782,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 4.034,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 4.286,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 4.538,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 4.79,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 5.042,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 5.294,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 5.294,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 5.294,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 5.294,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 5.294,
            freq: 523.25,
            dur: 0.504,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 5.798,
            freq: 349.23,
            dur: 1.008,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 6.807,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 6.807,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 6.807,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 7.059,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.311,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 7.563,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.815,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 8.067,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 8.319,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 8.319,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.319,
            freq: 233.08,
            dur: 1.513,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 8.319,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 8.319,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 8.571,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 8.824,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 9.076,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 9.328,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 9.58,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 9.832,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 9.832,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 9.832,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 9.832,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 10.336,
            freq: 415.3,
            dur: 1.008,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 11.345,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 11.345,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 11.345,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 11.345,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 11.597,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 11.597,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 11.597,
            freq: 466.16,
            dur: 0.504,
            vel: 0.5,
            name: 'A#4'
          }
        ]
      },
      {
        title: 'Verse 2A (Tsuki ga terasu heya...) [49.4 - 57.6)',
        phraseIndex: 7,
        startBar: 49,
        startBeat: 4,
        endBar: 57,
        endBeat: 6,
        duration: 12.605,
        notes: [
          {
            time: 0,
            freq: 493.88,
            dur: 0.756,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 0.756,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 0.756,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 0.756,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 0.756,
            freq: 523.25,
            dur: 1.261,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 2.017,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 2.269,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 2.269,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 2.269,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 2.269,
            freq: 466.16,
            dur: 0.504,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 2.773,
            freq: 523.25,
            dur: 1.008,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 3.782,
            freq: 155.56,
            dur: 1.513,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 3.782,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 3.782,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 3.782,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 4.034,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 4.286,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 4.538,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 4.79,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 5.042,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 5.294,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 5.294,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 5.294,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 5.294,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 5.294,
            freq: 523.25,
            dur: 0.504,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 5.798,
            freq: 349.23,
            dur: 1.008,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 6.807,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 6.807,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 6.807,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 7.059,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.311,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 7.563,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.815,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 8.067,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 8.319,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 8.319,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.319,
            freq: 233.08,
            dur: 1.513,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 8.319,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 8.319,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 8.571,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 8.824,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 9.076,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 9.328,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 9.58,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 9.832,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 9.832,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 9.832,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 9.832,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 10.336,
            freq: 415.3,
            dur: 1.008,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 11.345,
            freq: 164.81,
            dur: 0.756,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 11.345,
            freq: 196,
            dur: 0.756,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 11.345,
            freq: 130.81,
            dur: 0.756,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 11.597,
            freq: 466.16,
            dur: 0.504,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 12.101,
            freq: 440,
            dur: 0.504,
            vel: 0.5,
            name: 'A4'
          }
        ]
      },
      {
        title: 'Verse 2B (Kimi no namae wo...) [57.6 - 65.6)',
        phraseIndex: 8,
        startBar: 57,
        startBeat: 6,
        endBar: 65,
        endBeat: 6,
        duration: 12.101,
        notes: [
          {
            time: 0,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 0.252,
            freq: 110,
            dur: 1.513,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 0.252,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 0.252,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 0.252,
            freq: 87.31,
            dur: 1.513,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 0.252,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 0.756,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 1.513,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 1.765,
            freq: 110,
            dur: 0.756,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 1.765,
            freq: 130.81,
            dur: 0.756,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 1.765,
            freq: 174.61,
            dur: 0.756,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 1.765,
            freq: 87.31,
            dur: 0.756,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 1.765,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 2.269,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 2.521,
            freq: 87.31,
            dur: 0.252,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 2.521,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 2.773,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 3.025,
            freq: 103.83,
            dur: 0.252,
            vel: 0.5,
            name: 'G#2'
          },
          {
            time: 3.025,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 3.277,
            freq: 110,
            dur: 1.513,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 3.277,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 3.277,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 3.277,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 3.277,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 3.782,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 4.538,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 4.79,
            freq: 110,
            dur: 0.756,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 4.79,
            freq: 164.81,
            dur: 0.756,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 4.79,
            freq: 138.59,
            dur: 0.756,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 4.79,
            freq: 196,
            dur: 0.756,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 4.79,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 5.294,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 5.546,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 5.546,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 5.798,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 6.05,
            freq: 138.59,
            dur: 0.252,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 6.05,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 6.303,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 6.303,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 6.303,
            freq: 220,
            dur: 1.513,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 6.303,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 6.807,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.059,
            freq: 440,
            dur: 0.252,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 7.311,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.563,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.815,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 7.815,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 7.815,
            freq: 220,
            dur: 1.513,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 8.067,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 8.319,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 8.571,
            freq: 293.66,
            dur: 0.504,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 9.076,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 9.328,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 9.328,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 9.328,
            freq: 116.54,
            dur: 1.513,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 9.328,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 9.328,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 9.58,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 9.832,
            freq: 415.3,
            dur: 0.756,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 10.588,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 10.84,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 10.84,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 10.84,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 10.84,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 10.84,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 11.092,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 11.345,
            freq: 392,
            dur: 0.756,
            vel: 0.5,
            name: 'G4'
          }
        ]
      },
      {
        title: 'Chorus 2A (Scream & Band) [65.6 - 75.6)',
        phraseIndex: 9,
        startBar: 65,
        startBeat: 6,
        endBar: 75,
        endBeat: 6,
        duration: 15.126,
        notes: [
          {
            time: 0,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 0.252,
            freq: 110,
            dur: 1.513,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 0.252,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 0.252,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 0.252,
            freq: 87.31,
            dur: 1.513,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 0.252,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 0.756,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 1.513,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 1.765,
            freq: 110,
            dur: 0.756,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 1.765,
            freq: 130.81,
            dur: 0.756,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 1.765,
            freq: 174.61,
            dur: 0.756,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 1.765,
            freq: 87.31,
            dur: 0.756,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 1.765,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 2.269,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 2.521,
            freq: 87.31,
            dur: 0.252,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 2.521,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 2.773,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 3.025,
            freq: 103.83,
            dur: 0.252,
            vel: 0.5,
            name: 'G#2'
          },
          {
            time: 3.025,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 3.277,
            freq: 110,
            dur: 1.513,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 3.277,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 3.277,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 3.277,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 3.277,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 3.782,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 4.538,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 4.79,
            freq: 110,
            dur: 0.756,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 4.79,
            freq: 164.81,
            dur: 0.756,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 4.79,
            freq: 138.59,
            dur: 0.756,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 4.79,
            freq: 196,
            dur: 0.756,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 4.79,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 5.294,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 5.546,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 5.546,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 5.798,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 6.05,
            freq: 138.59,
            dur: 0.252,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 6.05,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 6.303,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 6.303,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 6.303,
            freq: 220,
            dur: 1.513,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 6.303,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 6.807,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.059,
            freq: 440,
            dur: 0.252,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 7.311,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.563,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.815,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 7.815,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 7.815,
            freq: 220,
            dur: 1.513,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 8.067,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 8.319,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 8.571,
            freq: 293.66,
            dur: 0.504,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 9.076,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 9.328,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 9.328,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 9.328,
            freq: 116.54,
            dur: 1.513,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 9.328,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 9.328,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 9.58,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 9.832,
            freq: 415.3,
            dur: 0.756,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 10.588,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 10.84,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 10.84,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 10.84,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 10.84,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 10.84,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 10.84,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 11.092,
            freq: 349.23,
            dur: 0.252,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 11.092,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 11.345,
            freq: 415.3,
            dur: 0.756,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 11.345,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 12.101,
            freq: 415.3,
            dur: 0.252,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 12.101,
            freq: 830.61,
            dur: 0.252,
            vel: 0.5,
            name: 'G#5'
          },
          {
            time: 12.353,
            freq: 116.54,
            dur: 1.513,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 12.353,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 12.353,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 12.353,
            freq: 233.08,
            dur: 1.513,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 12.353,
            freq: 523.25,
            dur: 0.252,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 12.353,
            freq: 1046.5,
            dur: 0.252,
            vel: 0.5,
            name: 'C6'
          },
          {
            time: 12.605,
            freq: 523.25,
            dur: 0.252,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 12.605,
            freq: 1046.5,
            dur: 0.252,
            vel: 0.5,
            name: 'C6'
          },
          {
            time: 12.857,
            freq: 523.25,
            dur: 0.504,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 12.857,
            freq: 1046.5,
            dur: 0.504,
            vel: 0.5,
            name: 'C6'
          },
          {
            time: 13.361,
            freq: 523.25,
            dur: 0.504,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 13.361,
            freq: 1046.5,
            dur: 0.504,
            vel: 0.5,
            name: 'C6'
          },
          {
            time: 13.866,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 13.866,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 13.866,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 13.866,
            freq: 698.46,
            dur: 0.504,
            vel: 0.5,
            name: 'F5'
          },
          {
            time: 13.866,
            freq: 1396.91,
            dur: 0.504,
            vel: 0.5,
            name: 'F6'
          },
          {
            time: 14.37,
            freq: 523.25,
            dur: 0.252,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 14.37,
            freq: 1046.5,
            dur: 0.252,
            vel: 0.5,
            name: 'C6'
          },
          {
            time: 14.622,
            freq: 466.16,
            dur: 0.756,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 14.622,
            freq: 932.33,
            dur: 0.756,
            vel: 0.5,
            name: 'A#5'
          }
        ]
      },
      {
        title: 'Chorus 2B (Chorus Climax) [75.6 - 84.1)',
        phraseIndex: 10,
        startBar: 75,
        startBeat: 6,
        endBar: 84,
        endBeat: 1,
        duration: 12.353,
        notes: [
          {
            time: 0.252,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 0.252,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 0.252,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 0.504,
            freq: 493.88,
            dur: 0.504,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 0.504,
            freq: 622.25,
            dur: 0.252,
            vel: 0.5,
            name: 'D#5'
          },
          {
            time: 0.504,
            freq: 987.77,
            dur: 0.504,
            vel: 0.5,
            name: 'B5'
          },
          {
            time: 1.008,
            freq: 523.25,
            dur: 0.756,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 1.008,
            freq: 1046.5,
            dur: 0.756,
            vel: 0.5,
            name: 'C6'
          },
          {
            time: 1.765,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 1.765,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 1.765,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 2.017,
            freq: 311.13,
            dur: 0.504,
            vel: 0.5,
            name: 'D#4'
          },
          {
            time: 2.017,
            freq: 415.3,
            dur: 0.504,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 2.017,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 2.017,
            freq: 523.25,
            dur: 0.504,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 2.521,
            freq: 523.25,
            dur: 0.756,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 2.521,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 2.521,
            freq: 415.3,
            dur: 0.756,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 2.521,
            freq: 311.13,
            dur: 0.756,
            vel: 0.5,
            name: 'D#4'
          },
          {
            time: 3.277,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 3.277,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 3.277,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 3.277,
            freq: 277.18,
            dur: 1.513,
            vel: 0.5,
            name: 'C#4'
          },
          {
            time: 3.529,
            freq: 415.3,
            dur: 0.504,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 3.529,
            freq: 523.25,
            dur: 0.504,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 3.529,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 4.034,
            freq: 349.23,
            dur: 0.063,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 4.097,
            freq: 392,
            dur: 0.063,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 4.16,
            freq: 440,
            dur: 0.063,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 4.223,
            freq: 493.88,
            dur: 0.063,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 4.286,
            freq: 523.25,
            dur: 0.063,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 4.349,
            freq: 587.33,
            dur: 0.063,
            vel: 0.5,
            name: 'D5'
          },
          {
            time: 4.412,
            freq: 659.26,
            dur: 0.063,
            vel: 0.5,
            name: 'E5'
          },
          {
            time: 4.475,
            freq: 698.46,
            dur: 0.063,
            vel: 0.5,
            name: 'F5'
          },
          {
            time: 4.538,
            freq: 783.99,
            dur: 0.063,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 4.601,
            freq: 880,
            dur: 0.063,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 4.664,
            freq: 987.77,
            dur: 0.063,
            vel: 0.5,
            name: 'B5'
          },
          {
            time: 4.727,
            freq: 1046.5,
            dur: 0.063,
            vel: 0.5,
            name: 'C6'
          },
          {
            time: 4.79,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 4.79,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 4.79,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 4.79,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 4.79,
            freq: 1396.91,
            dur: 0.756,
            vel: 0.5,
            name: 'F6'
          },
          {
            time: 4.79,
            freq: 2793.83,
            dur: 0.756,
            vel: 0.5,
            name: 'F7'
          },
          {
            time: 5.546,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 5.546,
            freq: 415.3,
            dur: 0.756,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 6.303,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 6.303,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 6.303,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 6.807,
            freq: 523.25,
            dur: 0.252,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 7.059,
            freq: 698.46,
            dur: 0.252,
            vel: 0.5,
            name: 'F5'
          },
          {
            time: 7.311,
            freq: 830.61,
            dur: 0.252,
            vel: 0.5,
            name: 'G#5'
          },
          {
            time: 7.563,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 7.815,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 7.815,
            freq: 155.56,
            dur: 1.513,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 7.815,
            freq: 233.08,
            dur: 1.513,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 7.815,
            freq: 698.46,
            dur: 0.252,
            vel: 0.5,
            name: 'F5'
          },
          {
            time: 8.067,
            freq: 622.25,
            dur: 0.252,
            vel: 0.5,
            name: 'D#5'
          },
          {
            time: 8.319,
            freq: 523.25,
            dur: 0.252,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 8.571,
            freq: 415.3,
            dur: 0.504,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 9.076,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 9.328,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 9.328,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 9.328,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 9.328,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 9.832,
            freq: 415.3,
            dur: 0.504,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 10.336,
            freq: 466.16,
            dur: 0.504,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 10.84,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 10.84,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 10.84,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 10.84,
            freq: 523.25,
            dur: 0.504,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 11.345,
            freq: 622.25,
            dur: 0.504,
            vel: 0.5,
            name: 'D#5'
          },
          {
            time: 11.849,
            freq: 523.25,
            dur: 0.126,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 11.975,
            freq: 587.33,
            dur: 0.126,
            vel: 0.5,
            name: 'D5'
          },
          {
            time: 12.101,
            freq: 622.25,
            dur: 0.126,
            vel: 0.5,
            name: 'D#5'
          },
          {
            time: 12.227,
            freq: 698.46,
            dur: 0.126,
            vel: 0.5,
            name: 'F5'
          }
        ]
      },
      {
        title: 'Guitar Solo 1 (Blues Wail) [84.1 - 93.1)',
        phraseIndex: 11,
        startBar: 84,
        startBeat: 1,
        endBar: 93,
        endBeat: 1,
        duration: 13.613,
        notes: [
          {
            time: 0,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 0,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 0,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 0,
            freq: 783.99,
            dur: 1.261,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 1.261,
            freq: 523.25,
            dur: 0.252,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 1.513,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 1.513,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 1.513,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 1.513,
            freq: 659.26,
            dur: 0.252,
            vel: 0.5,
            name: 'E5'
          },
          {
            time: 1.765,
            freq: 659.26,
            dur: 0.126,
            vel: 0.5,
            name: 'E5'
          },
          {
            time: 1.891,
            freq: 698.46,
            dur: 0.126,
            vel: 0.5,
            name: 'F5'
          },
          {
            time: 2.017,
            freq: 659.26,
            dur: 0.126,
            vel: 0.5,
            name: 'E5'
          },
          {
            time: 2.143,
            freq: 587.33,
            dur: 0.126,
            vel: 0.5,
            name: 'D5'
          },
          {
            time: 2.269,
            freq: 659.26,
            dur: 0.756,
            vel: 0.5,
            name: 'E5'
          },
          {
            time: 3.025,
            freq: 155.56,
            dur: 1.513,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 3.025,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 3.025,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 3.277,
            freq: 622.25,
            dur: 0.252,
            vel: 0.5,
            name: 'D#5'
          },
          {
            time: 3.529,
            freq: 523.25,
            dur: 0.252,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 3.782,
            freq: 415.3,
            dur: 0.504,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 4.286,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 4.538,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 4.538,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 4.538,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 4.538,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 4.538,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 5.042,
            freq: 415.3,
            dur: 0.504,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 5.546,
            freq: 466.16,
            dur: 0.504,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 6.05,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 6.05,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 6.05,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 6.05,
            freq: 233.08,
            dur: 0.756,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 6.807,
            freq: 261.63,
            dur: 0.756,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 7.563,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 7.563,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 7.563,
            freq: 155.56,
            dur: 1.513,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 7.563,
            freq: 311.13,
            dur: 0.756,
            vel: 0.5,
            name: 'D#4'
          },
          {
            time: 8.319,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 9.076,
            freq: 116.54,
            dur: 1.513,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 9.076,
            freq: 207.65,
            dur: 1.513,
            vel: 0.5,
            name: 'G#3'
          },
          {
            time: 9.076,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 9.076,
            freq: 415.3,
            dur: 0.756,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 9.832,
            freq: 466.16,
            dur: 0.756,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 10.588,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 10.588,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 10.588,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 10.588,
            freq: 523.25,
            dur: 0.756,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 11.345,
            freq: 659.26,
            dur: 0.756,
            vel: 0.5,
            name: 'E5'
          },
          {
            time: 12.101,
            freq: 87.31,
            dur: 1.513,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 12.101,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 12.101,
            freq: 698.46,
            dur: 0.756,
            vel: 0.5,
            name: 'F5'
          },
          {
            time: 12.857,
            freq: 698.46,
            dur: 0.756,
            vel: 0.5,
            name: 'F5'
          },
          {
            time: 12.857,
            freq: 880,
            dur: 0.756,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 12.857,
            freq: 1046.5,
            dur: 0.756,
            vel: 0.5,
            name: 'C6'
          },
          {
            time: 12.857,
            freq: 1396.91,
            dur: 0.756,
            vel: 0.5,
            name: 'F6'
          }
        ]
      },
      {
        title: 'Guitar Solo 2 (Chromatic Screams) [93.1 - 100.1)',
        phraseIndex: 12,
        startBar: 93,
        startBeat: 1,
        endBar: 100,
        endBeat: 1,
        duration: 10.588,
        notes: [
          {
            time: 0,
            freq: 220,
            dur: 0.756,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 0.756,
            freq: 261.63,
            dur: 0.504,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 1.261,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 1.513,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 1.513,
            freq: 110,
            dur: 1.513,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 1.513,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 1.513,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 2.269,
            freq: 329.63,
            dur: 0.252,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 2.521,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 2.773,
            freq: 277.18,
            dur: 0.756,
            vel: 0.5,
            name: 'C#4'
          },
          {
            time: 3.025,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 3.025,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 3.025,
            freq: 233.08,
            dur: 1.513,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 3.025,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 3.529,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 3.782,
            freq: 466.16,
            dur: 0.504,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 4.286,
            freq: 440,
            dur: 0.252,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 4.538,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 4.538,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 4.538,
            freq: 220,
            dur: 1.513,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 4.538,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 5.042,
            freq: 440,
            dur: 0.756,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 5.798,
            freq: 329.63,
            dur: 0.126,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 5.924,
            freq: 293.66,
            dur: 0.126,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 6.05,
            freq: 138.59,
            dur: 1.513,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 6.05,
            freq: 220,
            dur: 1.513,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 6.05,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 6.05,
            freq: 277.18,
            dur: 1.513,
            vel: 0.5,
            name: 'C#4'
          },
          {
            time: 7.311,
            freq: 440,
            dur: 0.252,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 7.563,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 7.563,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 7.563,
            freq: 220,
            dur: 1.513,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 7.563,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 7.563,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 8.067,
            freq: 440,
            dur: 1.008,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 9.076,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 9.076,
            freq: 123.47,
            dur: 1.513,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 9.076,
            freq: 174.61,
            dur: 1.513,
            vel: 0.5,
            name: 'F3'
          },
          {
            time: 9.076,
            freq: 246.94,
            dur: 1.513,
            vel: 0.5,
            name: 'B3'
          }
        ]
      },
      {
        title: 'Guitar Solo 3 (High Register) [100.1 - 107.6)',
        phraseIndex: 13,
        startBar: 100,
        startBeat: 1,
        endBar: 107,
        endBeat: 6,
        duration: 11.849,
        notes: [
          {
            time: 0,
            freq: 58.27,
            dur: 3.025,
            vel: 0.5,
            name: 'A#1'
          },
          {
            time: 0,
            freq: 116.54,
            dur: 3.025,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 1.261,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 1.261,
            freq: 587.33,
            dur: 0.252,
            vel: 0.5,
            name: 'D5'
          },
          {
            time: 1.513,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 1.513,
            freq: 698.46,
            dur: 0.504,
            vel: 0.5,
            name: 'F5'
          },
          {
            time: 2.017,
            freq: 523.25,
            dur: 1.008,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 2.017,
            freq: 1046.5,
            dur: 1.008,
            vel: 0.5,
            name: 'C6'
          },
          {
            time: 3.025,
            freq: 49,
            dur: 3.025,
            vel: 0.5,
            name: 'G1'
          },
          {
            time: 3.025,
            freq: 98,
            dur: 3.025,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 4.286,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 4.286,
            freq: 587.33,
            dur: 0.252,
            vel: 0.5,
            name: 'D5'
          },
          {
            time: 4.538,
            freq: 698.46,
            dur: 0.504,
            vel: 0.5,
            name: 'F5'
          },
          {
            time: 4.538,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 5.042,
            freq: 1046.5,
            dur: 1.008,
            vel: 0.5,
            name: 'C6'
          },
          {
            time: 5.042,
            freq: 523.25,
            dur: 1.008,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 6.05,
            freq: 77.78,
            dur: 0.756,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 6.05,
            freq: 155.56,
            dur: 0.756,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 6.807,
            freq: 196,
            dur: 0.756,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 6.807,
            freq: 155.56,
            dur: 0.756,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 6.807,
            freq: 233.08,
            dur: 0.756,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 6.807,
            freq: 311.13,
            dur: 0.756,
            vel: 0.5,
            name: 'D#4'
          },
          {
            time: 6.807,
            freq: 440,
            dur: 0.756,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 6.807,
            freq: 880,
            dur: 0.756,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 7.563,
            freq: 311.13,
            dur: 0.756,
            vel: 0.5,
            name: 'D#4'
          },
          {
            time: 7.563,
            freq: 155.56,
            dur: 0.756,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 7.563,
            freq: 233.08,
            dur: 0.756,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 7.563,
            freq: 196,
            dur: 0.756,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 7.563,
            freq: 466.16,
            dur: 0.756,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 7.563,
            freq: 932.33,
            dur: 0.756,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 8.319,
            freq: 311.13,
            dur: 0.756,
            vel: 0.5,
            name: 'D#4'
          },
          {
            time: 8.319,
            freq: 196,
            dur: 0.756,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 8.319,
            freq: 233.08,
            dur: 0.756,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 8.319,
            freq: 155.56,
            dur: 0.756,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 8.319,
            freq: 1046.5,
            dur: 0.756,
            vel: 0.5,
            name: 'C6'
          },
          {
            time: 8.319,
            freq: 523.25,
            dur: 0.756,
            vel: 0.5,
            name: 'C5'
          },
          {
            time: 9.076,
            freq: 155.56,
            dur: 1.513,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 9.076,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 9.076,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 9.076,
            freq: 233.08,
            dur: 1.513,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 9.076,
            freq: 932.33,
            dur: 0.504,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 9.076,
            freq: 466.16,
            dur: 0.504,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 9.58,
            freq: 932.33,
            dur: 0.252,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 9.58,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 9.832,
            freq: 1174.66,
            dur: 0.504,
            vel: 0.5,
            name: 'D6'
          },
          {
            time: 9.832,
            freq: 587.33,
            dur: 0.504,
            vel: 0.5,
            name: 'D5'
          },
          {
            time: 10.336,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 10.336,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 10.588,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 10.588,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 10.588,
            freq: 880,
            dur: 0.756,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 10.588,
            freq: 440,
            dur: 0.756,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 10.84,
            freq: 220,
            dur: 0.252,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 10.84,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 10.84,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 10.84,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 11.092,
            freq: 220,
            dur: 0.252,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 11.092,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.092,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 11.092,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 11.345,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.345,
            freq: 220,
            dur: 0.252,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 11.345,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 11.345,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 11.345,
            freq: 440,
            dur: 0.504,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 11.597,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.597,
            freq: 220,
            dur: 0.252,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 11.597,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 11.597,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          }
        ]
      },
      {
        title: 'Solo Climax & Transition [107.6 - 115.6)',
        phraseIndex: 14,
        startBar: 107,
        startBeat: 6,
        endBar: 115,
        endBeat: 6,
        duration: 12.101,
        notes: [
          {
            time: 0,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 0,
            freq: 220,
            dur: 0.252,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 0,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 0,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 0,
            freq: 440,
            dur: 0.252,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 0,
            freq: 880,
            dur: 0.252,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 0.252,
            freq: 49,
            dur: 0.252,
            vel: 0.5,
            name: 'G1'
          },
          {
            time: 0.252,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 0.252,
            freq: 369.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#4'
          },
          {
            time: 0.252,
            freq: 739.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#5'
          },
          {
            time: 0.504,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 0.756,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 0.756,
            freq: 783.99,
            dur: 0.756,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 0.756,
            freq: 392,
            dur: 0.756,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 0.756,
            freq: 493.88,
            dur: 0.756,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 1.008,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 1.008,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 1.008,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 1.008,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 1.261,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 1.513,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 1.513,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 1.513,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 1.513,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 1.765,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 1.765,
            freq: 61.74,
            dur: 0.252,
            vel: 0.5,
            name: 'B1'
          },
          {
            time: 1.765,
            freq: 49,
            dur: 0.252,
            vel: 0.5,
            name: 'G1'
          },
          {
            time: 1.765,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 1.765,
            freq: 739.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#5'
          },
          {
            time: 1.765,
            freq: 369.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#4'
          },
          {
            time: 2.017,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 2.269,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 2.269,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 2.269,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 2.269,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 2.521,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 2.521,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 2.521,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 2.521,
            freq: 880,
            dur: 0.504,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 2.521,
            freq: 440,
            dur: 0.504,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 2.773,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 3.025,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 3.025,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 3.025,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 3.025,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 3.277,
            freq: 61.74,
            dur: 0.252,
            vel: 0.5,
            name: 'B1'
          },
          {
            time: 3.277,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 3.277,
            freq: 369.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#4'
          },
          {
            time: 3.277,
            freq: 739.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#5'
          },
          {
            time: 3.529,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 3.782,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 3.782,
            freq: 783.99,
            dur: 0.756,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 3.782,
            freq: 392,
            dur: 0.756,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 3.782,
            freq: 493.88,
            dur: 0.756,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 4.034,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 4.034,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 4.034,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 4.034,
            freq: 246.94,
            dur: 0.252,
            vel: 0.5,
            name: 'B3'
          },
          {
            time: 4.286,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 4.538,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 4.538,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 4.538,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 4.538,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 4.79,
            freq: 61.74,
            dur: 0.252,
            vel: 0.5,
            name: 'B1'
          },
          {
            time: 4.79,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 4.79,
            freq: 739.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#5'
          },
          {
            time: 4.79,
            freq: 369.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#4'
          },
          {
            time: 5.042,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 5.294,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 5.294,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 5.294,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 5.294,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 5.546,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 5.546,
            freq: 246.94,
            dur: 0.252,
            vel: 0.5,
            name: 'B3'
          },
          {
            time: 5.546,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 5.546,
            freq: 880,
            dur: 0.504,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 5.546,
            freq: 440,
            dur: 0.504,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 5.798,
            freq: 138.59,
            dur: 0.252,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 6.05,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 6.05,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 6.05,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 6.05,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 6.303,
            freq: 82.41,
            dur: 0.252,
            vel: 0.5,
            name: 'E2'
          },
          {
            time: 6.303,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 6.303,
            freq: 369.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#4'
          },
          {
            time: 6.303,
            freq: 739.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#5'
          },
          {
            time: 6.555,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 6.807,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 6.807,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 6.807,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 6.807,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 7.059,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 7.059,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 7.059,
            freq: 246.94,
            dur: 0.252,
            vel: 0.5,
            name: 'B3'
          },
          {
            time: 7.059,
            freq: 329.63,
            dur: 0.252,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 7.059,
            freq: 587.33,
            dur: 0.252,
            vel: 0.5,
            name: 'D5'
          },
          {
            time: 7.059,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 7.059,
            freq: 987.77,
            dur: 0.252,
            vel: 0.5,
            name: 'B5'
          },
          {
            time: 7.311,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 7.311,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 7.311,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 7.311,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 7.563,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 7.563,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 7.563,
            freq: 493.88,
            dur: 0.504,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 7.563,
            freq: 783.99,
            dur: 0.504,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 7.815,
            freq: 82.41,
            dur: 0.252,
            vel: 0.5,
            name: 'E2'
          },
          {
            time: 7.815,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.067,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.067,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 8.067,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 8.067,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 8.319,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.319,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 8.319,
            freq: 329.63,
            dur: 0.252,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 8.319,
            freq: 659.26,
            dur: 0.252,
            vel: 0.5,
            name: 'E5'
          },
          {
            time: 8.571,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.571,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 8.571,
            freq: 246.94,
            dur: 0.252,
            vel: 0.5,
            name: 'B3'
          },
          {
            time: 8.571,
            freq: 329.63,
            dur: 0.252,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 8.571,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 8.571,
            freq: 659.26,
            dur: 0.504,
            vel: 0.5,
            name: 'E5'
          },
          {
            time: 8.824,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 9.076,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 9.076,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 9.076,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 9.076,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 9.328,
            freq: 65.41,
            dur: 0.252,
            vel: 0.5,
            name: 'C2'
          },
          {
            time: 9.328,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 9.328,
            freq: 932.33,
            dur: 0.252,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 9.328,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 9.58,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 9.58,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 9.58,
            freq: 932.33,
            dur: 0.252,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 9.832,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 9.832,
            freq: 932.33,
            dur: 0.756,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 9.832,
            freq: 466.16,
            dur: 0.756,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 10.084,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 10.084,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 10.084,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 10.084,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 10.336,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 10.588,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 10.588,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 10.588,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 10.84,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 10.84,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 10.84,
            freq: 932.33,
            dur: 0.252,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 10.84,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 11.092,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.092,
            freq: 932.33,
            dur: 0.252,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 11.092,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 11.345,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.345,
            freq: 440,
            dur: 0.756,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 11.345,
            freq: 880,
            dur: 0.756,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 11.597,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.597,
            freq: 220,
            dur: 0.252,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 11.597,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 11.597,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 11.849,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          }
        ]
      },
      {
        title: 'Bridge / Breakdown [115.6 - 123.6)',
        phraseIndex: 15,
        startBar: 115,
        startBeat: 6,
        endBar: 123,
        endBeat: 6,
        duration: 12.101,
        notes: [
          {
            time: 0,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 0,
            freq: 880,
            dur: 0.252,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 0,
            freq: 440,
            dur: 0.252,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 0.252,
            freq: 49,
            dur: 0.252,
            vel: 0.5,
            name: 'G1'
          },
          {
            time: 0.252,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 0.252,
            freq: 369.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#4'
          },
          {
            time: 0.252,
            freq: 739.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#5'
          },
          {
            time: 0.504,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 0.756,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 0.756,
            freq: 783.99,
            dur: 0.756,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 0.756,
            freq: 392,
            dur: 0.756,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 0.756,
            freq: 493.88,
            dur: 0.756,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 1.008,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 1.008,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 1.008,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 1.008,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 1.261,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 1.513,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 1.513,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 1.513,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 1.513,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 1.765,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 1.765,
            freq: 61.74,
            dur: 0.252,
            vel: 0.5,
            name: 'B1'
          },
          {
            time: 1.765,
            freq: 49,
            dur: 0.252,
            vel: 0.5,
            name: 'G1'
          },
          {
            time: 1.765,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 1.765,
            freq: 739.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#5'
          },
          {
            time: 1.765,
            freq: 369.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#4'
          },
          {
            time: 2.017,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 2.269,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 2.269,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 2.269,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 2.269,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 2.521,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 2.521,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 2.521,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 2.521,
            freq: 880,
            dur: 0.504,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 2.521,
            freq: 440,
            dur: 0.504,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 2.773,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 3.025,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 3.025,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 3.025,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 3.025,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 3.277,
            freq: 61.74,
            dur: 0.252,
            vel: 0.5,
            name: 'B1'
          },
          {
            time: 3.277,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 3.277,
            freq: 369.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#4'
          },
          {
            time: 3.277,
            freq: 739.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#5'
          },
          {
            time: 3.529,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 3.782,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 3.782,
            freq: 783.99,
            dur: 0.756,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 3.782,
            freq: 392,
            dur: 0.756,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 3.782,
            freq: 493.88,
            dur: 0.756,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 4.034,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 4.034,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 4.034,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 4.034,
            freq: 246.94,
            dur: 0.252,
            vel: 0.5,
            name: 'B3'
          },
          {
            time: 4.286,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 4.538,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 4.538,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 4.538,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 4.538,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 4.79,
            freq: 61.74,
            dur: 0.252,
            vel: 0.5,
            name: 'B1'
          },
          {
            time: 4.79,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 4.79,
            freq: 739.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#5'
          },
          {
            time: 4.79,
            freq: 369.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#4'
          },
          {
            time: 5.042,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 5.294,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 5.294,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 5.294,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 5.294,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 5.546,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 5.546,
            freq: 246.94,
            dur: 0.252,
            vel: 0.5,
            name: 'B3'
          },
          {
            time: 5.546,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 5.546,
            freq: 880,
            dur: 0.504,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 5.546,
            freq: 440,
            dur: 0.504,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 5.798,
            freq: 138.59,
            dur: 0.252,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 6.05,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 6.05,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 6.05,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 6.05,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 6.303,
            freq: 82.41,
            dur: 0.252,
            vel: 0.5,
            name: 'E2'
          },
          {
            time: 6.303,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 6.303,
            freq: 369.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#4'
          },
          {
            time: 6.303,
            freq: 739.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#5'
          },
          {
            time: 6.555,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 6.807,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 6.807,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 6.807,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 6.807,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 7.059,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 7.059,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 7.059,
            freq: 246.94,
            dur: 0.252,
            vel: 0.5,
            name: 'B3'
          },
          {
            time: 7.059,
            freq: 329.63,
            dur: 0.252,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 7.059,
            freq: 587.33,
            dur: 0.252,
            vel: 0.5,
            name: 'D5'
          },
          {
            time: 7.059,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 7.059,
            freq: 987.77,
            dur: 0.252,
            vel: 0.5,
            name: 'B5'
          },
          {
            time: 7.311,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 7.311,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 7.311,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 7.311,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 7.563,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 7.563,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 7.563,
            freq: 493.88,
            dur: 0.504,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 7.563,
            freq: 783.99,
            dur: 0.504,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 7.815,
            freq: 82.41,
            dur: 0.252,
            vel: 0.5,
            name: 'E2'
          },
          {
            time: 7.815,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.067,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.067,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 8.067,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 8.067,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 8.319,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.319,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 8.319,
            freq: 329.63,
            dur: 0.252,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 8.319,
            freq: 659.26,
            dur: 0.252,
            vel: 0.5,
            name: 'E5'
          },
          {
            time: 8.571,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.571,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 8.571,
            freq: 246.94,
            dur: 0.252,
            vel: 0.5,
            name: 'B3'
          },
          {
            time: 8.571,
            freq: 329.63,
            dur: 0.252,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 8.571,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 8.571,
            freq: 659.26,
            dur: 0.504,
            vel: 0.5,
            name: 'E5'
          },
          {
            time: 8.824,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 9.076,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 9.076,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 9.076,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 9.076,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 9.328,
            freq: 65.41,
            dur: 0.252,
            vel: 0.5,
            name: 'C2'
          },
          {
            time: 9.328,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 9.328,
            freq: 932.33,
            dur: 0.252,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 9.328,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 9.58,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 9.58,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 9.58,
            freq: 932.33,
            dur: 0.252,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 9.832,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 9.832,
            freq: 932.33,
            dur: 0.756,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 9.832,
            freq: 466.16,
            dur: 0.756,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 10.084,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 10.084,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 10.084,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 10.084,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 10.336,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 10.588,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 10.588,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 10.588,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 10.84,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 10.84,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 10.84,
            freq: 932.33,
            dur: 0.252,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 10.84,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 11.092,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.092,
            freq: 932.33,
            dur: 0.252,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 11.092,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 11.345,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.345,
            freq: 440,
            dur: 0.756,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 11.345,
            freq: 880,
            dur: 0.756,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 11.597,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.597,
            freq: 220,
            dur: 0.252,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 11.597,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 11.597,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 11.849,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          }
        ]
      },
      {
        title: 'Build-up (Swell) [123.6 - 131.6)',
        phraseIndex: 16,
        startBar: 123,
        startBeat: 6,
        endBar: 131,
        endBeat: 6,
        duration: 12.101,
        notes: [
          {
            time: 0,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 0,
            freq: 880,
            dur: 0.252,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 0,
            freq: 440,
            dur: 0.252,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 0.252,
            freq: 49,
            dur: 0.252,
            vel: 0.5,
            name: 'G1'
          },
          {
            time: 0.252,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 0.252,
            freq: 369.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#4'
          },
          {
            time: 0.252,
            freq: 739.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#5'
          },
          {
            time: 0.504,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 0.756,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 0.756,
            freq: 783.99,
            dur: 0.756,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 0.756,
            freq: 392,
            dur: 0.756,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 0.756,
            freq: 493.88,
            dur: 0.756,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 1.008,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 1.008,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 1.008,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 1.008,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 1.261,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 1.513,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 1.513,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 1.513,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 1.513,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 1.765,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 1.765,
            freq: 61.74,
            dur: 0.252,
            vel: 0.5,
            name: 'B1'
          },
          {
            time: 1.765,
            freq: 49,
            dur: 0.252,
            vel: 0.5,
            name: 'G1'
          },
          {
            time: 1.765,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 1.765,
            freq: 739.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#5'
          },
          {
            time: 1.765,
            freq: 369.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#4'
          },
          {
            time: 2.017,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 2.269,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 2.269,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 2.269,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 2.269,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 2.521,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 2.521,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 2.521,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 2.521,
            freq: 880,
            dur: 0.504,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 2.521,
            freq: 440,
            dur: 0.504,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 2.773,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 3.025,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 3.025,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 3.025,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 3.025,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 3.277,
            freq: 61.74,
            dur: 0.252,
            vel: 0.5,
            name: 'B1'
          },
          {
            time: 3.277,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 3.277,
            freq: 587.33,
            dur: 0.504,
            vel: 0.5,
            name: 'D5'
          },
          {
            time: 3.277,
            freq: 1174.66,
            dur: 0.504,
            vel: 0.5,
            name: 'D6'
          },
          {
            time: 3.529,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 3.782,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 3.782,
            freq: 880,
            dur: 0.756,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 3.782,
            freq: 440,
            dur: 0.756,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 4.034,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 4.034,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 4.034,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 4.034,
            freq: 246.94,
            dur: 0.252,
            vel: 0.5,
            name: 'B3'
          },
          {
            time: 4.286,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 4.538,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 4.538,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 4.538,
            freq: 932.33,
            dur: 0.252,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 4.79,
            freq: 61.74,
            dur: 0.252,
            vel: 0.5,
            name: 'B1'
          },
          {
            time: 4.79,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 4.79,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 4.79,
            freq: 622.25,
            dur: 0.252,
            vel: 0.5,
            name: 'D#5'
          },
          {
            time: 4.79,
            freq: 987.77,
            dur: 0.252,
            vel: 0.5,
            name: 'B5'
          },
          {
            time: 5.042,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 5.042,
            freq: 622.25,
            dur: 0.252,
            vel: 0.5,
            name: 'D#5'
          },
          {
            time: 5.042,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 5.042,
            freq: 987.77,
            dur: 0.252,
            vel: 0.5,
            name: 'B5'
          },
          {
            time: 5.294,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 5.294,
            freq: 622.25,
            dur: 0.252,
            vel: 0.5,
            name: 'D#5'
          },
          {
            time: 5.294,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 5.294,
            freq: 987.77,
            dur: 0.252,
            vel: 0.5,
            name: 'B5'
          },
          {
            time: 5.546,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 5.546,
            freq: 246.94,
            dur: 0.252,
            vel: 0.5,
            name: 'B3'
          },
          {
            time: 5.546,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 5.546,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 5.546,
            freq: 622.25,
            dur: 0.252,
            vel: 0.5,
            name: 'D#5'
          },
          {
            time: 5.546,
            freq: 987.77,
            dur: 0.252,
            vel: 0.5,
            name: 'B5'
          },
          {
            time: 5.798,
            freq: 138.59,
            dur: 0.252,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 5.798,
            freq: 622.25,
            dur: 0.252,
            vel: 0.5,
            name: 'D#5'
          },
          {
            time: 5.798,
            freq: 987.77,
            dur: 0.252,
            vel: 0.5,
            name: 'B5'
          },
          {
            time: 5.798,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 6.05,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 6.05,
            freq: 622.25,
            dur: 0.252,
            vel: 0.5,
            name: 'D#5'
          },
          {
            time: 6.05,
            freq: 987.77,
            dur: 0.252,
            vel: 0.5,
            name: 'B5'
          },
          {
            time: 6.05,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 6.303,
            freq: 82.41,
            dur: 0.252,
            vel: 0.5,
            name: 'E2'
          },
          {
            time: 6.303,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 6.555,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 6.807,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 7.059,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 7.059,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 7.059,
            freq: 246.94,
            dur: 0.252,
            vel: 0.5,
            name: 'B3'
          },
          {
            time: 7.059,
            freq: 329.63,
            dur: 0.252,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 7.059,
            freq: 659.26,
            dur: 0.252,
            vel: 0.5,
            name: 'E5'
          },
          {
            time: 7.059,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 7.059,
            freq: 987.77,
            dur: 0.252,
            vel: 0.5,
            name: 'B5'
          },
          {
            time: 7.311,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 7.311,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 7.311,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 7.311,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 7.563,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 7.563,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 7.563,
            freq: 493.88,
            dur: 0.504,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 7.563,
            freq: 783.99,
            dur: 0.504,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 7.815,
            freq: 82.41,
            dur: 0.252,
            vel: 0.5,
            name: 'E2'
          },
          {
            time: 7.815,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.067,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.067,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 8.067,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 8.067,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 8.319,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.319,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 8.319,
            freq: 329.63,
            dur: 0.252,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 8.319,
            freq: 659.26,
            dur: 0.252,
            vel: 0.5,
            name: 'E5'
          },
          {
            time: 8.571,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.571,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 8.571,
            freq: 246.94,
            dur: 0.252,
            vel: 0.5,
            name: 'B3'
          },
          {
            time: 8.571,
            freq: 329.63,
            dur: 0.252,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 8.571,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 8.571,
            freq: 659.26,
            dur: 0.504,
            vel: 0.5,
            name: 'E5'
          },
          {
            time: 8.824,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 9.076,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 9.076,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 9.076,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 9.076,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 9.328,
            freq: 65.41,
            dur: 0.252,
            vel: 0.5,
            name: 'C2'
          },
          {
            time: 9.328,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 9.328,
            freq: 932.33,
            dur: 0.252,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 9.328,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 9.58,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 9.58,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 9.58,
            freq: 932.33,
            dur: 0.252,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 9.832,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 9.832,
            freq: 932.33,
            dur: 0.756,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 9.832,
            freq: 466.16,
            dur: 0.756,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 10.084,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 10.084,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 10.084,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 10.084,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 10.336,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 10.588,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 10.588,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 10.588,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 10.84,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 10.84,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 10.84,
            freq: 932.33,
            dur: 0.252,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 10.84,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 11.092,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.092,
            freq: 932.33,
            dur: 0.252,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 11.092,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 11.345,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.345,
            freq: 440,
            dur: 0.756,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 11.345,
            freq: 880,
            dur: 0.756,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 11.597,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.597,
            freq: 220,
            dur: 0.252,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 11.597,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 11.597,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 11.849,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          }
        ]
      },
      {
        title: 'Final Chorus 1 (Explosion) [131.6 - 140.1)',
        phraseIndex: 17,
        startBar: 131,
        startBeat: 6,
        endBar: 140,
        endBeat: 1,
        duration: 12.353,
        notes: [
          {
            time: 0,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 0,
            freq: 880,
            dur: 0.252,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 0,
            freq: 440,
            dur: 0.252,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 0.252,
            freq: 49,
            dur: 0.252,
            vel: 0.5,
            name: 'G1'
          },
          {
            time: 0.252,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 0.252,
            freq: 369.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#4'
          },
          {
            time: 0.252,
            freq: 739.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#5'
          },
          {
            time: 0.504,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 0.756,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 0.756,
            freq: 783.99,
            dur: 0.756,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 0.756,
            freq: 392,
            dur: 0.756,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 0.756,
            freq: 493.88,
            dur: 0.756,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 1.008,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 1.008,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 1.008,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 1.008,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 1.261,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 1.513,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 1.513,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 1.513,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 1.513,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 1.765,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 1.765,
            freq: 61.74,
            dur: 0.252,
            vel: 0.5,
            name: 'B1'
          },
          {
            time: 1.765,
            freq: 49,
            dur: 0.252,
            vel: 0.5,
            name: 'G1'
          },
          {
            time: 1.765,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 1.765,
            freq: 739.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#5'
          },
          {
            time: 1.765,
            freq: 369.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#4'
          },
          {
            time: 2.017,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 2.269,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 2.269,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 2.269,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 2.269,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 2.521,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 2.521,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 2.521,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 2.521,
            freq: 880,
            dur: 0.504,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 2.521,
            freq: 440,
            dur: 0.504,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 2.773,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 3.025,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 3.025,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 3.025,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 3.025,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 3.277,
            freq: 61.74,
            dur: 0.252,
            vel: 0.5,
            name: 'B1'
          },
          {
            time: 3.277,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 3.277,
            freq: 369.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#4'
          },
          {
            time: 3.277,
            freq: 739.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#5'
          },
          {
            time: 3.529,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 3.782,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 3.782,
            freq: 783.99,
            dur: 0.756,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 3.782,
            freq: 392,
            dur: 0.756,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 3.782,
            freq: 493.88,
            dur: 0.756,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 4.034,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 4.034,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 4.034,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 4.034,
            freq: 246.94,
            dur: 0.252,
            vel: 0.5,
            name: 'B3'
          },
          {
            time: 4.286,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 4.538,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 4.538,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 4.538,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 4.538,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 4.79,
            freq: 61.74,
            dur: 0.252,
            vel: 0.5,
            name: 'B1'
          },
          {
            time: 4.79,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 4.79,
            freq: 739.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#5'
          },
          {
            time: 4.79,
            freq: 369.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#4'
          },
          {
            time: 5.042,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 5.294,
            freq: 123.47,
            dur: 0.252,
            vel: 0.5,
            name: 'B2'
          },
          {
            time: 5.294,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 5.294,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 5.294,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 5.546,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 5.546,
            freq: 246.94,
            dur: 0.252,
            vel: 0.5,
            name: 'B3'
          },
          {
            time: 5.546,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 5.546,
            freq: 880,
            dur: 0.504,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 5.546,
            freq: 440,
            dur: 0.504,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 5.798,
            freq: 138.59,
            dur: 0.252,
            vel: 0.5,
            name: 'C#3'
          },
          {
            time: 6.05,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 6.05,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 6.05,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 6.05,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 6.303,
            freq: 82.41,
            dur: 0.252,
            vel: 0.5,
            name: 'E2'
          },
          {
            time: 6.303,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 6.303,
            freq: 369.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#4'
          },
          {
            time: 6.303,
            freq: 739.99,
            dur: 0.504,
            vel: 0.5,
            name: 'F#5'
          },
          {
            time: 6.555,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 6.807,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 6.807,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 6.807,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 6.807,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 7.059,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 7.059,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 7.059,
            freq: 246.94,
            dur: 0.252,
            vel: 0.5,
            name: 'B3'
          },
          {
            time: 7.059,
            freq: 329.63,
            dur: 0.252,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 7.059,
            freq: 587.33,
            dur: 0.252,
            vel: 0.5,
            name: 'D5'
          },
          {
            time: 7.059,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 7.059,
            freq: 987.77,
            dur: 0.252,
            vel: 0.5,
            name: 'B5'
          },
          {
            time: 7.311,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 7.311,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 7.311,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 7.311,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 7.563,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 7.563,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 7.563,
            freq: 493.88,
            dur: 0.504,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 7.563,
            freq: 783.99,
            dur: 0.504,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 7.815,
            freq: 82.41,
            dur: 0.252,
            vel: 0.5,
            name: 'E2'
          },
          {
            time: 7.815,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.067,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.067,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 8.067,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 8.067,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 8.319,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.319,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 8.319,
            freq: 329.63,
            dur: 0.252,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 8.319,
            freq: 659.26,
            dur: 0.252,
            vel: 0.5,
            name: 'E5'
          },
          {
            time: 8.571,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.571,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 8.571,
            freq: 246.94,
            dur: 0.252,
            vel: 0.5,
            name: 'B3'
          },
          {
            time: 8.571,
            freq: 329.63,
            dur: 0.252,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 8.571,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 8.571,
            freq: 659.26,
            dur: 0.504,
            vel: 0.5,
            name: 'E5'
          },
          {
            time: 8.824,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 9.076,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 9.076,
            freq: 493.88,
            dur: 0.252,
            vel: 0.5,
            name: 'B4'
          },
          {
            time: 9.076,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 9.076,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 9.328,
            freq: 65.41,
            dur: 0.252,
            vel: 0.5,
            name: 'C2'
          },
          {
            time: 9.328,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 9.328,
            freq: 932.33,
            dur: 0.252,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 9.328,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 9.58,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 9.58,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 9.58,
            freq: 932.33,
            dur: 0.252,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 9.832,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 9.832,
            freq: 932.33,
            dur: 0.756,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 9.832,
            freq: 466.16,
            dur: 0.756,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 10.084,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 10.084,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 10.084,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 10.084,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 10.336,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 10.588,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 10.588,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 10.588,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 10.84,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 10.84,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 10.84,
            freq: 932.33,
            dur: 0.252,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 10.84,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 11.092,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.092,
            freq: 932.33,
            dur: 0.252,
            vel: 0.5,
            name: 'A#5'
          },
          {
            time: 11.092,
            freq: 466.16,
            dur: 0.252,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 11.345,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.345,
            freq: 440,
            dur: 1.008,
            vel: 0.5,
            name: 'A4'
          },
          {
            time: 11.345,
            freq: 880,
            dur: 1.008,
            vel: 0.5,
            name: 'A5'
          },
          {
            time: 11.597,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.597,
            freq: 220,
            dur: 0.252,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 11.597,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 11.597,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 11.849,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 12.101,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          }
        ]
      },
      {
        title: 'Final Chorus 2 (Peak Energy) [140.1 - 147.6)',
        phraseIndex: 18,
        startBar: 140,
        startBeat: 1,
        endBar: 147,
        endBeat: 6,
        duration: 11.849,
        notes: [
          {
            time: 0,
            freq: 98,
            dur: 0.504,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 0,
            freq: 146.83,
            dur: 0.504,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 0,
            freq: 196,
            dur: 0.504,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 0.252,
            freq: 830.61,
            dur: 0.504,
            vel: 0.5,
            name: 'G#5'
          },
          {
            time: 0.252,
            freq: 415.3,
            dur: 0.504,
            vel: 0.5,
            name: 'G#4'
          },
          {
            time: 0.504,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 0.756,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 0.756,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 0.756,
            freq: 392,
            dur: 0.756,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 0.756,
            freq: 783.99,
            dur: 0.756,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 1.008,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 1.261,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 1.513,
            freq: 65.41,
            dur: 0.504,
            vel: 0.5,
            name: 'C2'
          },
          {
            time: 1.513,
            freq: 130.81,
            dur: 0.504,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 1.765,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 1.765,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 1.765,
            freq: 466.16,
            dur: 0.504,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 2.017,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 2.269,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 2.269,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 2.269,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 2.269,
            freq: 392,
            dur: 0.756,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 2.269,
            freq: 329.63,
            dur: 0.756,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 2.269,
            freq: 466.16,
            dur: 0.756,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 2.521,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 2.773,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 3.025,
            freq: 98,
            dur: 0.504,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 3.025,
            freq: 146.83,
            dur: 0.504,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 3.025,
            freq: 196,
            dur: 0.504,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 3.277,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 3.277,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 3.277,
            freq: 466.16,
            dur: 0.504,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 3.277,
            freq: 587.33,
            dur: 0.504,
            vel: 0.5,
            name: 'D5'
          },
          {
            time: 3.529,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 3.782,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 3.782,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 3.782,
            freq: 392,
            dur: 0.756,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 3.782,
            freq: 466.16,
            dur: 0.756,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 3.782,
            freq: 587.33,
            dur: 0.756,
            vel: 0.5,
            name: 'D5'
          },
          {
            time: 3.782,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 4.034,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 4.286,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 4.538,
            freq: 65.41,
            dur: 0.504,
            vel: 0.5,
            name: 'C2'
          },
          {
            time: 4.538,
            freq: 130.81,
            dur: 0.504,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 4.79,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 4.79,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 4.79,
            freq: 466.16,
            dur: 0.504,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 5.042,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 5.294,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 5.294,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 5.294,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 5.294,
            freq: 392,
            dur: 0.756,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 5.294,
            freq: 329.63,
            dur: 0.756,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 5.294,
            freq: 466.16,
            dur: 0.756,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 5.546,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 5.798,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 6.05,
            freq: 98,
            dur: 0.504,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 6.05,
            freq: 146.83,
            dur: 0.504,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 6.05,
            freq: 196,
            dur: 0.504,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 6.303,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 6.303,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 6.303,
            freq: 466.16,
            dur: 0.504,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 6.303,
            freq: 587.33,
            dur: 0.504,
            vel: 0.5,
            name: 'D5'
          },
          {
            time: 6.555,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 6.807,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 6.807,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 6.807,
            freq: 392,
            dur: 0.756,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 6.807,
            freq: 466.16,
            dur: 0.756,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 6.807,
            freq: 587.33,
            dur: 0.756,
            vel: 0.5,
            name: 'D5'
          },
          {
            time: 6.807,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 7.059,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 7.311,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 7.563,
            freq: 65.41,
            dur: 0.504,
            vel: 0.5,
            name: 'C2'
          },
          {
            time: 7.563,
            freq: 130.81,
            dur: 0.504,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 7.815,
            freq: 329.63,
            dur: 0.504,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 7.815,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 7.815,
            freq: 466.16,
            dur: 0.504,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 8.067,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 8.319,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 8.319,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 8.319,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 8.319,
            freq: 392,
            dur: 0.756,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 8.319,
            freq: 329.63,
            dur: 0.756,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 8.319,
            freq: 466.16,
            dur: 0.756,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 8.571,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 8.824,
            freq: 164.81,
            dur: 0.252,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 9.076,
            freq: 98,
            dur: 0.504,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 9.076,
            freq: 146.83,
            dur: 0.504,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 9.076,
            freq: 196,
            dur: 0.504,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 9.328,
            freq: 392,
            dur: 0.504,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 9.328,
            freq: 349.23,
            dur: 0.504,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 9.328,
            freq: 466.16,
            dur: 0.504,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 9.328,
            freq: 587.33,
            dur: 0.504,
            vel: 0.5,
            name: 'D5'
          },
          {
            time: 9.58,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 9.832,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 9.832,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 9.832,
            freq: 392,
            dur: 0.756,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 9.832,
            freq: 466.16,
            dur: 0.756,
            vel: 0.5,
            name: 'A#4'
          },
          {
            time: 9.832,
            freq: 587.33,
            dur: 0.756,
            vel: 0.5,
            name: 'D5'
          },
          {
            time: 9.832,
            freq: 349.23,
            dur: 0.756,
            vel: 0.5,
            name: 'F4'
          },
          {
            time: 10.084,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 10.336,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 10.588,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 10.588,
            freq: 164.81,
            dur: 1.513,
            vel: 0.5,
            name: 'E3'
          },
          {
            time: 10.588,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 10.588,
            freq: 261.63,
            dur: 1.513,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 10.588,
            freq: 329.63,
            dur: 0.756,
            vel: 0.5,
            name: 'E4'
          },
          {
            time: 10.588,
            freq: 392,
            dur: 0.756,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 10.588,
            freq: 466.16,
            dur: 0.756,
            vel: 0.5,
            name: 'A#4'
          }
        ]
      },
      {
        title: 'Outro 1 (Sustained Guitar) [147.6 - 155.6)',
        phraseIndex: 19,
        startBar: 147,
        startBeat: 6,
        endBar: 155,
        endBeat: 6,
        duration: 12.101,
        notes: [
          {
            time: 0,
            freq: 277.18,
            dur: 0.252,
            vel: 0.5,
            name: 'C#4'
          },
          {
            time: 0.252,
            freq: 98,
            dur: 1.513,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 0.252,
            freq: 116.54,
            dur: 1.513,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 0.252,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 0.252,
            freq: 293.66,
            dur: 1.261,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 1.513,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 1.765,
            freq: 92.5,
            dur: 1.513,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 1.765,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 1.765,
            freq: 261.63,
            dur: 0.504,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 2.269,
            freq: 293.66,
            dur: 1.008,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 3.277,
            freq: 87.31,
            dur: 1.513,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 3.277,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 3.277,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 3.529,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 3.782,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 4.034,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 4.286,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 4.538,
            freq: 277.18,
            dur: 0.252,
            vel: 0.5,
            name: 'C#4'
          },
          {
            time: 4.79,
            freq: 82.41,
            dur: 1.513,
            vel: 0.5,
            name: 'E2'
          },
          {
            time: 4.79,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 4.79,
            freq: 293.66,
            dur: 0.504,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 5.294,
            freq: 196,
            dur: 1.008,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 6.303,
            freq: 98,
            dur: 1.513,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 6.303,
            freq: 77.78,
            dur: 1.513,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 6.303,
            freq: 116.54,
            dur: 1.513,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 6.555,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 6.807,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 7.059,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 7.311,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 7.563,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 7.815,
            freq: 110,
            dur: 1.513,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 7.815,
            freq: 73.42,
            dur: 1.513,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 7.815,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 7.815,
            freq: 92.5,
            dur: 1.513,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 7.815,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 8.067,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 8.319,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 8.571,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 8.824,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 9.076,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 9.328,
            freq: 65.41,
            dur: 0.252,
            vel: 0.5,
            name: 'C2'
          },
          {
            time: 9.328,
            freq: 220,
            dur: 0.504,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 9.58,
            freq: 77.78,
            dur: 0.252,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 9.58,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 9.58,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 9.832,
            freq: 233.08,
            dur: 1.008,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 10.084,
            freq: 77.78,
            dur: 0.756,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 10.084,
            freq: 98,
            dur: 0.756,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 10.084,
            freq: 116.54,
            dur: 0.756,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 10.84,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 11.092,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 11.092,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 11.092,
            freq: 92.5,
            dur: 0.252,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 11.597,
            freq: 110,
            dur: 0.756,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 11.597,
            freq: 130.81,
            dur: 0.756,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 11.597,
            freq: 92.5,
            dur: 0.756,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 11.597,
            freq: 261.63,
            dur: 0.504,
            vel: 0.5,
            name: 'C4'
          }
        ]
      },
      {
        title: 'Outro 2 (Harmonic Breakdown) [155.6 - 162.6)',
        phraseIndex: 20,
        startBar: 155,
        startBeat: 6,
        endBar: 162,
        endBeat: 6,
        duration: 10.588,
        notes: [
          {
            time: 0,
            freq: 277.18,
            dur: 0.252,
            vel: 0.5,
            name: 'C#4'
          },
          {
            time: 0.252,
            freq: 98,
            dur: 1.513,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 0.252,
            freq: 116.54,
            dur: 1.513,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 0.252,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 0.252,
            freq: 293.66,
            dur: 1.261,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 1.513,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 1.765,
            freq: 92.5,
            dur: 1.513,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 1.765,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 1.765,
            freq: 261.63,
            dur: 0.504,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 2.269,
            freq: 293.66,
            dur: 1.008,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 3.277,
            freq: 87.31,
            dur: 1.513,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 3.277,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 3.277,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 3.529,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 3.782,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 4.034,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 4.286,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 4.538,
            freq: 277.18,
            dur: 0.252,
            vel: 0.5,
            name: 'C#4'
          },
          {
            time: 4.79,
            freq: 82.41,
            dur: 1.513,
            vel: 0.5,
            name: 'E2'
          },
          {
            time: 4.79,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 4.79,
            freq: 293.66,
            dur: 0.504,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 5.294,
            freq: 196,
            dur: 1.008,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 6.303,
            freq: 98,
            dur: 1.513,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 6.303,
            freq: 77.78,
            dur: 1.513,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 6.303,
            freq: 116.54,
            dur: 1.513,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 6.555,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 6.807,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 7.059,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 7.311,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 7.563,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 7.815,
            freq: 110,
            dur: 1.513,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 7.815,
            freq: 73.42,
            dur: 1.513,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 7.815,
            freq: 130.81,
            dur: 1.513,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 7.815,
            freq: 92.5,
            dur: 1.513,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 7.815,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 8.067,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 8.319,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 8.571,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 8.824,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 9.076,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 9.328,
            freq: 116.54,
            dur: 1.513,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 9.328,
            freq: 146.83,
            dur: 1.513,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 9.328,
            freq: 98,
            dur: 1.513,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 9.328,
            freq: 233.08,
            dur: 1.513,
            vel: 0.5,
            name: 'A#3'
          }
        ]
      },
      {
        title: 'Final Outro & Ending Cadence [162.6 - 178.1)',
        phraseIndex: 21,
        startBar: 162,
        startBeat: 6,
        endBar: 178,
        endBeat: 1,
        duration: 22.941,
        notes: [
          {
            time: 0.252,
            freq: 98,
            dur: 0.756,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 0.252,
            freq: 146.83,
            dur: 0.756,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 0.252,
            freq: 77.78,
            dur: 0.756,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 0.252,
            freq: 116.54,
            dur: 0.756,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 0.504,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 0.756,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 1.008,
            freq: 73.42,
            dur: 0.756,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 1.008,
            freq: 110,
            dur: 0.756,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 1.008,
            freq: 130.81,
            dur: 0.756,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 1.008,
            freq: 92.5,
            dur: 0.756,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 1.008,
            freq: 261.63,
            dur: 0.504,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 1.008,
            freq: 277.18,
            dur: 0.504,
            vel: 0.5,
            name: 'C#4'
          },
          {
            time: 1.513,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 1.765,
            freq: 98,
            dur: 1.261,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 1.765,
            freq: 146.83,
            dur: 1.261,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 1.765,
            freq: 116.54,
            dur: 1.261,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 1.765,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 3.025,
            freq: 87.31,
            dur: 0.252,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 3.277,
            freq: 98,
            dur: 0.756,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 3.277,
            freq: 146.83,
            dur: 0.756,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 3.277,
            freq: 77.78,
            dur: 0.756,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 3.277,
            freq: 116.54,
            dur: 0.756,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 3.529,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 3.782,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 4.034,
            freq: 73.42,
            dur: 0.756,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 4.034,
            freq: 110,
            dur: 0.756,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 4.034,
            freq: 92.5,
            dur: 0.756,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 4.034,
            freq: 130.81,
            dur: 0.756,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 4.034,
            freq: 261.63,
            dur: 0.504,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 4.034,
            freq: 277.18,
            dur: 0.504,
            vel: 0.5,
            name: 'C#4'
          },
          {
            time: 4.538,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 4.79,
            freq: 98,
            dur: 1.261,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 4.79,
            freq: 146.83,
            dur: 1.261,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 4.79,
            freq: 116.54,
            dur: 1.261,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 4.79,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 6.05,
            freq: 87.31,
            dur: 0.252,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 6.303,
            freq: 98,
            dur: 0.756,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 6.303,
            freq: 146.83,
            dur: 0.756,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 6.303,
            freq: 77.78,
            dur: 0.756,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 6.303,
            freq: 116.54,
            dur: 0.756,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 6.555,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 6.807,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 7.059,
            freq: 73.42,
            dur: 0.756,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 7.059,
            freq: 110,
            dur: 0.756,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 7.059,
            freq: 92.5,
            dur: 0.756,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 7.059,
            freq: 130.81,
            dur: 0.756,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 7.059,
            freq: 261.63,
            dur: 0.504,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 7.059,
            freq: 277.18,
            dur: 0.504,
            vel: 0.5,
            name: 'C#4'
          },
          {
            time: 7.563,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 7.815,
            freq: 98,
            dur: 1.261,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 7.815,
            freq: 146.83,
            dur: 1.261,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 7.815,
            freq: 116.54,
            dur: 1.261,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 7.815,
            freq: 196,
            dur: 1.513,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 9.076,
            freq: 87.31,
            dur: 0.252,
            vel: 0.5,
            name: 'F2'
          },
          {
            time: 9.328,
            freq: 98,
            dur: 0.756,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 9.328,
            freq: 146.83,
            dur: 0.756,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 9.328,
            freq: 77.78,
            dur: 0.756,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 9.328,
            freq: 116.54,
            dur: 0.756,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 9.58,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 9.832,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 10.084,
            freq: 73.42,
            dur: 0.756,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 10.084,
            freq: 110,
            dur: 0.756,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 10.084,
            freq: 92.5,
            dur: 0.756,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 10.084,
            freq: 130.81,
            dur: 0.756,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 10.084,
            freq: 261.63,
            dur: 0.504,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 10.084,
            freq: 277.18,
            dur: 0.504,
            vel: 0.5,
            name: 'C#4'
          },
          {
            time: 10.588,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 10.84,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 10.84,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 10.84,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 10.84,
            freq: 196,
            dur: 0.756,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 11.092,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 11.092,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 11.092,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.345,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 11.345,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 11.345,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.597,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 11.597,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.597,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 11.597,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 11.597,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 11.597,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 11.849,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 11.849,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 11.849,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 11.849,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 11.849,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 11.849,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 12.101,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 12.101,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 12.101,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 12.101,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 12.101,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 12.101,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 12.353,
            freq: 77.78,
            dur: 0.252,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 12.353,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 12.353,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 12.353,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 12.353,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 12.353,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 12.353,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 12.605,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 12.605,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 12.605,
            freq: 77.78,
            dur: 0.252,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 12.605,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 12.605,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 12.605,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 12.605,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 12.857,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 12.857,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 12.857,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 12.857,
            freq: 77.78,
            dur: 0.252,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 12.857,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 12.857,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 12.857,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 13.109,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 13.109,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 13.109,
            freq: 92.5,
            dur: 0.252,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 13.109,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 13.109,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 13.109,
            freq: 220,
            dur: 0.252,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 13.109,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 13.361,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 13.361,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 13.361,
            freq: 92.5,
            dur: 0.252,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 13.361,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 13.361,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 13.361,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 13.361,
            freq: 220,
            dur: 0.252,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 13.613,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 13.613,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 13.613,
            freq: 92.5,
            dur: 0.252,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 13.613,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 13.613,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 13.613,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 13.613,
            freq: 220,
            dur: 0.252,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 13.866,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 13.866,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 13.866,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 13.866,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 13.866,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 13.866,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 14.118,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 14.118,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 14.118,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 14.118,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 14.118,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 14.118,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 14.37,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 14.37,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 14.37,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 14.37,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 14.37,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 14.37,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 14.622,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 14.622,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 14.622,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 14.622,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 14.622,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 14.622,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 14.874,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 14.874,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 14.874,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 14.874,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 14.874,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 14.874,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 15.126,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 15.126,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 15.126,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 15.126,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 15.126,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 15.126,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 15.378,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 15.378,
            freq: 77.78,
            dur: 0.252,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 15.378,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 15.378,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 15.378,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 15.378,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 15.378,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 15.63,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 15.63,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 15.63,
            freq: 77.78,
            dur: 0.252,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 15.63,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 15.63,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 15.63,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 15.63,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 15.882,
            freq: 77.78,
            dur: 0.252,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 15.882,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 15.882,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 15.882,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 15.882,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 15.882,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 15.882,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 16.134,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 16.134,
            freq: 92.5,
            dur: 0.252,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 16.134,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 16.134,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 16.134,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 16.134,
            freq: 220,
            dur: 0.252,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 16.134,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 16.387,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 16.387,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 16.387,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 16.387,
            freq: 92.5,
            dur: 0.252,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 16.387,
            freq: 220,
            dur: 0.252,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 16.387,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 16.387,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 16.639,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 16.639,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 16.639,
            freq: 92.5,
            dur: 0.252,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 16.639,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 16.639,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 16.639,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 16.639,
            freq: 220,
            dur: 0.252,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 16.891,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 16.891,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 16.891,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 16.891,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 16.891,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 16.891,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 17.143,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 17.143,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 17.143,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 17.143,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 17.143,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 17.143,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 17.395,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 17.395,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 17.395,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 17.395,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 17.395,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 17.395,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 17.647,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 17.647,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 17.647,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 17.647,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 17.647,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 17.647,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 17.899,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 17.899,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 17.899,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 17.899,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 17.899,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 17.899,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 18.151,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 18.151,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 18.151,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 18.151,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 18.151,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 18.151,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 18.403,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 18.403,
            freq: 77.78,
            dur: 0.252,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 18.403,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 18.403,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 18.403,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 18.403,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 18.403,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 18.655,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 18.655,
            freq: 77.78,
            dur: 0.252,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 18.655,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 18.655,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 18.655,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 18.655,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 18.655,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 18.908,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 18.908,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 18.908,
            freq: 77.78,
            dur: 0.252,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 18.908,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 18.908,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 18.908,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 18.908,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 19.16,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 19.16,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 19.16,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 19.16,
            freq: 92.5,
            dur: 0.252,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 19.16,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 19.16,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 19.16,
            freq: 220,
            dur: 0.252,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 19.412,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 19.412,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 19.412,
            freq: 92.5,
            dur: 0.252,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 19.412,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 19.412,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 19.412,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 19.412,
            freq: 220,
            dur: 0.252,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 19.664,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 19.664,
            freq: 130.81,
            dur: 0.252,
            vel: 0.5,
            name: 'C3'
          },
          {
            time: 19.664,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 19.664,
            freq: 92.5,
            dur: 0.252,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 19.664,
            freq: 220,
            dur: 0.252,
            vel: 0.5,
            name: 'A3'
          },
          {
            time: 19.664,
            freq: 185,
            dur: 0.252,
            vel: 0.5,
            name: 'F#3'
          },
          {
            time: 19.664,
            freq: 261.63,
            dur: 0.252,
            vel: 0.5,
            name: 'C4'
          },
          {
            time: 19.916,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 19.916,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 19.916,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 19.916,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 19.916,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 19.916,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 20.168,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 20.168,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 20.168,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 20.168,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 20.168,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 20.168,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 20.42,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 20.42,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 20.42,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 20.42,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 20.42,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 20.42,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 20.672,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 20.672,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 20.672,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 20.672,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 20.672,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 20.672,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 20.924,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 20.924,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 20.924,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 20.924,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 20.924,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 20.924,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 21.176,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 21.176,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 21.176,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 21.176,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 21.176,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 21.176,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 21.429,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 21.429,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 21.429,
            freq: 77.78,
            dur: 0.252,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 21.429,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 21.429,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 21.429,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 21.429,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 21.681,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 21.681,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 21.681,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 21.681,
            freq: 77.78,
            dur: 0.252,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 21.681,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 21.681,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 21.681,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 21.933,
            freq: 98,
            dur: 0.252,
            vel: 0.5,
            name: 'G2'
          },
          {
            time: 21.933,
            freq: 116.54,
            dur: 0.252,
            vel: 0.5,
            name: 'A#2'
          },
          {
            time: 21.933,
            freq: 155.56,
            dur: 0.252,
            vel: 0.5,
            name: 'D#3'
          },
          {
            time: 21.933,
            freq: 77.78,
            dur: 0.252,
            vel: 0.5,
            name: 'D#2'
          },
          {
            time: 21.933,
            freq: 293.66,
            dur: 0.252,
            vel: 0.5,
            name: 'D4'
          },
          {
            time: 21.933,
            freq: 196,
            dur: 0.252,
            vel: 0.5,
            name: 'G3'
          },
          {
            time: 21.933,
            freq: 233.08,
            dur: 0.252,
            vel: 0.5,
            name: 'A#3'
          },
          {
            time: 22.185,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 22.185,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 22.185,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 22.185,
            freq: 92.5,
            dur: 0.252,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 22.185,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 22.185,
            freq: 587.33,
            dur: 0.252,
            vel: 0.5,
            name: 'D5'
          },
          {
            time: 22.185,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 22.437,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 22.437,
            freq: 92.5,
            dur: 0.252,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 22.437,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 22.437,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 22.437,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 22.437,
            freq: 587.33,
            dur: 0.252,
            vel: 0.5,
            name: 'D5'
          },
          {
            time: 22.437,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 22.689,
            freq: 92.5,
            dur: 0.252,
            vel: 0.5,
            name: 'F#2'
          },
          {
            time: 22.689,
            freq: 110,
            dur: 0.252,
            vel: 0.5,
            name: 'A2'
          },
          {
            time: 22.689,
            freq: 73.42,
            dur: 0.252,
            vel: 0.5,
            name: 'D2'
          },
          {
            time: 22.689,
            freq: 146.83,
            dur: 0.252,
            vel: 0.5,
            name: 'D3'
          },
          {
            time: 22.689,
            freq: 392,
            dur: 0.252,
            vel: 0.5,
            name: 'G4'
          },
          {
            time: 22.689,
            freq: 783.99,
            dur: 0.252,
            vel: 0.5,
            name: 'G5'
          },
          {
            time: 22.689,
            freq: 587.33,
            dur: 0.252,
            vel: 0.5,
            name: 'D5'
          }
        ]
      }
    ]
  }
]
