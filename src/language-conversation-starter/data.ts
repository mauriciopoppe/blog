export interface RubySegment {
  text: string
  rt?: string
}

export interface Answer {
  segments: RubySegment[]
  translation: string
}

export interface Card {
  question: RubySegment[]
  translation: string
  answers: Answer[]
}

export const cards: Card[] = [
  {
    question: [
      {
        text: '昨日',
        rt: 'きのう'
      },
      {
        text: '何',
        rt: 'なに'
      },
      {
        text: 'をしましたか？'
      }
    ],
    translation: 'What did you do yesterday?',
    answers: [
      {
        segments: [
          {
            text: '昨日',
            rt: 'きのう'
          },
          {
            text: 'は'
          },
          {
            text: '映画',
            rt: 'えいが'
          },
          {
            text: 'を'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'ました。'
          }
        ],
        translation: 'Yesterday I watched a movie.'
      },
      {
        segments: [
          {
            text: '友達',
            rt: 'ともだち'
          },
          {
            text: 'と'
          },
          {
            text: '晩',
            rt: 'ばん'
          },
          {
            text: 'ご'
          },
          {
            text: '飯',
            rt: 'はん'
          },
          {
            text: 'を'
          },
          {
            text: '食',
            rt: 'た'
          },
          {
            text: 'べました。'
          }
        ],
        translation: 'I had dinner with a friend.'
      },
      {
        segments: [
          {
            text: '家',
            rt: 'いえ'
          },
          {
            text: 'でゆっくりしました。'
          }
        ],
        translation: 'I relaxed at home.'
      }
    ]
  },
  {
    question: [
      {
        text: '今日',
        rt: 'きょう'
      },
      {
        text: 'はどんな'
      },
      {
        text: '一日',
        rt: 'いちにち'
      },
      {
        text: 'でしたか？'
      }
    ],
    translation: 'How was your day today?',
    answers: [
      {
        segments: [
          {
            text: '忙',
            rt: 'いそが'
          },
          {
            text: 'しかったです。'
          }
        ],
        translation: 'It was busy.'
      },
      {
        segments: [
          {
            text: '楽',
            rt: 'たの'
          },
          {
            text: 'しかったです。'
          }
        ],
        translation: 'It was fun.'
      },
      {
        segments: [
          {
            text: '普通',
            rt: 'ふつう'
          },
          {
            text: 'でした。'
          }
        ],
        translation: 'It was normal.'
      }
    ]
  },
  {
    question: [
      {
        text: '週末',
        rt: 'しゅうまつ'
      },
      {
        text: 'は何をしますか？'
      }
    ],
    translation: 'What will you do this weekend?',
    answers: [
      {
        segments: [
          {
            text: '買',
            rt: 'か'
          },
          {
            text: 'い'
          },
          {
            text: '物',
            rt: 'もの'
          },
          {
            text: 'に'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'きます。'
          }
        ],
        translation: 'I will go shopping.'
      },
      {
        segments: [
          {
            text: '旅行',
            rt: 'りょこう'
          },
          {
            text: 'に'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'きます。'
          }
        ],
        translation: 'I will go on a trip.'
      },
      {
        segments: [
          {
            text: '家',
            rt: 'いえ'
          },
          {
            text: 'で'
          },
          {
            text: '掃除',
            rt: 'そうじ'
          },
          {
            text: 'をします。'
          }
        ],
        translation: 'I will clean the house.'
      }
    ]
  },
  {
    question: [
      {
        text: 'どうして'
      },
      {
        text: '日本語',
        rt: 'にほんご'
      },
      {
        text: 'を'
      },
      {
        text: '勉強',
        rt: 'べんきょう'
      },
      {
        text: 'しているんですか？'
      }
    ],
    translation: 'Why are you studying Japanese?',
    answers: [
      {
        segments: [
          {
            text: '日本',
            rt: 'にほん'
          },
          {
            text: 'の'
          },
          {
            text: 'アニメが'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きだからです。'
          }
        ],
        translation: 'Because I like Japanese anime.'
      },
      {
        segments: [
          {
            text: '日本',
            rt: 'にほん'
          },
          {
            text: 'で'
          },
          {
            text: '働',
            rt: 'はたら'
          },
          {
            text: 'きたいからです。'
          }
        ],
        translation: 'Because I want to work in Japan.'
      },
      {
        segments: [
          {
            text: '日本',
            rt: 'にほん'
          },
          {
            text: 'の'
          },
          {
            text: '方',
            rt: 'かた'
          },
          {
            text: 'と'
          },
          {
            text: '話',
            rt: 'はな'
          },
          {
            text: 'したいからです。'
          }
        ],
        translation: 'Because I want to talk to Japanese people.'
      }
    ]
  },
  {
    question: [
      {
        text: 'いつから'
      },
      {
        text: '日本',
        rt: 'にほん'
      },
      {
        text: 'に'
      },
      {
        text: '住',
        rt: 'す'
      },
      {
        text: 'んでいるんですか？'
      }
    ],
    translation: 'Since when have you been living in Japan?',
    answers: [
      {
        segments: [
          {
            text: '去年',
            rt: 'きょねん'
          },
          {
            text: 'から'
          },
          {
            text: '住',
            rt: 'す'
          },
          {
            text: 'んでいます. '
          }
        ],
        translation: "I've been living here since last year."
      },
      {
        segments: [
          {
            text: '3'
          },
          {
            text: '年',
            rt: 'ねん'
          },
          {
            text: 'くらい'
          },
          {
            text: '住',
            rt: 'す'
          },
          {
            text: 'んでいます. '
          }
        ],
        translation: "I've been living here for about three years."
      },
      {
        segments: [
          {
            text: '先月引',
            rt: 'せんげつひ'
          },
          {
            text: 'き'
          },
          {
            text: '越',
            rt: 'こ'
          },
          {
            text: 'してきたばかりです. '
          }
        ],
        translation: 'I just moved here last month.'
      }
    ]
  },
  {
    question: [
      {
        text: '日本',
        rt: 'にほん'
      },
      {
        text: 'の'
      },
      {
        text: '生活',
        rt: 'せいかつ'
      },
      {
        text: 'はどうですか？'
      }
    ],
    translation: 'How is life in Japan?',
    answers: [
      {
        segments: [
          {
            text: 'とても'
          },
          {
            text: '便利',
            rt: 'べんり'
          },
          {
            text: 'で'
          },
          {
            text: '楽',
            rt: 'たの'
          },
          {
            text: 'しいです。'
          }
        ],
        translation: "It's very convenient and fun."
      },
      {
        segments: [
          {
            text: '食',
            rt: 'た'
          },
          {
            text: 'べ'
          },
          {
            text: '物',
            rt: 'もの'
          },
          {
            text: 'が'
          },
          {
            text: '美味',
            rt: 'おい'
          },
          {
            text: 'しいので、'
          },
          {
            text: '幸',
            rt: 'しあわ'
          },
          {
            text: 'せです。'
          }
        ],
        translation: 'The food is delicious, so I am happy.'
      },
      {
        segments: [
          {
            text: '最初',
            rt: 'さいしょ'
          },
          {
            text: 'は'
          },
          {
            text: '少',
            rt: 'すこ'
          },
          {
            text: 'し'
          },
          {
            text: '大変',
            rt: 'たいへん'
          },
          {
            text: 'でしたが、'
          },
          {
            text: '慣',
            rt: 'な'
          },
          {
            text: 'れました。'
          }
        ],
        translation: 'It was a bit difficult at first, but I have gotten used to it.'
      }
    ]
  },
  {
    question: [
      {
        text: 'どこかおすすめの'
      },
      {
        text: '場所',
        rt: 'ばしょ'
      },
      {
        text: 'はありますか？'
      }
    ],
    translation: 'Do you have any recommended places?',
    answers: [
      {
        segments: [
          {
            text: '京都',
            rt: 'きょうと'
          },
          {
            text: 'がおすすめです。お'
          },
          {
            text: '寺',
            rt: 'てら'
          },
          {
            text: 'が'
          },
          {
            text: '綺麗',
            rt: 'きれい'
          },
          {
            text: 'ですよ。'
          }
        ],
        translation: 'I recommend Kyoto. The temples are beautiful.'
      },
      {
        segments: [
          {
            text: '横浜',
            rt: 'よこはま'
          },
          {
            text: 'の'
          },
          {
            text: '夜景',
            rt: 'やけい'
          },
          {
            text: 'がとても'
          },
          {
            text: '綺麗',
            rt: 'きれい'
          },
          {
            text: 'ですよ。'
          }
        ],
        translation: 'The night view in Yokohama is very beautiful.'
      },
      {
        segments: [
          {
            text: '自然',
            rt: 'しぜん'
          },
          {
            text: 'が'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きなら、'
          },
          {
            text: '北海道',
            rt: 'ほっかいどう'
          },
          {
            text: 'がおすすめです。'
          }
        ],
        translation: 'If you like nature, I recommend Hokkaido.'
      }
    ]
  },
  {
    question: [
      {
        text: '日本料理',
        rt: 'にほんりょうり'
      },
      {
        text: 'の'
      },
      {
        text: '中',
        rt: 'なか'
      },
      {
        text: 'で、'
      },
      {
        text: '何',
        rt: 'なに'
      },
      {
        text: 'が'
      },
      {
        text: '一番',
        rt: 'いちばん'
      },
      {
        text: '好',
        rt: 'す'
      },
      {
        text: 'きですか？'
      }
    ],
    translation: 'What is your favorite Japanese food?',
    answers: [
      {
        segments: [
          {
            text: '寿司',
            rt: 'すし'
          },
          {
            text: 'が'
          },
          {
            text: '一番',
            rt: 'いちばん'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like sushi the best.'
      },
      {
        segments: [
          {
            text: 'ラーメンが'
          },
          {
            text: '大好',
            rt: 'だいす'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I love ramen.'
      },
      {
        segments: [
          {
            text: '天',
            rt: 'てん'
          },
          {
            text: 'ぷらが'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like tempura.'
      }
    ]
  },
  {
    question: [
      {
        text: '誰',
        rt: 'だれ'
      },
      {
        text: 'と'
      },
      {
        text: '行',
        rt: 'い'
      },
      {
        text: 'ったんですか？'
      }
    ],
    translation: 'Who did you go with?',
    answers: [
      {
        segments: [
          {
            text: '家族',
            rt: 'かぞく'
          },
          {
            text: 'と'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'きました。'
          }
        ],
        translation: 'I went with my family.'
      },
      {
        segments: [
          {
            text: '会社',
            rt: 'かいしゃ'
          },
          {
            text: 'の'
          },
          {
            text: '友達',
            rt: 'ともだち'
          },
          {
            text: 'と'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'きました。'
          }
        ],
        translation: 'I went with a friend from work.'
      },
      {
        segments: [
          {
            text: '一人',
            rt: 'ひとり'
          },
          {
            text: 'で'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'きました。'
          }
        ],
        translation: 'I went by myself.'
      }
    ]
  },
  {
    question: [
      {
        text: '何',
        rt: 'なに'
      },
      {
        text: 'を'
      },
      {
        text: '食',
        rt: 'た'
      },
      {
        text: 'べたんですか？'
      }
    ],
    translation: 'What did you eat?',
    answers: [
      {
        segments: [
          {
            text: '美味',
            rt: 'おい'
          },
          {
            text: 'しい'
          },
          {
            text: '焼肉',
            rt: 'やきにく'
          },
          {
            text: 'を'
          },
          {
            text: '食',
            rt: 'た'
          },
          {
            text: 'べました。'
          }
        ],
        translation: 'I ate delicious yakiniku.'
      },
      {
        segments: [
          {
            text: '旬',
            rt: 'しゅん'
          },
          {
            text: 'の'
          },
          {
            text: '海鮮',
            rt: 'かいせん'
          },
          {
            text: 'を'
          },
          {
            text: '食',
            rt: 'た'
          },
          {
            text: 'べました。'
          }
        ],
        translation: 'I ate seasonal seafood.'
      },
      {
        segments: [
          {
            text: 'カフェで'
          },
          {
            text: '軽食',
            rt: 'けいしょく'
          },
          {
            text: 'を'
          },
          {
            text: '食',
            rt: 'た'
          },
          {
            text: 'べました。'
          }
        ],
        translation: 'I had some snacks at a cafe.'
      }
    ]
  },
  {
    question: [
      {
        text: 'どこにあるんですか？'
      }
    ],
    translation: 'Where is it?',
    answers: [
      {
        segments: [
          {
            text: '渋谷駅',
            rt: 'しぶやえき'
          },
          {
            text: 'の'
          },
          {
            text: '近',
            rt: 'ちか'
          },
          {
            text: 'くにあります。'
          }
        ],
        translation: "It's near Shibuya station."
      },
      {
        segments: [
          {
            text: '有名',
            rt: 'ゆうめい'
          },
          {
            text: 'なデパートの'
          },
          {
            text: '中',
            rt: 'なか'
          },
          {
            text: 'にあります。'
          }
        ],
        translation: "It's inside a famous department store."
      },
      {
        segments: [
          {
            text: 'ここから'
          },
          {
            text: '歩',
            rt: 'ある'
          },
          {
            text: 'いて10'
          },
          {
            text: '分',
            rt: 'ぷん'
          },
          {
            text: 'くらいの'
          },
          {
            text: '場所',
            rt: 'ばしょ'
          },
          {
            text: 'にあります。'
          }
        ],
        translation: "It's in a place about a 10-minute walk from here."
      }
    ]
  },
  {
    question: [
      {
        text: 'いつ'
      },
      {
        text: '行',
        rt: 'い'
      },
      {
        text: 'ったんですか？'
      }
    ],
    translation: 'When did you go?',
    answers: [
      {
        segments: [
          {
            text: '三日',
            rt: 'みっか'
          },
          {
            text: '位前',
            rt: 'くらいまえ'
          },
          {
            text: 'に'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'きました。'
          }
        ],
        translation: 'I went three days ago.'
      },
      {
        segments: [
          {
            text: '先週末',
            rt: 'せんしゅうまつ'
          },
          {
            text: 'に'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'きました。'
          }
        ],
        translation: 'I went last weekend.'
      },
      {
        segments: [
          {
            text: '夏休',
            rt: 'なつやす'
          },
          {
            text: 'みに'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'きました。'
          }
        ],
        translation: 'I went during the summer holidays.'
      }
    ]
  },
  {
    question: [
      {
        text: 'どうでしたか？'
      }
    ],
    translation: 'How was it?',
    answers: [
      {
        segments: [
          {
            text: 'とてもワクワクしました。'
          }
        ],
        translation: 'It was very exciting.'
      },
      {
        segments: [
          {
            text: '期待',
            rt: 'きたい'
          },
          {
            text: 'していた'
          },
          {
            text: '以上',
            rt: 'いじょう'
          },
          {
            text: 'に'
          },
          {
            text: '良',
            rt: 'よ'
          },
          {
            text: 'かったです。'
          }
        ],
        translation: 'It was better than I expected.'
      },
      {
        segments: [
          {
            text: '少',
            rt: 'すこ'
          },
          {
            text: 'し'
          },
          {
            text: '混',
            rt: 'こ'
          },
          {
            text: 'んでいましたが、'
          },
          {
            text: '楽',
            rt: 'たの'
          },
          {
            text: 'しかったです。'
          }
        ],
        translation: 'It was a bit crowded, but fun.'
      }
    ]
  },
  {
    question: [
      {
        text: '朝',
        rt: 'あさ'
      },
      {
        text: 'ごはんは'
      },
      {
        text: '何',
        rt: 'なに'
      },
      {
        text: 'を'
      },
      {
        text: '食',
        rt: 'た'
      },
      {
        text: 'べますか？'
      }
    ],
    translation: 'What do you eat for breakfast?',
    answers: [
      {
        segments: [
          {
            text: 'いつもパンとコーヒーを'
          },
          {
            text: '食',
            rt: 'た'
          },
          {
            text: 'べます。'
          }
        ],
        translation: 'I always eat bread and coffee.'
      },
      {
        segments: [
          {
            text: '白',
            rt: 'しろ'
          },
          {
            text: 'いご'
          },
          {
            text: '飯',
            rt: 'はん'
          },
          {
            text: 'と'
          },
          {
            text: '味噌汁',
            rt: 'みそしる'
          },
          {
            text: 'を'
          },
          {
            text: '食',
            rt: 'た'
          },
          {
            text: 'べます。'
          }
        ],
        translation: 'I eat white rice and miso soup.'
      },
      {
        segments: [
          {
            text: '忙',
            rt: 'いそが'
          },
          {
            text: 'しいので、いつも'
          },
          {
            text: '食',
            rt: 'た'
          },
          {
            text: 'べません。'
          }
        ],
        translation: "I'm busy, so I usually don't eat it."
      }
    ]
  },
  {
    question: [
      {
        text: '好',
        rt: 'す'
      },
      {
        text: 'きな'
      },
      {
        text: '飲',
        rt: 'の'
      },
      {
        text: 'み'
      },
      {
        text: '物',
        rt: 'もの'
      },
      {
        text: 'は'
      },
      {
        text: '何',
        rt: 'なに'
      },
      {
        text: 'ですか？'
      }
    ],
    translation: 'What is your favorite drink?',
    answers: [
      {
        segments: [
          {
            text: '冷',
            rt: 'つめ'
          },
          {
            text: 'たいお'
          },
          {
            text: '茶',
            rt: 'ちゃ'
          },
          {
            text: 'が'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like cold tea.'
      },
      {
        segments: [
          {
            text: '毎朝',
            rt: 'まいあさ'
          },
          {
            text: '、ブラックコーヒーを'
          },
          {
            text: '飲',
            rt: 'の'
          },
          {
            text: 'みます。'
          }
        ],
        translation: 'I drink black coffee every morning.'
      },
      {
        segments: [
          {
            text: 'ビールが'
          },
          {
            text: '一番好',
            rt: 'いちばんす'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like beer the best.'
      }
    ]
  },
  {
    question: [
      {
        text: 'どこに'
      },
      {
        text: '住',
        rt: 'す'
      },
      {
        text: 'んでいますか？'
      }
    ],
    translation: 'Where do you live?',
    answers: [
      {
        segments: [
          {
            text: '東京',
            rt: 'とうきょう'
          },
          {
            text: 'の'
          },
          {
            text: '新宿',
            rt: 'しんじゅく'
          },
          {
            text: 'に'
          },
          {
            text: '住',
            rt: 'す'
          },
          {
            text: 'んでいます。'
          }
        ],
        translation: 'I live in Shinjuku, Tokyo.'
      },
      {
        segments: [
          {
            text: '会社',
            rt: 'かいしゃ'
          },
          {
            text: 'の'
          },
          {
            text: '近',
            rt: 'ちか'
          },
          {
            text: 'くに'
          },
          {
            text: '住',
            rt: 'す'
          },
          {
            text: 'んでいます。'
          }
        ],
        translation: 'I live near my company.'
      },
      {
        segments: [
          {
            text: '静',
            rt: 'しず'
          },
          {
            text: 'かな'
          },
          {
            text: '住宅街',
            rt: 'じゅうたくがい'
          },
          {
            text: 'に'
          },
          {
            text: '住',
            rt: 'す'
          },
          {
            text: 'んでいます。'
          }
        ],
        translation: 'I live in a quiet residential area.'
      }
    ]
  },
  {
    question: [
      {
        text: '最近',
        rt: 'さいきん'
      },
      {
        text: '、'
      },
      {
        text: '仕事',
        rt: 'しごと'
      },
      {
        text: 'はどうですか？'
      }
    ],
    translation: 'How is work lately?',
    answers: [
      {
        segments: [
          {
            text: 'プロジェクトが'
          },
          {
            text: '始',
            rt: 'はじ'
          },
          {
            text: 'まったので、とても'
          },
          {
            text: '忙',
            rt: 'いそが'
          },
          {
            text: 'しいです。'
          }
        ],
        translation: 'A project has started, so I am very busy.'
      },
      {
        segments: [
          {
            text: '順調',
            rt: 'じゅんちょう'
          },
          {
            text: 'です。'
          },
          {
            text: '毎日楽',
            rt: 'まいにちたの'
          },
          {
            text: 'しいですよ。'
          }
        ],
        translation: "It's going well. Every day is fun."
      },
      {
        segments: [
          {
            text: 'ちょっと'
          },
          {
            text: '疲',
            rt: 'つか'
          },
          {
            text: 'れていますが、'
          },
          {
            text: '頑張',
            rt: 'がんば'
          },
          {
            text: 'っています。'
          }
        ],
        translation: "I'm a bit tired, but I'm doing my best."
      }
    ]
  },
  {
    question: [
      {
        text: '最近',
        rt: 'さいきん'
      },
      {
        text: '、どんなプレゼントをもらいましたか？'
      }
    ],
    translation: 'What kind of present did you receive recently?',
    answers: [
      {
        segments: [
          {
            text: '誕生',
            rt: 'たんじょう'
          },
          {
            text: 'びに'
          },
          {
            text: '腕時計',
            rt: 'うでどけい'
          },
          {
            text: 'をもらいました。'
          }
        ],
        translation: 'I received a wristwatch for my birthday.'
      },
      {
        segments: [
          {
            text: '友達',
            rt: 'ともだち'
          },
          {
            text: 'から'
          },
          {
            text: '旅行',
            rt: 'りょこう'
          },
          {
            text: 'のお'
          },
          {
            text: '土産',
            rt: 'みやげ'
          },
          {
            text: 'をもらいました。'
          }
        ],
        translation: 'I received a souvenir from a friend from their trip.'
      },
      {
        segments: [
          {
            text: '母',
            rt: 'はは'
          },
          {
            text: 'から'
          },
          {
            text: '手編',
            rt: 'てあ'
          },
          {
            text: 'みのセーターをもらいました。'
          }
        ],
        translation: 'I received a hand-knitted sweater from my mother.'
      }
    ]
  },
  {
    question: [
      {
        text: '毎日',
        rt: 'まいにち'
      },
      {
        text: '、'
      },
      {
        text: '野菜',
        rt: 'やさい'
      },
      {
        text: 'を'
      },
      {
        text: '食',
        rt: 'た'
      },
      {
        text: 'べますか？'
      }
    ],
    translation: 'Do you eat vegetables every day?',
    answers: [
      {
        segments: [
          {
            text: 'はい、'
          },
          {
            text: '健康',
            rt: 'けんこう'
          },
          {
            text: 'のために'
          },
          {
            text: '沢山食',
            rt: 'たくさんた'
          },
          {
            text: 'べるようにしています。'
          }
        ],
        translation: 'Yes, I try to eat a lot for my health.'
      },
      {
        segments: [
          {
            text: 'サラダを'
          },
          {
            text: '毎日',
            rt: 'まいにち'
          },
          {
            text: '作',
            rt: 'つく'
          },
          {
            text: 'って'
          },
          {
            text: '食',
            rt: 'た'
          },
          {
            text: 'べています。'
          }
        ],
        translation: 'I make and eat a salad every day.'
      },
      {
        segments: [
          {
            text: 'あまり'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きじゃないですが、'
          },
          {
            text: '少',
            rt: 'すこ'
          },
          {
            text: 'しずつ'
          },
          {
            text: '食',
            rt: 'た'
          },
          {
            text: 'べています。'
          }
        ],
        translation: "I don't like them much, but I eat them little by little."
      }
    ]
  },
  {
    question: [
      {
        text: '誰',
        rt: 'だれ'
      },
      {
        text: 'と'
      },
      {
        text: '住',
        rt: 'す'
      },
      {
        text: 'んでいますか？'
      }
    ],
    translation: 'Who do you live with?',
    answers: [
      {
        segments: [
          {
            text: '家族',
            rt: 'かぞく'
          },
          {
            text: 'と'
          },
          {
            text: '一緒',
            rt: 'いっしょ'
          },
          {
            text: 'に'
          },
          {
            text: '住',
            rt: 'す'
          },
          {
            text: 'んでいます。'
          }
        ],
        translation: 'I live with my family.'
      },
      {
        segments: [
          {
            text: '一人暮',
            rt: 'ひとりぐ'
          },
          {
            text: 'らしをしています。'
          }
        ],
        translation: 'I am living alone.'
      },
      {
        segments: [
          {
            text: '大学',
            rt: 'だいがく'
          },
          {
            text: 'の'
          },
          {
            text: '友達',
            rt: 'ともだち'
          },
          {
            text: 'とシェアハウスをしています。'
          }
        ],
        translation: 'I am in a share house with friends from university.'
      }
    ]
  },
  {
    question: [
      {
        text: '好',
        rt: 'す'
      },
      {
        text: 'きな'
      },
      {
        text: '食',
        rt: 'た'
      },
      {
        text: 'べ'
      },
      {
        text: '物',
        rt: 'もの'
      },
      {
        text: 'は'
      },
      {
        text: '何',
        rt: 'なに'
      },
      {
        text: 'ですか？'
      }
    ],
    translation: 'What is your favorite food?',
    answers: [
      {
        segments: [
          {
            text: 'イタリア'
          },
          {
            text: '料理',
            rt: 'りょうり'
          },
          {
            text: 'が'
          },
          {
            text: '一番好',
            rt: 'いちばんす'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like Italian food the best.'
      },
      {
        segments: [
          {
            text: 'ハンバーグが'
          },
          {
            text: '大好',
            rt: 'だいす'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I love hamburger steaks.'
      },
      {
        segments: [
          {
            text: '甘',
            rt: 'あま'
          },
          {
            text: 'いものが'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like sweet things.'
      }
    ]
  },
  {
    question: [
      {
        text: '毎日',
        rt: 'まいにち'
      },
      {
        text: '、'
      },
      {
        text: '何時',
        rt: 'なんじ'
      },
      {
        text: 'に'
      },
      {
        text: '寝',
        rt: 'ね'
      },
      {
        text: 'ますか？'
      }
    ],
    translation: 'What time do you go to bed every day?',
    answers: [
      {
        segments: [
          {
            text: 'だいたい'
          },
          {
            text: '夜',
            rt: 'よる'
          },
          {
            text: '11'
          },
          {
            text: '時',
            rt: 'じ'
          },
          {
            text: 'ごろに'
          },
          {
            text: '寝',
            rt: 'ね'
          },
          {
            text: 'ます。'
          }
        ],
        translation: 'I go to bed around 11 PM.'
      },
      {
        segments: [
          {
            text: '夜更',
            rt: 'よふ'
          },
          {
            text: 'かしをしてしまうので、1'
          },
          {
            text: '時',
            rt: 'じ'
          },
          {
            text: 'を'
          },
          {
            text: '過',
            rt: 'す'
          },
          {
            text: 'ぎることもあります。'
          }
        ],
        translation: 'I tend to stay up late, so sometimes it is past 1 AM.'
      },
      {
        segments: [
          {
            text: '朝早',
            rt: 'あさはや'
          },
          {
            text: 'いので、10'
          },
          {
            text: '時',
            rt: 'じ'
          },
          {
            text: 'には'
          },
          {
            text: '寝',
            rt: 'ね'
          },
          {
            text: 'るようにしています。'
          }
        ],
        translation: 'Since I have an early morning, I try to sleep by 10 PM.'
      }
    ]
  },
  {
    question: [
      {
        text: 'アニメを'
      },
      {
        text: '見',
        rt: 'み'
      },
      {
        text: 'ますか？'
      }
    ],
    translation: 'Do you watch anime?',
    answers: [
      {
        segments: [
          {
            text: 'はい、よく'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'ます。'
          },
          {
            text: '最近',
            rt: 'さいきん'
          },
          {
            text: 'は「SPY×FAMILY」に'
          },
          {
            text: '嵌',
            rt: 'は'
          },
          {
            text: 'まっています。'
          }
        ],
        translation: 'Yes, I watch it often. Recently I am hooked on "SPY×FAMILY".'
      },
      {
        segments: [
          {
            text: '子供',
            rt: 'こども'
          },
          {
            text: 'の'
          },
          {
            text: '頃',
            rt: 'ころ'
          },
          {
            text: 'はよく'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'ていましたが、'
          },
          {
            text: '最近',
            rt: 'さいきん'
          },
          {
            text: 'はあまり'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'ません。'
          }
        ],
        translation: 'I used to watch it a lot when I was a child, but I do not watch it much lately.'
      },
      {
        segments: [
          {
            text: '日本',
            rt: 'にほん'
          },
          {
            text: 'のアニメは'
          },
          {
            text: '世界中',
            rt: 'せかいじゅう'
          },
          {
            text: 'で'
          },
          {
            text: '人気',
            rt: 'にんき'
          },
          {
            text: 'ですね。'
          }
        ],
        translation: 'Japanese anime is popular all over the world, isn’t it?'
      }
    ]
  },
  {
    question: [
      {
        text: 'どのコンビニが'
      },
      {
        text: '好',
        rt: 'す'
      },
      {
        text: 'きですか？'
      }
    ],
    translation: 'Which convenience store do you like?',
    answers: [
      {
        segments: [
          {
            text: 'セブンイレブンが'
          },
          {
            text: '一番好',
            rt: 'いちばんす'
          },
          {
            text: 'きです。おにぎりが'
          },
          {
            text: '美味',
            rt: 'おい'
          },
          {
            text: 'しいですよ。'
          }
        ],
        translation: 'I like Seven-Eleven the best. Their rice balls are delicious.'
      },
      {
        segments: [
          {
            text: 'ローソンのスイーツが'
          },
          {
            text: '大好',
            rt: 'だいす'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I love Lawson’s sweets.'
      },
      {
        segments: [
          {
            text: '近',
            rt: 'ちか'
          },
          {
            text: 'くにファミリーマートがあるので、よく'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'きます。'
          }
        ],
        translation: 'There is a FamilyMart nearby, so I go there often.'
      }
    ]
  },
  {
    question: [
      {
        text: '沖縄',
        rt: 'おきなわ'
      },
      {
        text: 'に'
      },
      {
        text: '行',
        rt: 'い'
      },
      {
        text: 'きたいですか？'
      }
    ],
    translation: 'Do you want to go to Okinawa?',
    answers: [
      {
        segments: [
          {
            text: 'はい、'
          },
          {
            text: '綺麗',
            rt: 'きれい'
          },
          {
            text: 'な'
          },
          {
            text: '海',
            rt: 'うみ'
          },
          {
            text: 'で'
          },
          {
            text: '泳',
            rt: 'およ'
          },
          {
            text: 'いでみたいです。'
          }
        ],
        translation: 'Yes, I want to try swimming in the beautiful ocean.'
      },
      {
        segments: [
          {
            text: 'いつか'
          },
          {
            text: '冬',
            rt: 'ふゆ'
          },
          {
            text: 'の'
          },
          {
            text: '寒',
            rt: 'さむ'
          },
          {
            text: 'い'
          },
          {
            text: '時期',
            rt: 'じき'
          },
          {
            text: 'に'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'ってみたいです。'
          }
        ],
        translation: 'I want to go there sometime during the cold winter season.'
      },
      {
        segments: [
          {
            text: '一度行',
            rt: 'いちどい'
          },
          {
            text: 'ったことがありますが、また'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'きたいです。'
          }
        ],
        translation: 'I have been there once, but I want to go again.'
      }
    ]
  },
  {
    question: [
      {
        text: 'どんなスポーツが'
      },
      {
        text: '好',
        rt: 'す'
      },
      {
        text: 'きですか？'
      }
    ],
    translation: 'What kind of sports do you like?',
    answers: [
      {
        segments: [
          {
            text: 'サッカーを'
          },
          {
            text: '観',
            rt: 'み'
          },
          {
            text: 'るのが'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like watching soccer.'
      },
      {
        segments: [
          {
            text: 'テニスをするのが'
          },
          {
            text: '楽',
            rt: 'たの'
          },
          {
            text: 'しいです。'
          }
        ],
        translation: 'Playing tennis is fun.'
      },
      {
        segments: [
          {
            text: '冬',
            rt: 'ふゆ'
          },
          {
            text: 'はスキーに'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'くのが'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like going skiing in winter.'
      }
    ]
  },
  {
    question: [
      {
        text: '旅行',
        rt: 'りょこう'
      },
      {
        text: 'が'
      },
      {
        text: '好',
        rt: 'す'
      },
      {
        text: 'きですか？'
      }
    ],
    translation: 'Do you like traveling?',
    answers: [
      {
        segments: [
          {
            text: 'はい、'
          },
          {
            text: '新',
            rt: 'あたら'
          },
          {
            text: 'しい'
          },
          {
            text: '場所',
            rt: 'ばしょ'
          },
          {
            text: 'に'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'くのが'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'Yes, I like going to new places.'
      },
      {
        segments: [
          {
            text: '海外旅行',
            rt: 'かいがいりょこう'
          },
          {
            text: 'に'
          },
          {
            text: '興味',
            rt: 'きょうみ'
          },
          {
            text: 'があります。'
          }
        ],
        translation: 'I am interested in traveling abroad.'
      },
      {
        segments: [
          {
            text: '忙',
            rt: 'いそが'
          },
          {
            text: 'しくてあまり'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'けませんが、'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: "I'm busy and can't go often, but I like it."
      }
    ]
  },
  {
    question: [
      {
        text: '北海道',
        rt: 'ほっかいどう'
      },
      {
        text: 'に'
      },
      {
        text: '行',
        rt: 'い'
      },
      {
        text: 'ったことがありますか？'
      }
    ],
    translation: 'Have you ever been to Hokkaido?',
    answers: [
      {
        segments: [
          {
            text: 'はい、'
          },
          {
            text: '去年',
            rt: 'きょねん'
          },
          {
            text: 'の'
          },
          {
            text: '冬',
            rt: 'ふゆ'
          },
          {
            text: 'に'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'きました。'
          }
        ],
        translation: 'Yes, I went there last winter.'
      },
      {
        segments: [
          {
            text: 'いいえ、ありません。いつか'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'ってみたいです。'
          }
        ],
        translation: 'No, I haven’t. I want to go there someday.'
      },
      {
        segments: [
          {
            text: '出張',
            rt: 'しゅっちょう'
          },
          {
            text: 'で'
          },
          {
            text: '一度行',
            rt: 'いちどい'
          },
          {
            text: 'ったことがあります。'
          }
        ],
        translation: 'I went there once for a business trip.'
      }
    ]
  },
  {
    question: [
      {
        text: '好',
        rt: 'す'
      },
      {
        text: 'きなYouTuberは'
      },
      {
        text: '誰',
        rt: 'だれ'
      },
      {
        text: 'ですか？'
      }
    ],
    translation: 'Who is your favorite YouTuber?',
    answers: [
      {
        segments: [
          {
            text: '料理',
            rt: 'りょうり'
          },
          {
            text: 'のチャンネルをよく'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'ます。'
          }
        ],
        translation: 'I often watch cooking channels.'
      },
      {
        segments: [
          {
            text: 'ゲーム'
          },
          {
            text: '実況',
            rt: 'じっきょう'
          },
          {
            text: 'をしている人が'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like people who do game commentaries.'
      },
      {
        segments: [
          {
            text: '特',
            rt: 'とく'
          },
          {
            text: 'にいませんが、お'
          },
          {
            text: '笑',
            rt: 'わら'
          },
          {
            text: 'い系のビデオを'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'ます。'
          }
        ],
        translation: "I don't have a specific favorite, but I watch comedy videos."
      }
    ]
  },
  {
    question: [
      {
        text: '晴',
        rt: 'は'
      },
      {
        text: 'れの'
      },
      {
        text: '時',
        rt: 'とき'
      },
      {
        text: '、'
      },
      {
        text: '何',
        rt: 'なに'
      },
      {
        text: 'をしますか？'
      }
    ],
    translation: "What do you do when it's sunny?",
    answers: [
      {
        segments: [
          {
            text: '公園',
            rt: 'こうえん'
          },
          {
            text: 'で'
          },
          {
            text: '散歩',
            rt: 'さんぽ'
          },
          {
            text: 'をします。'
          }
        ],
        translation: 'I take a walk in the park.'
      },
      {
        segments: [
          {
            text: '洗濯物',
            rt: 'せんたくもの'
          },
          {
            text: 'をたくさん'
          },
          {
            text: '干',
            rt: 'ほ'
          },
          {
            text: 'します。'
          }
        ],
        translation: 'I hang out a lot of laundry.'
      },
      {
        segments: [
          {
            text: '外',
            rt: 'そと'
          },
          {
            text: 'でスポーツをするのが'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like doing sports outside.'
      }
    ]
  },
  {
    question: [
      {
        text: '英語',
        rt: 'えいご'
      },
      {
        text: 'を'
      },
      {
        text: '話',
        rt: 'はな'
      },
      {
        text: 'せますか？'
      }
    ],
    translation: 'Can you speak English?',
    answers: [
      {
        segments: [
          {
            text: 'はい、'
          },
          {
            text: '少',
            rt: 'すこ'
          },
          {
            text: 'しだけ'
          },
          {
            text: '話',
            rt: 'はな'
          },
          {
            text: 'せます。'
          }
        ],
        translation: 'Yes, I can speak it just a little.'
      },
      {
        segments: [
          {
            text: '日常会話',
            rt: 'にちじょうかいわ'
          },
          {
            text: 'なら'
          },
          {
            text: '問題',
            rt: 'もんだい'
          },
          {
            text: 'ありません。'
          }
        ],
        translation: 'If it is daily conversation, there is no problem.'
      },
      {
        segments: [
          {
            text: 'いいえ、まだ'
          },
          {
            text: '勉強中',
            rt: 'べんきょうちゅう'
          },
          {
            text: 'です。'
          }
        ],
        translation: 'No, I am still studying.'
      }
    ]
  },
  {
    question: [
      {
        text: '最近',
        rt: 'さいきん'
      },
      {
        text: '、'
      },
      {
        text: '休',
        rt: 'やす'
      },
      {
        text: 'みの'
      },
      {
        text: '日',
        rt: 'ひ'
      },
      {
        text: 'は'
      },
      {
        text: '何',
        rt: 'なに'
      },
      {
        text: 'をしていますか？'
      }
    ],
    translation: 'What have you been doing on your days off lately?',
    answers: [
      {
        segments: [
          {
            text: '家',
            rt: 'いえ'
          },
          {
            text: 'で映画を'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'ています。'
          }
        ],
        translation: 'I am watching movies at home.'
      },
      {
        segments: [
          {
            text: 'カフェで'
          },
          {
            text: '本',
            rt: 'ほん'
          },
          {
            text: 'を'
          },
          {
            text: '読',
            rt: 'よ'
          },
          {
            text: 'んでいます。'
          }
        ],
        translation: 'I am reading books at a cafe.'
      },
      {
        segments: [
          {
            text: '友達',
            rt: 'ともだち'
          },
          {
            text: 'とキャンプに'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'っています。'
          }
        ],
        translation: 'I am going camping with friends.'
      }
    ]
  },
  {
    question: [
      {
        text: '日本',
        rt: 'にほん'
      },
      {
        text: 'でラーメンを'
      },
      {
        text: '食',
        rt: 'た'
      },
      {
        text: 'べたことがありますか？'
      }
    ],
    translation: 'Have you ever eaten ramen in Japan?',
    answers: [
      {
        segments: [
          {
            text: 'はい、とんこつラーメンがとても'
          },
          {
            text: '美味',
            rt: 'おい'
          },
          {
            text: 'しかったです。'
          }
        ],
        translation: 'Yes, the tonkotsu ramen was very delicious.'
      },
      {
        segments: [
          {
            text: 'いいえ、まだありません。'
          },
          {
            text: '有名',
            rt: 'ゆうめい'
          },
          {
            text: 'な'
          },
          {
            text: '店',
            rt: 'みせ'
          },
          {
            text: 'に'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'ってみたいです。'
          }
        ],
        translation: 'No, not yet. I want to go to a famous shop.'
      },
      {
        segments: [
          {
            text: 'はい、'
          },
          {
            text: '昨日',
            rt: 'きのう'
          },
          {
            text: 'の'
          },
          {
            text: '昼',
            rt: 'ひる'
          },
          {
            text: 'ご'
          },
          {
            text: '飯',
            rt: 'はん'
          },
          {
            text: 'に'
          },
          {
            text: '食',
            rt: 'た'
          },
          {
            text: 'べました。'
          }
        ],
        translation: 'Yes, I ate it for lunch yesterday.'
      }
    ]
  },
  {
    question: [
      {
        text: '誕生日',
        rt: 'たんじょうび'
      },
      {
        text: 'はいつですか？'
      }
    ],
    translation: 'When is your birthday?',
    answers: [
      {
        segments: [
          {
            text: '私の'
          },
          {
            text: '誕生日',
            rt: 'たんじょうび'
          },
          {
            text: 'は5'
          },
          {
            text: '月',
            rt: 'がつ'
          },
          {
            text: '10'
          },
          {
            text: '日',
            rt: 'にち'
          },
          {
            text: 'です。'
          }
        ],
        translation: 'My birthday is May 10th.'
      },
      {
        segments: [
          {
            text: '来週',
            rt: 'らいしゅう'
          },
          {
            text: 'の'
          },
          {
            text: '金曜日',
            rt: 'きんようび'
          },
          {
            text: 'です。'
          }
        ],
        translation: "It's next Friday."
      },
      {
        segments: [
          {
            text: '冬',
            rt: 'ふゆ'
          },
          {
            text: 'の'
          },
          {
            text: '時期',
            rt: 'じき'
          },
          {
            text: 'です。'
          }
        ],
        translation: "It's during the winter season."
      }
    ]
  },
  {
    question: [
      {
        text: '辛',
        rt: 'から'
      },
      {
        text: 'い'
      },
      {
        text: '食',
        rt: 'た'
      },
      {
        text: 'べ'
      },
      {
        text: '物',
        rt: 'もの'
      },
      {
        text: 'が'
      },
      {
        text: '好',
        rt: 'す'
      },
      {
        text: 'きですか？'
      }
    ],
    translation: 'Do you like spicy food?',
    answers: [
      {
        segments: [
          {
            text: 'はい、'
          },
          {
            text: '辛',
            rt: 'から'
          },
          {
            text: 'いカレーが'
          },
          {
            text: '大好',
            rt: 'だいす'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'Yes, I love spicy curry.'
      },
      {
        segments: [
          {
            text: 'あまり'
          },
          {
            text: '得意',
            rt: 'とくい'
          },
          {
            text: 'ではありません。'
          }
        ],
        translation: "I'm not very good with it."
      },
      {
        segments: [
          {
            text: '少',
            rt: 'すこ'
          },
          {
            text: 'しだけなら'
          },
          {
            text: '大丈夫',
            rt: 'だいじょうぶ'
          },
          {
            text: 'です。'
          }
        ],
        translation: 'If it is just a little, I am fine.'
      }
    ]
  },
  {
    question: [
      {
        text: '犬',
        rt: 'いぬ'
      },
      {
        text: 'と'
      },
      {
        text: '猫',
        rt: 'ねこ'
      },
      {
        text: 'とうさぎ、どれが'
      },
      {
        text: '好',
        rt: 'す'
      },
      {
        text: 'きですか？'
      }
    ],
    translation: 'Which do you like: dogs, cats, or rabbits?',
    answers: [
      {
        segments: [
          {
            text: '犬',
            rt: 'いぬ'
          },
          {
            text: 'が'
          },
          {
            text: '一番好',
            rt: 'いちばんす'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like dogs the best.'
      },
      {
        segments: [
          {
            text: '猫',
            rt: 'ねこ'
          },
          {
            text: 'を'
          },
          {
            text: '飼',
            rt: 'か'
          },
          {
            text: 'っているので、'
          },
          {
            text: '猫',
            rt: 'ねこ'
          },
          {
            text: 'が'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I have a cat, so I like cats.'
      },
      {
        segments: [
          {
            text: 'うさぎが'
          },
          {
            text: '可愛',
            rt: 'かわい'
          },
          {
            text: 'いので'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like rabbits because they are cute.'
      }
    ]
  },
  {
    question: [
      {
        text: '毎日',
        rt: 'まいにち'
      },
      {
        text: '、'
      },
      {
        text: '何時',
        rt: 'なんじ'
      },
      {
        text: 'から'
      },
      {
        text: '何時',
        rt: 'なんじ'
      },
      {
        text: 'まで'
      },
      {
        text: '仕事',
        rt: 'しごと'
      },
      {
        text: 'しますか？'
      }
    ],
    translation: 'From what time to what time do you work every day?',
    answers: [
      {
        segments: [
          {
            text: '朝',
            rt: 'あさ'
          },
          {
            text: '9'
          },
          {
            text: '時',
            rt: 'じ'
          },
          {
            text: 'から'
          },
          {
            text: '夕方',
            rt: 'ゆうがた'
          },
          {
            text: '6'
          },
          {
            text: '時',
            rt: 'じ'
          },
          {
            text: 'までです。'
          }
        ],
        translation: 'From 9 AM to 6 PM.'
      },
      {
        segments: [
          {
            text: 'だいたい8'
          },
          {
            text: '時間',
            rt: 'じかん'
          },
          {
            text: 'くらい'
          },
          {
            text: '働',
            rt: 'はたら'
          },
          {
            text: 'いています。'
          }
        ],
        translation: 'I work for about 8 hours.'
      },
      {
        segments: [
          {
            text: '日',
            rt: 'ひ'
          },
          {
            text: 'によって'
          },
          {
            text: '違',
            rt: 'ちが'
          },
          {
            text: 'いますが、'
          },
          {
            text: '夜遅',
            rt: 'よるおそ'
          },
          {
            text: 'くなることもあります。'
          }
        ],
        translation: 'It depends on the day, but sometimes it gets late at night.'
      }
    ]
  },
  {
    question: [
      {
        text: '会社',
        rt: 'かいしゃ'
      },
      {
        text: 'に'
      },
      {
        text: '行',
        rt: 'い'
      },
      {
        text: 'く'
      },
      {
        text: '時',
        rt: 'とき'
      },
      {
        text: '、'
      },
      {
        text: '電車',
        rt: 'でんしゃ'
      },
      {
        text: 'に'
      },
      {
        text: '乗',
        rt: 'の'
      },
      {
        text: 'りますか？'
      }
    ],
    translation: 'Do you take the train when you go to work?',
    answers: [
      {
        segments: [
          {
            text: 'はい、'
          },
          {
            text: '満員電車',
            rt: 'まんいんでんしゃ'
          },
          {
            text: 'に'
          },
          {
            text: '乗',
            rt: 'の'
          },
          {
            text: 'っています。'
          }
        ],
        translation: 'Yes, I take a crowded train.'
      },
      {
        segments: [
          {
            text: 'いいえ、'
          },
          {
            text: '自転車',
            rt: 'じてんしゃ'
          },
          {
            text: 'で'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'っています。'
          }
        ],
        translation: 'No, I go by bicycle.'
      },
      {
        segments: [
          {
            text: '家',
            rt: 'いえ'
          },
          {
            text: 'から'
          },
          {
            text: '近',
            rt: 'ちか'
          },
          {
            text: 'いので、'
          },
          {
            text: '歩',
            rt: 'ある'
          },
          {
            text: 'いて'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'きます。'
          }
        ],
        translation: 'It is close to my house, so I go on foot.'
      }
    ]
  },
  {
    question: [
      {
        text: '好',
        rt: 'す'
      },
      {
        text: 'きな'
      },
      {
        text: '色',
        rt: 'いろ'
      },
      {
        text: 'は'
      },
      {
        text: '何',
        rt: 'なに'
      },
      {
        text: 'ですか？'
      }
    ],
    translation: 'What is your favorite color?',
    answers: [
      {
        segments: [
          {
            text: '青色',
            rt: 'あおいろ'
          },
          {
            text: 'が'
          },
          {
            text: '一番好',
            rt: 'いちばんす'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like blue the best.'
      },
      {
        segments: [
          {
            text: '明',
            rt: 'あか'
          },
          {
            text: 'るい'
          },
          {
            text: '黄色',
            rt: 'きいろ'
          },
          {
            text: 'が'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like bright yellow.'
      },
      {
        segments: [
          {
            text: '落ち着いた茶色',
            rt: 'おちついたちゃいろ'
          },
          {
            text: 'が'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like calm brown.'
      }
    ]
  },
  {
    question: [
      {
        text: '最近',
        rt: 'さいきん'
      },
      {
        text: '、'
      },
      {
        text: '何',
        rt: 'なに'
      },
      {
        text: 'が'
      },
      {
        text: '欲',
        rt: 'ほ'
      },
      {
        text: 'しいですか？'
      }
    ],
    translation: 'What do you want lately?',
    answers: [
      {
        segments: [
          {
            text: '新',
            rt: 'あたら'
          },
          {
            text: 'しいスマートフォンが'
          },
          {
            text: '欲',
            rt: 'ほ'
          },
          {
            text: 'しいです。'
          }
        ],
        translation: 'I want a new smartphone.'
      },
      {
        segments: [
          {
            text: 'ゆっくり'
          },
          {
            text: '休',
            rt: 'やす'
          },
          {
            text: 'む'
          },
          {
            text: '時間',
            rt: 'じかん'
          },
          {
            text: 'が'
          },
          {
            text: '欲',
            rt: 'ほ'
          },
          {
            text: 'しいです。'
          }
        ],
        translation: 'I want some time to rest slowly.'
      },
      {
        segments: [
          {
            text: '美味',
            rt: 'おい'
          },
          {
            text: 'しいお'
          },
          {
            text: '菓子',
            rt: 'かし'
          },
          {
            text: 'が'
          },
          {
            text: '食',
            rt: 'た'
          },
          {
            text: 'べたいです。'
          }
        ],
        translation: 'I want to eat some delicious sweets.'
      }
    ]
  },
  {
    question: [
      {
        text: '今日',
        rt: 'きょう'
      },
      {
        text: '、'
      },
      {
        text: '何時',
        rt: 'なんじ'
      },
      {
        text: 'に'
      },
      {
        text: '起',
        rt: 'お'
      },
      {
        text: 'きましたか？'
      }
    ],
    translation: 'What time did you wake up today?',
    answers: [
      {
        segments: [
          {
            text: '朝',
            rt: 'あさ'
          },
          {
            text: '7'
          },
          {
            text: '時',
            rt: 'じ'
          },
          {
            text: 'に'
          },
          {
            text: '起',
            rt: 'お'
          },
          {
            text: 'きました。'
          }
        ],
        translation: 'I woke up at 7 AM.'
      },
      {
        segments: [
          {
            text: '目覚',
            rt: 'めざ'
          },
          {
            text: 'まし'
          },
          {
            text: '時計',
            rt: 'どけい'
          },
          {
            text: 'を'
          },
          {
            text: '忘',
            rt: 'わす'
          },
          {
            text: 'れて、8'
          },
          {
            text: '時',
            rt: 'じ'
          },
          {
            text: 'に'
          },
          {
            text: '起',
            rt: 'お'
          },
          {
            text: 'きました。'
          }
        ],
        translation: 'I forgot my alarm clock and woke up at 8 AM.'
      },
      {
        segments: [
          {
            text: '仕事',
            rt: 'しごと'
          },
          {
            text: 'が'
          },
          {
            text: '休',
            rt: 'やす'
          },
          {
            text: 'みだったので、10'
          },
          {
            text: '時',
            rt: 'じ'
          },
          {
            text: 'まで'
          },
          {
            text: '寝',
            rt: 'ね'
          },
          {
            text: 'ていました。'
          }
        ],
        translation: 'Work was off, so I was sleeping until 10 AM.'
      }
    ]
  },
  {
    question: [
      {
        text: '日本語',
        rt: 'にほんご'
      },
      {
        text: 'をもっと'
      },
      {
        text: '上手',
        rt: 'じょうず'
      },
      {
        text: 'になりたいですか？'
      }
    ],
    translation: 'Do you want to become better at Japanese?',
    answers: [
      {
        segments: [
          {
            text: 'はい、'
          },
          {
            text: '日本',
            rt: 'にほん'
          },
          {
            text: 'の方とたくさん'
          },
          {
            text: '話',
            rt: 'はな'
          },
          {
            text: 'したいです。'
          }
        ],
        translation: 'Yes, I want to talk to Japanese people a lot.'
      },
      {
        segments: [
          {
            text: 'はい、'
          },
          {
            text: '字幕',
            rt: 'じまく'
          },
          {
            text: 'なしでアニメを'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'られるようになりたいです。'
          }
        ],
        translation: 'Yes, I want to be able to watch anime without subtitles.'
      },
      {
        segments: [
          {
            text: '毎日',
            rt: 'まいにち'
          },
          {
            text: '少しずつ'
          },
          {
            text: '練習',
            rt: 'れんしゅう'
          },
          {
            text: 'しています。'
          }
        ],
        translation: 'I am practicing a little every day.'
      }
    ]
  },
  {
    question: [
      {
        text: '今度',
        rt: 'こんど'
      },
      {
        text: '、'
      },
      {
        text: '一緒',
        rt: 'いっしょ'
      },
      {
        text: 'に'
      },
      {
        text: '寿司',
        rt: 'すし'
      },
      {
        text: 'を'
      },
      {
        text: '食',
        rt: 'た'
      },
      {
        text: 'べに'
      },
      {
        text: '行',
        rt: 'い'
      },
      {
        text: 'きませんか？'
      }
    ],
    translation: 'Would you like to go eat sushi together sometime?',
    answers: [
      {
        segments: [
          {
            text: 'はい、ぜひ！'
          },
          {
            text: '美味',
            rt: 'おい'
          },
          {
            text: 'しいお'
          },
          {
            text: '店',
            rt: 'みせ'
          },
          {
            text: 'を知っています。'
          }
        ],
        translation: 'Yes, I would love to! I know a delicious shop.'
      },
      {
        segments: [
          {
            text: 'いいですね。いつ'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'きましょうか？'
          }
        ],
        translation: 'That sounds good. When shall we go?'
      },
      {
        segments: [
          {
            text: '残念',
            rt: 'ざんねん'
          },
          {
            text: 'ながら、'
          },
          {
            text: '魚',
            rt: 'さかな'
          },
          {
            text: 'が'
          },
          {
            text: '苦手',
            rt: 'にがて'
          },
          {
            text: 'なんです。'
          }
        ],
        translation: 'Unfortunately, I am not good with fish.'
      }
    ]
  },
  {
    question: [
      {
        text: '料理',
        rt: 'りょうり'
      },
      {
        text: 'が'
      },
      {
        text: '好',
        rt: 'す'
      },
      {
        text: 'きですか？'
      }
    ],
    translation: 'Do you like cooking?',
    answers: [
      {
        segments: [
          {
            text: 'はい、'
          },
          {
            text: '週末',
            rt: 'しゅうまつ'
          },
          {
            text: 'によく'
          },
          {
            text: '作',
            rt: 'つく'
          },
          {
            text: 'ります。'
          }
        ],
        translation: 'Yes, I often make it on weekends.'
      },
      {
        segments: [
          {
            text: 'あまりしませんが、パスタを'
          },
          {
            text: '作',
            rt: 'つく'
          },
          {
            text: 'るのが'
          },
          {
            text: '得意',
            rt: 'とくい'
          },
          {
            text: 'です。'
          }
        ],
        translation: "I don't do it often, but I'm good at making pasta."
      },
      {
        segments: [
          {
            text: 'いいえ、いつも'
          },
          {
            text: '外食',
            rt: 'がいしょく'
          },
          {
            text: 'をしています。'
          }
        ],
        translation: 'No, I always eat out.'
      }
    ]
  },
  {
    question: [
      {
        text: 'アフリカに'
      },
      {
        text: '行',
        rt: 'い'
      },
      {
        text: 'ったことがありますか？'
      }
    ],
    translation: 'Have you ever been to Africa?',
    answers: [
      {
        segments: [
          {
            text: 'いいえ、ありませんが、サファリに'
          },
          {
            text: '興味',
            rt: 'きょうみ'
          },
          {
            text: 'があります。'
          }
        ],
        translation: 'No, I haven’t, but I am interested in safaris.'
      },
      {
        segments: [
          {
            text: 'はい、'
          },
          {
            text: '学生',
            rt: 'がくせい'
          },
          {
            text: 'の'
          },
          {
            text: '頃',
            rt: 'ころ'
          },
          {
            text: 'にエジプトに'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'きました。'
          }
        ],
        translation: 'Yes, I went to Egypt when I was a student.'
      },
      {
        segments: [
          {
            text: 'いつか'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'ってみたい'
          },
          {
            text: '国',
            rt: 'くに'
          },
          {
            text: 'がたくさんあります。'
          }
        ],
        translation: 'There are many countries I want to visit someday.'
      }
    ]
  },
  {
    question: [
      {
        text: '好',
        rt: 'す'
      },
      {
        text: 'きな'
      },
      {
        text: '季節',
        rt: 'きせつ'
      },
      {
        text: 'は'
      },
      {
        text: '何',
        rt: 'なに'
      },
      {
        text: 'ですか？'
      }
    ],
    translation: 'What is your favorite season?',
    answers: [
      {
        segments: [
          {
            text: '春',
            rt: 'はる'
          },
          {
            text: 'が'
          },
          {
            text: '一番好',
            rt: 'いちばんす'
          },
          {
            text: 'きです。'
          },
          {
            text: '桜',
            rt: 'さくら'
          },
          {
            text: 'が'
          },
          {
            text: '綺麗',
            rt: 'きれい'
          },
          {
            text: 'ですから。'
          }
        ],
        translation: 'I like spring the best because the cherry blossoms are beautiful.'
      },
      {
        segments: [
          {
            text: '夏',
            rt: 'なつ'
          },
          {
            text: 'の'
          },
          {
            text: '海',
            rt: 'うみ'
          },
          {
            text: 'が'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like the ocean in summer.'
      },
      {
        segments: [
          {
            text: '秋',
            rt: 'あき'
          },
          {
            text: 'の'
          },
          {
            text: '紅葉',
            rt: 'こうよう'
          },
          {
            text: 'がとても'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like the autumn leaves very much.'
      }
    ]
  },
  {
    question: [
      {
        text: 'どんなYouTubeを'
      },
      {
        text: '見',
        rt: 'み'
      },
      {
        text: 'ますか？'
      }
    ],
    translation: 'What kind of YouTube do you watch?',
    answers: [
      {
        segments: [
          {
            text: '主',
            rt: 'おも'
          },
          {
            text: 'に'
          },
          {
            text: '語学',
            rt: 'ごがく'
          },
          {
            text: '学習',
            rt: 'がくしゅう'
          },
          {
            text: 'のビデオを'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'ています。'
          }
        ],
        translation: 'I mainly watch language learning videos.'
      },
      {
        segments: [
          {
            text: '面白',
            rt: 'おもしろ'
          },
          {
            text: 'いコントやコメディを'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'ます。'
          }
        ],
        translation: 'I watch funny sketches and comedy.'
      },
      {
        segments: [
          {
            text: 'Vlogを'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'て'
          },
          {
            text: '旅',
            rt: 'たび'
          },
          {
            text: 'をした気分になります。'
          }
        ],
        translation: 'I watch Vlogs and feel like I am traveling.'
      }
    ]
  },
  {
    question: [
      {
        text: '北海道',
        rt: 'ほっかいどう'
      },
      {
        text: 'は'
      },
      {
        text: '東京',
        rt: 'とうきょう'
      },
      {
        text: 'より'
      },
      {
        text: '寒',
        rt: 'さむ'
      },
      {
        text: 'いですか？'
      }
    ],
    translation: 'Is Hokkaido colder than Tokyo?',
    answers: [
      {
        segments: [
          {
            text: 'はい、'
          },
          {
            text: '冬',
            rt: 'ふゆ'
          },
          {
            text: 'はとても'
          },
          {
            text: '寒',
            rt: 'さむ'
          },
          {
            text: 'くて、'
          },
          {
            text: '雪',
            rt: 'ゆき'
          },
          {
            text: 'がたくさん'
          },
          {
            text: '降',
            rt: 'ふ'
          },
          {
            text: 'ります。'
          }
        ],
        translation: 'Yes, it is very cold in winter and it snows a lot.'
      },
      {
        segments: [
          {
            text: 'そうですね。'
          },
          {
            text: '気温',
            rt: 'きおん'
          },
          {
            text: 'がかなり'
          },
          {
            text: '低',
            rt: 'ひく'
          },
          {
            text: 'いです。'
          }
        ],
        translation: 'That is right. The temperature is quite low.'
      },
      {
        segments: [
          {
            text: '夏',
            rt: 'なつ'
          },
          {
            text: 'は'
          },
          {
            text: '東京',
            rt: 'とうきょう'
          },
          {
            text: 'より'
          },
          {
            text: '涼',
            rt: 'すず'
          },
          {
            text: 'しくて'
          },
          {
            text: '過',
            rt: 'す'
          },
          {
            text: 'ごしやすいですよ。'
          }
        ],
        translation: 'In summer, it is cooler and more comfortable than Tokyo.'
      }
    ]
  },
  {
    question: [
      {
        text: '日本',
        rt: 'にほん'
      },
      {
        text: 'で'
      },
      {
        text: '桜',
        rt: 'さくら'
      },
      {
        text: 'を'
      },
      {
        text: '見',
        rt: 'み'
      },
      {
        text: 'たことがありますか？'
      }
    ],
    translation: 'Have you ever seen cherry blossoms in Japan?',
    answers: [
      {
        segments: [
          {
            text: 'はい、'
          },
          {
            text: '去年',
            rt: 'きょねん'
          },
          {
            text: 'の上野公園で'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'ました。'
          }
        ],
        translation: 'Yes, I saw them at Ueno Park last year.'
      },
      {
        segments: [
          {
            text: 'いいえ、まだありません。'
          },
          {
            text: '来年',
            rt: 'らいねん'
          },
          {
            text: 'こそ'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'たいです。'
          }
        ],
        translation: 'No, not yet. I definitely want to see them next year.'
      },
      {
        segments: [
          {
            text: 'お'
          },
          {
            text: '花見',
            rt: 'はなみ'
          },
          {
            text: 'をしながらお'
          },
          {
            text: '弁当',
            rt: 'べんとう'
          },
          {
            text: 'を'
          },
          {
            text: '食',
            rt: 'た'
          },
          {
            text: 'べました。'
          }
        ],
        translation: 'I ate a bento while viewing the flowers.'
      }
    ]
  },
  {
    question: [
      {
        text: '出身',
        rt: 'しゅっしん'
      },
      {
        text: 'はどこですか？'
      }
    ],
    translation: 'Where are you from?',
    answers: [
      {
        segments: [
          {
            text: 'アメリカのカリフォルニア'
          },
          {
            text: '出身',
            rt: 'しゅっしん'
          },
          {
            text: 'です。'
          }
        ],
        translation: 'I am from California, USA.'
      },
      {
        segments: [
          {
            text: 'フランスのパリから'
          },
          {
            text: '来',
            rt: 'き'
          },
          {
            text: 'ました。'
          }
        ],
        translation: 'I came from Paris, France.'
      },
      {
        segments: [
          {
            text: '地元',
            rt: 'じもと'
          },
          {
            text: 'はとても'
          },
          {
            text: '田舎',
            rt: 'いなか'
          },
          {
            text: 'な'
          },
          {
            text: '場所',
            rt: 'ばしょ'
          },
          {
            text: 'です。'
          }
        ],
        translation: 'My hometown is a very rural place.'
      }
    ]
  },
  {
    question: [
      {
        text: '明日',
        rt: 'あした'
      },
      {
        text: '、'
      },
      {
        text: '何',
        rt: 'なに'
      },
      {
        text: 'をしますか？'
      }
    ],
    translation: 'What will you do tomorrow?',
    answers: [
      {
        segments: [
          {
            text: '明日',
            rt: 'あした'
          },
          {
            text: 'は'
          },
          {
            text: '友達',
            rt: 'ともだち'
          },
          {
            text: 'と'
          },
          {
            text: '映画',
            rt: 'えいが'
          },
          {
            text: 'を'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'に'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'きます。'
          }
        ],
        translation: 'Tomorrow I will go to see a movie with a friend.'
      },
      {
        segments: [
          {
            text: '家',
            rt: 'いえ'
          },
          {
            text: 'でゆっくり'
          },
          {
            text: '掃除',
            rt: 'そうじ'
          },
          {
            text: 'をする'
          },
          {
            text: '予定',
            rt: 'よてい'
          },
          {
            text: 'です。'
          }
        ],
        translation: 'I plan to clean the house slowly.'
      },
      {
        segments: [
          {
            text: '仕事',
            rt: 'しごと'
          },
          {
            text: 'があるので、'
          },
          {
            text: '早',
            rt: 'はや'
          },
          {
            text: 'く'
          },
          {
            text: '起',
            rt: 'お'
          },
          {
            text: 'きます。'
          }
        ],
        translation: 'I have work, so I will wake up early.'
      }
    ]
  },
  {
    question: [
      {
        text: '雪',
        rt: 'ゆき'
      },
      {
        text: 'が'
      },
      {
        text: '好',
        rt: 'す'
      },
      {
        text: 'きですか？'
      }
    ],
    translation: 'Do you like snow?',
    answers: [
      {
        segments: [
          {
            text: 'はい、'
          },
          {
            text: '景色',
            rt: 'けしき'
          },
          {
            text: 'が'
          },
          {
            text: '綺麗',
            rt: 'きれい'
          },
          {
            text: 'になるので'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'Yes, I like it because the scenery becomes beautiful.'
      },
      {
        segments: [
          {
            text: '寒',
            rt: 'さむ'
          },
          {
            text: 'いのが'
          },
          {
            text: '苦手',
            rt: 'にがて'
          },
          {
            text: 'なので、あまり'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きではありません。'
          }
        ],
        translation: "I'm not good with the cold, so I don't like it much."
      },
      {
        segments: [
          {
            text: 'スキーができるので'
          },
          {
            text: '嬉',
            rt: 'うれ'
          },
          {
            text: 'しいです。'
          }
        ],
        translation: 'I am happy because I can ski.'
      }
    ]
  },
  {
    question: [
      {
        text: '日本',
        rt: 'にほん'
      },
      {
        text: 'のカレーライスを'
      },
      {
        text: '食',
        rt: 'た'
      },
      {
        text: 'べたことがありますか？'
      }
    ],
    translation: 'Have you ever eaten Japanese curry rice?',
    answers: [
      {
        segments: [
          {
            text: 'はい、とても'
          },
          {
            text: '美味',
            rt: 'おい'
          },
          {
            text: 'しくて'
          },
          {
            text: '大好',
            rt: 'だいす'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'Yes, it is very delicious and I love it.'
      },
      {
        segments: [
          {
            text: 'いいえ、まだありません。食べてみたいです。'
          }
        ],
        translation: 'No, not yet. I want to try it.'
      },
      {
        segments: [
          {
            text: '家庭的',
            rt: 'かていてき'
          },
          {
            text: 'な'
          },
          {
            text: '味',
            rt: 'あじ'
          },
          {
            text: 'で'
          },
          {
            text: '良',
            rt: 'よ'
          },
          {
            text: 'かったです。'
          }
        ],
        translation: 'It was good with a home-style taste.'
      }
    ]
  },
  {
    question: [
      {
        text: '毎日',
        rt: 'まいにち'
      },
      {
        text: '、'
      },
      {
        text: '散歩',
        rt: 'さんぽ'
      },
      {
        text: 'しますか？'
      }
    ],
    translation: 'Do you go for a walk every day?',
    answers: [
      {
        segments: [
          {
            text: 'はい、'
          },
          {
            text: '夕方',
            rt: 'ゆうがた'
          },
          {
            text: 'に'
          },
          {
            text: '近',
            rt: 'ちか'
          },
          {
            text: 'くを'
          },
          {
            text: '歩',
            rt: 'ある'
          },
          {
            text: 'いています。'
          }
        ],
        translation: 'Yes, I walk nearby in the evening.'
      },
      {
        segments: [
          {
            text: '忙',
            rt: 'いそが'
          },
          {
            text: 'しいときはできませんが、なるべくするようにしています。'
          }
        ],
        translation: "I can't do it when I'm busy, but I try to as much as possible."
      },
      {
        segments: [
          {
            text: 'いいえ、あまりしません。'
          }
        ],
        translation: "No, I don't do it much."
      }
    ]
  },
  {
    question: [
      {
        text: '海',
        rt: 'うみ'
      },
      {
        text: 'と'
      },
      {
        text: '山',
        rt: 'やま'
      },
      {
        text: '、どっちが'
      },
      {
        text: '好',
        rt: 'す'
      },
      {
        text: 'きですか？'
      }
    ],
    translation: 'The ocean or the mountains, which do you prefer?',
    answers: [
      {
        segments: [
          {
            text: '海',
            rt: 'うみ'
          },
          {
            text: 'で'
          },
          {
            text: '泳',
            rt: 'およ'
          },
          {
            text: 'ぐのが'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きなので、'
          },
          {
            text: '海',
            rt: 'うみ'
          },
          {
            text: 'です。'
          }
        ],
        translation: 'I like swimming in the ocean, so it is the ocean.'
      },
      {
        segments: [
          {
            text: '静',
            rt: 'しず'
          },
          {
            text: 'かな'
          },
          {
            text: '山',
            rt: 'やま'
          },
          {
            text: 'のほうが'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like the quiet mountains better.'
      },
      {
        segments: [
          {
            text: 'どちらも'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きなので'
          },
          {
            text: '選',
            rt: 'えら'
          },
          {
            text: 'べません。'
          }
        ],
        translation: 'I like both, so I cannot choose.'
      }
    ]
  },
  {
    question: [
      {
        text: 'クリスマスに'
      },
      {
        text: '何',
        rt: 'なに'
      },
      {
        text: 'をしますか？'
      }
    ],
    translation: 'What do you do on Christmas?',
    answers: [
      {
        segments: [
          {
            text: '家族',
            rt: 'かぞく'
          },
          {
            text: 'と'
          },
          {
            text: '一緒',
            rt: 'いっしょ'
          },
          {
            text: 'にパーティーをします。'
          }
        ],
        translation: 'I have a party with my family.'
      },
      {
        segments: [
          {
            text: '友達',
            rt: 'ともだち'
          },
          {
            text: 'とプレゼント'
          },
          {
            text: '交換',
            rt: 'こうかん'
          },
          {
            text: 'をします。'
          }
        ],
        translation: 'I exchange presents with friends.'
      },
      {
        segments: [
          {
            text: '家',
            rt: 'いえ'
          },
          {
            text: 'でケーキを'
          },
          {
            text: '食',
            rt: 'た'
          },
          {
            text: 'べます。'
          }
        ],
        translation: 'I eat cake at home.'
      }
    ]
  },
  {
    question: [
      {
        text: '子供',
        rt: 'こども'
      },
      {
        text: 'の'
      },
      {
        text: '頃',
        rt: 'ころ'
      },
      {
        text: '、'
      },
      {
        text: '何',
        rt: 'なに'
      },
      {
        text: 'になりたかったですか？'
      }
    ],
    translation: 'What did you want to be when you were a child?',
    answers: [
      {
        segments: [
          {
            text: 'パイロットになりたかったです。'
          }
        ],
        translation: 'I wanted to be a pilot.'
      },
      {
        segments: [
          {
            text: 'お'
          },
          {
            text: '花屋',
            rt: 'はなや'
          },
          {
            text: 'さんになりたいと'
          },
          {
            text: '思',
            rt: 'おも'
          },
          {
            text: 'っていました。'
          }
        ],
        translation: 'I thought I wanted to be a florist.'
      },
      {
        segments: [
          {
            text: 'サッカー'
          },
          {
            text: '選手',
            rt: 'せんしゅ'
          },
          {
            text: 'になるのが'
          },
          {
            text: '夢',
            rt: 'ゆめ'
          },
          {
            text: 'でした。'
          }
        ],
        translation: 'Being a soccer player was my dream.'
      }
    ]
  },
  {
    question: [
      {
        text: '漢字',
        rt: 'かんじ'
      },
      {
        text: '、'
      },
      {
        text: '分',
        rt: 'わ'
      },
      {
        text: 'かりますか？'
      }
    ],
    translation: 'Do you understand Kanji?',
    answers: [
      {
        segments: [
          {
            text: 'はい、'
          },
          {
            text: '少',
            rt: 'すこ'
          },
          {
            text: 'しずつ'
          },
          {
            text: '覚',
            rt: 'おぼ'
          },
          {
            text: 'えています。'
          }
        ],
        translation: 'Yes, I am remembering them little by little.'
      },
      {
        segments: [
          {
            text: '読',
            rt: 'よ'
          },
          {
            text: 'むのは'
          },
          {
            text: '大丈夫',
            rt: 'だいじょうぶ'
          },
          {
            text: 'ですが、'
          },
          {
            text: '書',
            rt: 'か'
          },
          {
            text: 'くのは'
          },
          {
            text: '難',
            rt: 'むずか'
          },
          {
            text: 'しいです。'
          }
        ],
        translation: 'Reading is fine, but writing is difficult.'
      },
      {
        segments: [
          {
            text: '難',
            rt: 'むずか'
          },
          {
            text: 'しいですが、'
          },
          {
            text: '面白',
            rt: 'おもしろ'
          },
          {
            text: 'いと'
          },
          {
            text: '思',
            rt: 'おも'
          },
          {
            text: 'います。'
          }
        ],
        translation: 'It is difficult, but I think it is interesting.'
      }
    ]
  },
  {
    question: [
      {
        text: '一番好',
        rt: 'いちばんす'
      },
      {
        text: 'きな'
      },
      {
        text: '日本語',
        rt: 'にほんご'
      },
      {
        text: 'の'
      },
      {
        text: '言葉',
        rt: 'ことば'
      },
      {
        text: 'は'
      },
      {
        text: '何',
        rt: 'なに'
      },
      {
        text: 'ですか？'
      }
    ],
    translation: 'What is your favorite Japanese word?',
    answers: [
      {
        segments: [
          {
            text: '「ありがとう」という'
          },
          {
            text: '言葉',
            rt: 'ことば'
          },
          {
            text: 'が'
          },
          {
            text: '一番好',
            rt: 'いちばんす'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like the word "Arigato" the best.'
      },
      {
        segments: [
          {
            text: '「'
          },
          {
            text: '木漏',
            rt: 'こも'
          },
          {
            text: 'れ'
          },
          {
            text: '日',
            rt: 'び'
          },
          {
            text: '」という'
          },
          {
            text: '表現',
            rt: 'ひょうげん'
          },
          {
            text: 'が'
          },
          {
            text: '綺麗',
            rt: 'きれい'
          },
          {
            text: 'だと'
          },
          {
            text: '思',
            rt: 'おも'
          },
          {
            text: 'います。'
          }
        ],
        translation: 'I think the expression "Komorebi" is beautiful.'
      },
      {
        segments: [
          {
            text: '「'
          },
          {
            text: '一生懸命',
            rt: 'いっしょうけんめい'
          },
          {
            text: '」という'
          },
          {
            text: '言葉',
            rt: 'ことば'
          },
          {
            text: 'が'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like the word "Isshoukenmei".'
      }
    ]
  },
  {
    question: [
      {
        text: '今'
      },
      {
        text: 'までに、どんな'
      },
      {
        text: '仕事',
        rt: 'しごと'
      },
      {
        text: 'をしましたか？'
      }
    ],
    translation: 'What kind of jobs have you done until now?',
    answers: [
      {
        segments: [
          {
            text: 'エンジニアとして'
          },
          {
            text: '働',
            rt: 'はたら'
          },
          {
            text: 'いていました。'
          }
        ],
        translation: 'I was working as an engineer.'
      },
      {
        segments: [
          {
            text: '英語',
            rt: 'えいご'
          },
          {
            text: 'を'
          },
          {
            text: '教',
            rt: 'おし'
          },
          {
            text: 'えていたことがあります。'
          }
        ],
        translation: 'I have taught English before.'
      },
      {
        segments: [
          {
            text: 'カフェでアルバイトをしてい'
          },
          {
            text: '時',
            rt: 'とき'
          },
          {
            text: 'もありました。'
          }
        ],
        translation: 'There was also a time when I was working part-time at a cafe.'
      }
    ]
  },
  {
    question: [
      {
        text: 'スキーに'
      },
      {
        text: '興味',
        rt: 'きょうみ'
      },
      {
        text: 'がありますか？'
      }
    ],
    translation: 'Are you interested in skiing?',
    answers: [
      {
        segments: [
          {
            text: 'はい、いつかやってみたいと'
          },
          {
            text: '思',
            rt: 'おも'
          },
          {
            text: 'っています。'
          }
        ],
        translation: 'Yes, I am thinking I want to try it someday.'
      },
      {
        segments: [
          {
            text: 'はい、'
          },
          {
            text: '毎年冬',
            rt: 'まいとしふゆ'
          },
          {
            text: 'に'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'っています。'
          }
        ],
        translation: 'Yes, I go every winter.'
      },
      {
        segments: [
          {
            text: 'いいえ、'
          },
          {
            text: '寒',
            rt: 'さむ'
          },
          {
            text: 'いのが'
          },
          {
            text: '苦手',
            rt: 'にがて'
          },
          {
            text: 'なのであまりありません。'
          }
        ],
        translation: "No, I don't have much interest because I'm not good with the cold."
      }
    ]
  },
  {
    question: [
      {
        text: '明日',
        rt: 'あした'
      },
      {
        text: '、'
      },
      {
        text: '一緒',
        rt: 'いっしょ'
      },
      {
        text: 'に'
      },
      {
        text: '映画',
        rt: 'えいが'
      },
      {
        text: 'を'
      },
      {
        text: '見',
        rt: 'み'
      },
      {
        text: 'ませんか？'
      }
    ],
    translation: 'Would you like to watch a movie together tomorrow?',
    answers: [
      {
        segments: [
          {
            text: 'はい、ぜひ！'
          },
          {
            text: '何',
            rt: 'なに'
          },
          {
            text: 'を'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'ましょうか？'
          }
        ],
        translation: 'Yes, definitely! What shall we watch?'
      },
      {
        segments: [
          {
            text: '明日',
            rt: 'あした'
          },
          {
            text: 'は'
          },
          {
            text: '都合',
            rt: 'つごう'
          },
          {
            text: 'が'
          },
          {
            text: '悪',
            rt: 'わる'
          },
          {
            text: 'いので、また'
          },
          {
            text: '今度行',
            rt: 'こんどい'
          },
          {
            text: 'きましょう。'
          }
        ],
        translation: 'Tomorrow is inconvenient, so let’s go another time.'
      },
      {
        segments: [
          {
            text: 'いいですね。'
          },
          {
            text: '何時',
            rt: 'なんじ'
          },
          {
            text: 'に'
          },
          {
            text: '待',
            rt: 'ま'
          },
          {
            text: 'ち'
          },
          {
            text: '合',
            rt: 'あ'
          },
          {
            text: 'わせしますか？'
          }
        ],
        translation: 'That sounds good. What time shall we meet?'
      }
    ]
  },
  {
    question: [
      {
        text: '日本',
        rt: 'にほん'
      },
      {
        text: 'に'
      },
      {
        text: '住',
        rt: 'す'
      },
      {
        text: 'みたいですか？'
      }
    ],
    translation: 'Do you want to live in Japan?',
    answers: [
      {
        segments: [
          {
            text: 'はい、いつか'
          },
          {
            text: '長',
            rt: 'なが'
          },
          {
            text: 'い'
          },
          {
            text: '間住',
            rt: 'あいだす'
          },
          {
            text: 'んでみたいです。'
          }
        ],
        translation: 'Yes, I want to try living there for a long time someday.'
      },
      {
        segments: [
          {
            text: '今住',
            rt: 'います'
          },
          {
            text: 'んでいますが、とても'
          },
          {
            text: '満足',
            rt: 'まんぞく'
          },
          {
            text: 'しています。'
          }
        ],
        translation: 'I am living there now and I am very satisfied.'
      },
      {
        segments: [
          {
            text: '旅行',
            rt: 'りょこう'
          },
          {
            text: 'で'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'くのが'
          },
          {
            text: '一番好',
            rt: 'いちばんす'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like going there for travel the best.'
      }
    ]
  }
]
