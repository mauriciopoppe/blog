export interface RubySegment {
  text: string
  rt?: string
}

export interface Card {
  question: RubySegment[]
  translation: string
  answers: string[]
}

export const cards: Card[] = [
  {
    question: [
      { text: '昨日', rt: 'きのう' },
      { text: '何', rt: 'なに' },
      { text: 'をしましたか？' },
    ],
    translation: 'What did you do yesterday?',
    answers: [
      '昨日は映画を見ました。 (Yesterday I watched a movie.)',
      '友達と晩ご飯を食べました。 (I had dinner with a friend.)',
      '家でゆっくりしました。 (I relaxed at home.)',
    ],
  },
  {
    question: [
      { text: '今日', rt: 'きょう' },
      { text: 'はどんな' },
      { text: '一日', rt: 'いちにち' },
      { text: 'でしたか？' },
    ],
    translation: 'How was your day today?',
    answers: [
      '忙しかったです。 (It was busy.)',
      '楽しかったです。 (It was fun.)',
      '普通でした。 (It was normal.)',
    ],
  },
  {
    question: [
      { text: '週末', rt: 'しゅうまつ' },
      { text: 'は何をしますか？' },
    ],
    translation: 'What will you do this weekend?',
    answers: [
      '買い物に行きます。 (I will go shopping.)',
      '旅行に行きます。 (I will go on a trip.)',
      '家で掃除をします。 (I will clean the house.)',
    ],
  },
]
