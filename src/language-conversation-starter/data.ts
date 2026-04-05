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
        text: '日本',
        rt: 'にほん'
      },
      {
        text: 'に'
      },
      {
        text: '興味',
        rt: 'きょうみ'
      },
      {
        text: 'を'
      },
      {
        text: '持',
        rt: 'も'
      },
      {
        text: 'ったきっかけは'
      },
      {
        text: '何',
        rt: 'なに'
      },
      {
        text: 'ですか？'
      }
    ],
    translation: 'What was the reason you first became interested in Japan?',
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
            text: 'アニメを'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'て、'
          },
          {
            text: '言葉',
            rt: 'ことば'
          },
          {
            text: 'や'
          },
          {
            text: '文化',
            rt: 'ぶんか'
          },
          {
            text: 'に'
          },
          {
            text: '興味',
            rt: 'きょうみ'
          },
          {
            text: 'を'
          },
          {
            text: '持',
            rt: 'も'
          },
          {
            text: 'ちました。'
          }
        ],
        translation: 'I became interested in the language and culture after watching Japanese anime.'
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
            text: '日本',
            rt: 'にほん'
          },
          {
            text: 'を'
          },
          {
            text: '訪',
            rt: 'おとず'
          },
          {
            text: 'れた'
          },
          {
            text: '時',
            rt: 'とき'
          },
          {
            text: 'に、'
          },
          {
            text: '人',
            rt: 'ひと'
          },
          {
            text: 'がとても'
          },
          {
            text: '親切',
            rt: 'しんせつ'
          },
          {
            text: 'だったので'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きになりました。'
          }
        ],
        translation: 'I liked Japan because people were very kind when I visited as a tourist.'
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
            text: '歴史',
            rt: 'れきし'
          },
          {
            text: 'や'
          },
          {
            text: '伝統的',
            rt: 'でんとうてき'
          },
          {
            text: 'な'
          },
          {
            text: '建物',
            rt: 'たてもの'
          },
          {
            text: 'が'
          },
          {
            text: '美',
            rt: 'うつく'
          },
          {
            text: 'しくて、もっと'
          },
          {
            text: '知',
            rt: 'し'
          },
          {
            text: 'りたくなりました。'
          }
        ],
        translation: 'I wanted to know more because Japanese history and traditional buildings are beautiful.'
      }
    ]
  },
  {
    question: [
      {
        text: 'どんなお'
      },
      {
        text: '仕事',
        rt: 'しごと'
      },
      {
        text: 'をされていますか？その'
      },
      {
        text: '仕事',
        rt: 'しごと'
      },
      {
        text: 'のどんなところが'
      },
      {
        text: '好',
        rt: 'す'
      },
      {
        text: 'きですか？'
      }
    ],
    translation: 'What kind of work do you do, and what do you like about it?',
    answers: [
      {
        segments: [
          {
            text: 'ソフトウェアエンジニアをしています。'
          },
          {
            text: '新',
            rt: 'あたら'
          },
          {
            text: 'しいものを'
          },
          {
            text: '作',
            rt: 'つく'
          },
          {
            text: 'るのが'
          },
          {
            text: '楽',
            rt: 'たの'
          },
          {
            text: 'しいです。'
          }
        ],
        translation: 'I am a software engineer. I enjoy creating new things.'
      },
      {
        segments: [
          {
            text: '先生',
            rt: 'せんせい'
          },
          {
            text: 'をしています。'
          },
          {
            text: '学生',
            rt: 'がくせい'
          },
          {
            text: 'が'
          },
          {
            text: '成長',
            rt: 'せいちょう'
          },
          {
            text: 'する'
          },
          {
            text: '姿',
            rt: 'すがた'
          },
          {
            text: 'を'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'られるのが'
          },
          {
            text: '嬉',
            rt: 'うれ'
          },
          {
            text: 'しいです。'
          }
        ],
        translation: 'I am a teacher. I am happy to see my students grow.'
      },
      {
        segments: [
          {
            text: 'デザイナーをしています。'
          },
          {
            text: '自分',
            rt: 'じぶん'
          },
          {
            text: 'のアイデアが'
          },
          {
            text: '形',
            rt: 'かたち'
          },
          {
            text: 'になるのが'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I am a designer. I like seeing my ideas take shape.'
      }
    ]
  },
  {
    question: [
      {
        text: '今',
        rt: 'いま'
      },
      {
        text: 'すぐ'
      },
      {
        text: '日本',
        rt: 'にほん'
      },
      {
        text: 'のどこにでも'
      },
      {
        text: '行',
        rt: 'い'
      },
      {
        text: 'けるとしたら、どこに'
      },
      {
        text: '行',
        rt: 'い'
      },
      {
        text: 'きたいですか？その'
      },
      {
        text: '理由',
        rt: 'りゆう'
      },
      {
        text: 'も'
      },
      {
        text: '教',
        rt: 'おし'
      },
      {
        text: 'えてください。'
      }
    ],
    translation: 'If you could travel anywhere in Japan right now, where would you go and why?',
    answers: [
      {
        segments: [
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
            text: 'きたいです。'
          },
          {
            text: '美味',
            rt: 'おい'
          },
          {
            text: 'しい'
          },
          {
            text: '海鮮料理',
            rt: 'かいせんりょうり'
          },
          {
            text: 'をたくさん'
          },
          {
            text: '食',
            rt: 'た'
          },
          {
            text: 'べたいからです。'
          }
        ],
        translation: 'I want to go to Hokkaido because I want to eat lots of delicious seafood.'
      },
      {
        segments: [
          {
            text: '京都',
            rt: 'きょうと'
          },
          {
            text: 'に'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'きたいです。'
          },
          {
            text: '古',
            rt: 'ふる'
          },
          {
            text: 'いお'
          },
          {
            text: '寺',
            rt: 'てら'
          },
          {
            text: 'や'
          },
          {
            text: '静',
            rt: 'しず'
          },
          {
            text: 'かな'
          },
          {
            text: '庭園',
            rt: 'ていえん'
          },
          {
            text: 'をゆっくり'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'て'
          },
          {
            text: '回',
            rt: 'まわ'
          },
          {
            text: 'りたいです。'
          }
        ],
        translation: 'I want to go to Kyoto. I want to take my time visiting old temples and quiet gardens.'
      },
      {
        segments: [
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
            text: 'きたいです。'
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
            text: 'いで、のんびり'
          },
          {
            text: '過',
            rt: 'す'
          },
          {
            text: 'ごしたいからです。'
          }
        ],
        translation: 'I want to go to Okinawa because I want to swim in the beautiful sea and relax.'
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
        text: '、ハマっていることはありますか？'
      }
    ],
    translation: "What is something you've been obsessed with lately?",
    answers: [
      {
        segments: [
          {
            text: '料理',
            rt: 'りょうり'
          },
          {
            text: 'にハマっています。'
          },
          {
            text: '週末',
            rt: 'しゅうまつ'
          },
          {
            text: 'に'
          },
          {
            text: '新',
            rt: 'あたら'
          },
          {
            text: 'しいレシピに'
          },
          {
            text: '挑戦',
            rt: 'ちょうせん'
          },
          {
            text: 'するのが'
          },
          {
            text: '楽',
            rt: 'たの'
          },
          {
            text: 'しいです。'
          }
        ],
        translation: "I'm into cooking. It's fun to try new recipes on weekends."
      },
      {
        segments: [
          {
            text: '写真',
            rt: 'しゃしん'
          },
          {
            text: 'を'
          },
          {
            text: '撮',
            rt: 'と'
          },
          {
            text: 'ることにハマっています。'
          },
          {
            text: '近所',
            rt: 'きんじょ'
          },
          {
            text: 'の'
          },
          {
            text: '公園',
            rt: 'こうえん'
          },
          {
            text: 'で'
          },
          {
            text: '花',
            rt: 'はな'
          },
          {
            text: 'や'
          },
          {
            text: '景色',
            rt: 'けしき'
          },
          {
            text: 'を'
          },
          {
            text: '撮',
            rt: 'と'
          },
          {
            text: 'っています。'
          }
        ],
        translation: "I'm obsessed with taking photos. I take pictures of flowers and scenery in the neighborhood park."
      },
      {
        segments: [
          {
            text: 'キャンプにハマっています。'
          },
          {
            text: '自然',
            rt: 'しぜん'
          },
          {
            text: 'の'
          },
          {
            text: '中',
            rt: 'なか'
          },
          {
            text: 'で'
          },
          {
            text: '過',
            rt: 'す'
          },
          {
            text: 'ごすと、とてもリラックスできます。'
          }
        ],
        translation: "I'm into camping. Spending time in nature is very relaxing."
      }
    ]
  },
  {
    question: [
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
        text: 'はどのように'
      },
      {
        text: '過',
        rt: 'す'
      },
      {
        text: 'ごすのが'
      },
      {
        text: '一番好',
        rt: 'いちばんす'
      },
      {
        text: 'きですか？'
      }
    ],
    translation: 'What is your favorite way to spend a holiday?',
    answers: [
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
            text: 'んだり、'
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
            text: 'たりするのが'
          },
          {
            text: '一番好',
            rt: 'いちばんす'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like relaxing at home, reading books or watching movies the best.'
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
            text: '一緒',
            rt: 'いっしょ'
          },
          {
            text: 'に'
          },
          {
            text: '美味',
            rt: 'おい'
          },
          {
            text: 'しいレストランへ'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'くのが'
          },
          {
            text: '一番',
            rt: 'いちばん'
          },
          {
            text: 'の'
          },
          {
            text: '楽',
            rt: 'たの'
          },
          {
            text: 'しみです。'
          }
        ],
        translation: 'My favorite thing is going to delicious restaurants with my friends.'
      },
      {
        segments: [
          {
            text: '山',
            rt: 'やま'
          },
          {
            text: 'へハイキングに'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'って、'
          },
          {
            text: '体',
            rt: 'からだ'
          },
          {
            text: 'を'
          },
          {
            text: '動',
            rt: 'うご'
          },
          {
            text: 'かすのが'
          },
          {
            text: '一番好',
            rt: 'いちばんす'
          },
          {
            text: 'きです。'
          }
        ],
        translation: 'I like going hiking in the mountains and exercising the best.'
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
        text: '今',
        rt: 'いま'
      },
      {
        text: 'まで'
      },
      {
        text: 'に'
      },
      {
        text: '行',
        rt: 'い'
      },
      {
        text: 'った'
      },
      {
        text: '旅行',
        rt: 'りょこう'
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
        text: '一番',
        rt: 'いちばん'
      },
      {
        text: 'の'
      },
      {
        text: '思',
        rt: 'おも'
      },
      {
        text: 'い'
      },
      {
        text: '出',
        rt: 'で'
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
    translation: "What is your favorite memory from a trip you've taken?",
    answers: [
      {
        segments: [
          {
            text: '北海道',
            rt: 'ほっかいどう'
          },
          {
            text: 'で'
          },
          {
            text: '食',
            rt: 'た'
          },
          {
            text: 'べた'
          },
          {
            text: '海鮮丼',
            rt: 'かいせんどん'
          },
          {
            text: 'が'
          },
          {
            text: '最高',
            rt: 'さいこう'
          },
          {
            text: 'に'
          },
          {
            text: '美味',
            rt: 'おい'
          },
          {
            text: 'しかったです。'
          }
        ],
        translation: 'The seafood bowl I ate in Hokkaido was the best.'
      },
      {
        segments: [
          {
            text: '沖縄',
            rt: 'おきなわ'
          },
          {
            text: 'の'
          },
          {
            text: '海',
            rt: 'うみ'
          },
          {
            text: 'でダイビングをしたのが、とても'
          },
          {
            text: '綺麗',
            rt: 'きれい'
          },
          {
            text: 'で'
          },
          {
            text: '感動',
            rt: 'かんどう'
          },
          {
            text: 'しました。'
          }
        ],
        translation: 'Diving in the ocean in Okinawa was so beautiful and moving.'
      },
      {
        segments: [
          {
            text: '去年',
            rt: 'きょねん'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'った'
          },
          {
            text: '京都',
            rt: 'きょうと'
          },
          {
            text: 'の'
          },
          {
            text: '紅葉',
            rt: 'こうよう'
          },
          {
            text: 'が、'
          },
          {
            text: '信',
            rt: 'しん'
          },
          {
            text: 'じられないほど'
          },
          {
            text: '美',
            rt: 'うつく'
          },
          {
            text: 'しかったです。'
          }
        ],
        translation: 'The autumn leaves in Kyoto last year were unbelievably beautiful.'
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
        text: '今年',
        rt: 'ことし'
      },
      {
        text: 'の'
      },
      {
        text: '目標',
        rt: 'もくひょう'
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
    translation: 'What are some of your goals for this year?',
    answers: [
      {
        segments: [
          {
            text: '日本語',
            rt: 'にほんご'
          },
          {
            text: 'の'
          },
          {
            text: '試験',
            rt: 'しけん'
          },
          {
            text: 'に'
          },
          {
            text: '合格',
            rt: 'ごうかく'
          },
          {
            text: 'することです。'
          },
          {
            text: '毎日',
            rt: 'まいにち'
          },
          {
            text: '1'
          },
          {
            text: '時間勉強',
            rt: 'じかんべんきょう'
          },
          {
            text: 'しています。'
          }
        ],
        translation: 'My goal is to pass the Japanese language exam. I study for an hour every day.'
      },
      {
        segments: [
          {
            text: '健康',
            rt: 'けんこう'
          },
          {
            text: 'のために、'
          },
          {
            text: '毎日運動',
            rt: 'まいにちうんどう'
          },
          {
            text: 'を'
          },
          {
            text: '続',
            rt: 'つづ'
          },
          {
            text: 'けることです。'
          }
        ],
        translation: 'My goal is to continue exercising every day for my health.'
      },
      {
        segments: [
          {
            text: '新',
            rt: 'あたら'
          },
          {
            text: 'しい'
          },
          {
            text: '趣味',
            rt: 'しゅみ'
          },
          {
            text: 'を'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'つけて、もっとプライベートを'
          },
          {
            text: '充実',
            rt: 'じゅうじつ'
          },
          {
            text: 'させたいです。'
          }
        ],
        translation: 'I want to find a new hobby and make my private life more fulfilling.'
      }
    ]
  },
  {
    question: [
      {
        text: '来月',
        rt: 'らいげつ'
      },
      {
        text: '、'
      },
      {
        text: '楽',
        rt: 'たの'
      },
      {
        text: 'しみにしていることはありますか？'
      }
    ],
    translation: "What is something you're looking forward to in the next month?",
    answers: [
      {
        segments: [
          {
            text: '来月',
            rt: 'らいげつ'
          },
          {
            text: 'は'
          },
          {
            text: '友達',
            rt: 'ともだち'
          },
          {
            text: 'の'
          },
          {
            text: '結婚式',
            rt: 'けっこんしき'
          },
          {
            text: 'があるので、とても'
          },
          {
            text: '楽',
            rt: 'たの'
          },
          {
            text: 'しみです。'
          }
        ],
        translation: "I'm looking forward to my friend's wedding next month."
      },
      {
        segments: [
          {
            text: '新',
            rt: 'あたら'
          },
          {
            text: 'しいゲームが'
          },
          {
            text: '発売',
            rt: 'はつばい'
          },
          {
            text: 'されるので、それを'
          },
          {
            text: '楽',
            rt: 'たの'
          },
          {
            text: 'しみにしています。'
          }
        ],
        translation: "A new game is coming out, so I'm looking forward to that."
      },
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
            text: '温泉',
            rt: 'おんせん'
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
            text: '計画',
            rt: 'けいかく'
          },
          {
            text: 'があるので、わくわくしています。'
          }
        ],
        translation: "I have plans to go to a hot spring with my family, so I'm excited."
      }
    ]
  },
  {
    question: [
      {
        text: '一生',
        rt: 'いっしょう'
      },
      {
        text: '、'
      },
      {
        text: '一種類',
        rt: 'いっしゅるい'
      },
      {
        text: 'の'
      },
      {
        text: '料理',
        rt: 'りょうり'
      },
      {
        text: 'しか'
      },
      {
        text: '食',
        rt: 'た'
      },
      {
        text: 'べられないとしたら、'
      },
      {
        text: '何',
        rt: 'なに'
      },
      {
        text: 'を'
      },
      {
        text: '選',
        rt: 'えら'
      },
      {
        text: 'びますか？'
      }
    ],
    translation: 'If you could only eat one type of cuisine for the rest of your life, what would it be?',
    answers: [
      {
        segments: [
          {
            text: '寿司',
            rt: 'すし'
          },
          {
            text: 'を'
          },
          {
            text: '選',
            rt: 'えら'
          },
          {
            text: 'びます。'
          },
          {
            text: '飽',
            rt: 'あ'
          },
          {
            text: 'きないし、ヘルシーだからです。'
          }
        ],
        translation: "I would choose sushi. I won't get tired of it and it's healthy."
      },
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
            text: 'を'
          },
          {
            text: '選',
            rt: 'えら'
          },
          {
            text: 'びます。パスタやピザが'
          },
          {
            text: '大好',
            rt: 'だいす'
          },
          {
            text: 'きだからです。'
          }
        ],
        translation: 'I would choose Italian food. I love pasta and pizza.'
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
            text: '定食',
            rt: 'ていしょく'
          },
          {
            text: 'を'
          },
          {
            text: '選',
            rt: 'えら'
          },
          {
            text: 'びます。'
          },
          {
            text: '栄養', rt: 'えいよう'
          },
          {
            text: 'のバランスが'
          },
          {
            text: '良',
            rt: 'よ'
          },
          {
            text: 'いからです。'
          }
        ],
        translation: 'I would choose Japanese set meals. They have a good nutritional balance.'
      }
    ]
  },
  {
    question: [
      {
        text: 'あなたの'
      },
      {
        text: '考',
        rt: 'かんが'
      },
      {
        text: 'え'
      },
      {
        text: '方',
        rt: 'かた'
      },
      {
        text: 'に'
      },
      {
        text: '大',
        rt: 'おお'
      },
      {
        text: 'きな'
      },
      {
        text: '影響',
        rt: 'えいきょう'
      },
      {
        text: 'を'
      },
      {
        text: '与',
        rt: 'あた'
      },
      {
        text: 'えた'
      },
      {
        text: '本',
        rt: 'ほん'
      },
      {
        text: 'や'
      },
      {
        text: '映画',
        rt: 'えいが'
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
    translation: "What's a book or movie that significantly influenced your way of thinking?",
    answers: [
      {
        segments: [
          {
            text: '「'
          },
          {
            text: '7',
            rt: 'なな'
          },
          {
            text: 'つの'
          },
          {
            text: '習慣',
            rt: 'しゅうかん'
          },
          {
            text: '」という'
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
            text: 'んで、'
          },
          {
            text: '時間',
            rt: 'じかん'
          },
          {
            text: 'の'
          },
          {
            text: '使',
            rt: 'つか'
          },
          {
            text: 'い'
          },
          {
            text: '方',
            rt: 'かた'
          },
          {
            text: 'が'
          },
          {
            text: '変',
            rt: 'か'
          },
          {
            text: 'わりました。'
          }
        ],
        translation: 'After reading the book "The 7 Habits," the way I use my time changed.'
      },
      {
        segments: [
          {
            text: '「'
          },
          {
            text: '最強',
            rt: 'さいきょう'
          },
          {
            text: 'のふたり」という'
          },
          {
            text: '映画',
            rt: 'えいが'
          },
          {
            text: 'を'
          },
          {
            text: '観',
            rt: 'み'
          },
          {
            text: 'て、'
          },
          {
            text: '友情',
            rt: 'ゆうじょう'
          },
          {
            text: 'の'
          },
          {
            text: '大切',
            rt: 'たいせつ'
          },
          {
            text: 'さを'
          },
          {
            text: '学',
            rt: 'まな'
          },
          {
            text: 'びました。'
          }
        ],
        translation: 'Watching the movie "The Intouchables," I learned the importance of friendship.'
      },
      {
        segments: [
          {
            text: '小説',
            rt: 'しょうせつ'
          },
          {
            text: 'を'
          },
          {
            text: '読',
            rt: 'よ'
          },
          {
            text: 'んで、'
          },
          {
            text: '他',
            rt: 'ほか'
          },
          {
            text: 'の'
          },
          {
            text: '人',
            rt: 'ひと'
          },
          {
            text: 'の'
          },
          {
            text: '視点',
            rt: 'してん'
          },
          {
            text: 'から'
          },
          {
            text: '世界',
            rt: 'せかい'
          },
          {
            text: 'を'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'ることを'
          },
          {
            text: '覚',
            rt: 'おぼ'
          },
          {
            text: 'えました。'
          }
        ],
        translation: "By reading novels, I learned to see the world from other people's perspectives."
      }
    ]
  },
  {
    question: [
      {
        text: '忙',
        rt: 'いそが'
      },
      {
        text: 'しい'
      },
      {
        text: '一日',
        rt: 'いちにち'
      },
      {
        text: 'の'
      },
      {
        text: '後',
        rt: 'あと'
      },
      {
        text: '、どのようにリラックスするのが'
      },
      {
        text: '好',
        rt: 'す'
      },
      {
        text: 'きですか？'
      }
    ],
    translation: 'How do you usually like to relax after a busy day?',
    answers: [
      {
        segments: [
          {
            text: 'お'
          },
          {
            text: '風呂',
            rt: 'ふろ'
          },
          {
            text: 'にゆっくり'
          },
          {
            text: '入',
            rt: 'はい'
          },
          {
            text: 'って、'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きな'
          },
          {
            text: '音楽',
            rt: 'おんがく'
          },
          {
            text: 'を'
          },
          {
            text: '聴',
            rt: 'き'
          },
          {
            text: 'きます。'
          }
        ],
        translation: 'I take a long bath and listen to my favorite music.'
      },
      {
        segments: [
          {
            text: '冷',
            rt: 'つめ'
          },
          {
            text: 'たいビールを'
          },
          {
            text: '飲',
            rt: 'の'
          },
          {
            text: 'みながら、YouTubeを'
          },
          {
            text: '観',
            rt: 'み'
          },
          {
            text: 'るのが'
          },
          {
            text: '最高',
            rt: 'さいこう'
          },
          {
            text: 'です。'
          }
        ],
        translation: 'Drinking a cold beer while watching YouTube is the best.'
      },
      {
        segments: [
          {
            text: 'アロマを'
          },
          {
            text: '焚',
            rt: 'た'
          },
          {
            text: 'いて、'
          },
          {
            text: '何',
            rt: 'なに'
          },
          {
            text: 'も'
          },
          {
            text: '考',
            rt: 'かんが'
          },
          {
            text: 'えずに'
          },
          {
            text: '早',
            rt: 'はや'
          },
          {
            text: 'めに'
          },
          {
            text: '寝',
            rt: 'ね'
          },
          {
            text: 'ます。'
          }
        ],
        translation: 'I light some incense and go to bed early without thinking about anything.'
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
        text: '言語以外',
        rt: 'げんごいがい'
      },
      {
        text: 'で'
      },
      {
        text: '新',
        rt: 'あたら'
      },
      {
        text: 'しく'
      },
      {
        text: '学',
        rt: 'まな'
      },
      {
        text: 'んだことはありますか？'
      }
    ],
    translation: "What's something you've learned recently that wasn't related to languages?",
    answers: [
      {
        segments: [
          {
            text: '最近',
            rt: 'さいきん'
          },
          {
            text: '、'
          },
          {
            text: '動画',
            rt: 'どうが'
          },
          {
            text: 'の'
          },
          {
            text: '編集',
            rt: 'へんしゅう'
          },
          {
            text: 'のやり'
          },
          {
            text: '方',
            rt: 'かた'
          },
          {
            text: 'を'
          },
          {
            text: '学',
            rt: 'まな'
          },
          {
            text: 'び'
          },
          {
            text: '始',
            rt: 'はじ'
          },
          {
            text: 'めました。'
          }
        ],
        translation: 'I recently started learning how to edit videos.'
      },
      {
        segments: [
          {
            text: '観葉植物',
            rt: 'かんようしょくぶつ'
          },
          {
            text: 'の'
          },
          {
            text: '育',
            rt: 'そだ'
          },
          {
            text: 'て'
          },
          {
            text: '方',
            rt: 'かた'
          },
          {
            text: 'について'
          },
          {
            text: '詳',
            rt: 'くわ'
          },
          {
            text: 'しくなりました。'
          }
        ],
        translation: "I've become knowledgeable about how to grow houseplants."
      },
      {
        segments: [
          {
            text: '瞑想',
            rt: 'めいそう'
          },
          {
            text: 'の'
          },
          {
            text: '習慣',
            rt: 'しゅうかん'
          },
          {
            text: 'がメンタルに'
          },
          {
            text: '与',
            rt: 'あた'
          },
          {
            text: 'える'
          },
          {
            text: '効果',
            rt: 'こうか'
          },
          {
            text: 'を'
          },
          {
            text: '学',
            rt: 'まな'
          },
          {
            text: 'びました。'
          }
        ],
        translation: 'I learned about the effects of a meditation habit on mental health.'
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
        text: 'もし'
      },
      {
        text: '魔法',
        rt: 'まほう'
      },
      {
        text: 'が'
      },
      {
        text: '使',
        rt: 'つか'
      },
      {
        text: 'えるとしたら、どんなことがしたいですか？'
      }
    ],
    translation: 'If you could have any superpower, what would it be and why?',
    answers: [
      {
        segments: [
          {
            text: '空',
            rt: 'そら'
          },
          {
            text: 'を'
          },
          {
            text: '飛',
            rt: 'と'
          },
          {
            text: 'んでみたいです。'
          },
          {
            text: '高',
            rt: 'たか'
          },
          {
            text: 'いところから'
          },
          {
            text: '景色',
            rt: 'けしき'
          },
          {
            text: 'を'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'てみたいからです。'
          }
        ],
        translation: 'I want to try flying in the sky because I want to see the scenery from a high place.'
      },
      {
        segments: [
          {
            text: '世界中',
            rt: 'せかいじゅう'
          },
          {
            text: 'の'
          },
          {
            text: '言葉',
            rt: 'ことば'
          },
          {
            text: 'を'
          },
          {
            text: '話',
            rt: 'はな'
          },
          {
            text: 'せるようになりたいです。'
          },
          {
            text: '色々',
            rt: 'いろいろ'
          },
          {
            text: 'な'
          },
          {
            text: '国',
            rt: 'くに'
          },
          {
            text: 'の'
          },
          {
            text: '人',
            rt: 'ひと'
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
        translation: 'I want to be able to speak languages from all over the world because I want to talk to people from various countries.'
      },
      {
        segments: [
          {
            text: '瞬間移動',
            rt: 'しゅんかんいどう'
          },
          {
            text: 'ができるようになりたいです。'
          },
          {
            text: '旅行',
            rt: 'りょこう'
          },
          {
            text: 'がもっと'
          },
          {
            text: '楽',
            rt: 'らく'
          },
          {
            text: 'になるからです。'
          }
        ],
        translation: 'I want to be able to teleport. It would make traveling much easier.'
      }
    ]
  },
  {
    question: [
      {
        text: 'もし'
      },
      {
        text: '歴史上',
        rt: 'れきしじょう'
      },
      {
        text: 'のどの'
      },
      {
        text: '時代',
        rt: 'じだい'
      },
      {
        text: 'でも'
      },
      {
        text: '住',
        rt: 'す'
      },
      {
        text: 'めるとしたら、いつを'
      },
      {
        text: '選',
        rt: 'えら'
      },
      {
        text: 'びますか？その'
      },
      {
        text: '理由',
        rt: 'りゆう'
      },
      {
        text: 'も'
      },
      {
        text: '教',
        rt: 'おし'
      },
      {
        text: 'えてください。'
      }
    ],
    translation: 'If you could live in any era of history, which one would you choose and why?',
    answers: [
      {
        segments: [
          {
            text: '江戸時代',
            rt: 'えどじだい'
          },
          {
            text: 'を'
          },
          {
            text: '歩',
            rt: 'ある'
          },
          {
            text: 'いてみたいです。'
          },
          {
            text: '侍',
            rt: 'さむらい'
          },
          {
            text: 'や'
          },
          {
            text: '文化',
            rt: 'ぶんか'
          },
          {
            text: 'に'
          },
          {
            text: '興味',
            rt: 'きょうみ'
          },
          {
            text: 'があるからです。'
          }
        ],
        translation: 'I want to walk through the Edo period. I am interested in samurai and the culture.'
      },
      {
        segments: [
          {
            text: '1960'
          },
          {
            text: '年代',
            rt: 'ねんだい'
          },
          {
            text: 'の'
          },
          {
            text: 'アメリカ'
          },
          {
            text: 'に'
          },
          {
            text: '行',
            rt: 'い'
          },
          {
            text: 'きたいです。'
          },
          {
            text: '音楽',
            rt: 'おんがく'
          },
          {
            text: 'やファッションが'
          },
          {
            text: '好',
            rt: 'す'
          },
          {
            text: 'きだからです。'
          }
        ],
        translation: 'I want to go to America in the 1960s. I like the music and fashion.'
      },
      {
        segments: [
          {
            text: '未来',
            rt: 'みらい'
          },
          {
            text: 'の'
          },
          {
            text: '100',
            rt: 'ひゃく'
          },
          {
            text: '年後',
            rt: 'ねんご'
          },
          {
            text: 'を'
          },
          {
            text: '見',
            rt: 'み'
          },
          {
            text: 'てみたいです。テクノロジーがどうなっているか'
          },
          {
            text: '気',
            rt: 'き'
          },
          {
            text: 'になります。'
          }
        ],
        translation: "I want to see 100 years into the future. I'm curious about what technology will be like."
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
      { text: 'どのくらい' },
      { text: '日本語', rt: 'にほんご' },
      { text: 'を' },
      { text: '勉強', rt: 'べんきょう' },
      { text: 'していますか？' }
    ],
    translation: 'How long have you been learning Japanese?',
    answers: [
      {
        segments: [
          { text: '1' },
          { text: '年', rt: 'ねん' },
          { text: 'くらい' },
          { text: '勉強', rt: 'べんきょう' },
          { text: 'しています。' }
        ],
        translation: "I've been studying for about a year."
      },
      {
        segments: [
          { text: '3' },
          { text: 'ヶ', rt: 'か' },
          { text: '月前', rt: 'げつまえ' },
          { text: 'に' },
          { text: '始', rt: 'はじ' },
          { text: 'めました。' }
        ],
        translation: 'I started three months ago.'
      },
      {
        segments: [
          { text: 'まだ' },
          { text: '始', rt: 'はじ' },
          { text: 'めたばかりです。' }
        ],
        translation: "I've just started."
      }
    ]
  },
  {
    question: [
      { text: 'どのような' },
      { text: '方法', rt: 'ほうほう' },
      { text: 'で' },
      { text: '言語', rt: 'げんご' },
      { text: 'を' },
      { text: '勉強', rt: 'べんきょう' },
      { text: 'するのが' },
      { text: '好', rt: 'す' },
      { text: 'きですか？' }
    ],
    translation: 'What is your preferred method to learn languages?',
    answers: [
      {
        segments: [
          { text: 'アプリを' },
          { text: '使', rt: 'つか' },
          { text: 'って' },
          { text: '勉強', rt: 'べんきょう' },
          { text: 'するのが' },
          { text: '好', rt: 'す' },
          { text: 'きです。' }
        ],
        translation: 'I like studying using apps.'
      },
      {
        segments: [
          { text: '日本語', rt: 'にほんご' },
          { text: 'の' },
          { text: '先生', rt: 'せんせい' },
          { text: 'と' },
          { text: '話', rt: 'はな' },
          { text: 'すのが' },
          { text: '一番', rt: 'いちばん' },
          { text: 'です。' }
        ],
        translation: 'Talking with a Japanese teacher is the best.'
      },
      {
        segments: [
          { text: 'YouTubeのビデオを' },
          { text: '見', rt: 'み' },
          { text: 'て' },
          { text: '勉強', rt: 'べんきょう' },
          { text: 'しています。' }
        ],
        translation: 'I study by watching YouTube videos.'
      }
    ]
  },
  {
    question: [
      { text: '日本語', rt: 'にほんご' },
      { text: 'で' },
      { text: '一番', rt: 'いちばん' },
      { text: '難', rt: 'むずか' },
      { text: 'しいところは' },
      { text: '何', rt: 'なに' },
      { text: 'ですか？' }
    ],
    translation: 'What is the most difficult part of Japanese for you?',
    answers: [
      {
        segments: [
          { text: '漢字', rt: 'かんじ' },
          { text: 'を' },
          { text: '覚', rt: 'おぼ' },
          { text: 'えるのがとても' },
          { text: '難', rt: 'むずか' },
          { text: 'しいです。' }
        ],
        translation: 'Remembering Kanji is very difficult.'
      },
      {
        segments: [
          { text: '敬語', rt: 'けいご' },
          { text: 'の' },
          { text: '使', rt: 'つか' },
          { text: 'い' },
          { text: '方', rt: 'かた' },
          { text: 'が' },
          { text: '難', rt: 'むずか' },
          { text: 'しいと' },
          { text: '思', rt: 'おも' },
          { text: 'います。' }
        ],
        translation: 'I think using honorifics is difficult.'
      },
      {
        segments: [
          { text: '聴解', rt: 'ちょうかい' },
          { text: 'が' },
          { text: '一番', rt: 'いちばん' },
          { text: 'の' },
          { text: '課題', rt: 'かだい' },
          { text: 'です。' }
        ],
        translation: 'Listening comprehension is my biggest challenge.'
      }
    ]
  },
  {
    question: [
      { text: 'アンキなどの' },
      { text: '単語帳', rt: 'たんごちょう' },
      { text: 'を' },
      { text: '使', rt: 'つか' },
      { text: 'っていますか？' }
    ],
    translation: 'Do you use Anki or other flashcards?',
    answers: [
      {
        segments: [
          { text: 'はい、' },
          { text: '毎日', rt: 'まいにち' },
          { text: 'アンキで' },
          { text: '復習', rt: 'ふくしゅう' },
          { text: 'しています。' }
        ],
        translation: 'Yes, I review with Anki every day.'
      },
      {
        segments: [
          { text: '単語帳', rt: 'たんごちょう' },
          { text: 'はあまり' },
          { text: '使', rt: 'つか' },
          { text: 'いませんが、' },
          { text: '本', rt: 'ほん' },
          { text: 'を' },
          { text: '読', rt: 'よ' },
          { text: 'みます。' }
        ],
        translation: "I don't use flashcards much, but I read books."
      },
      {
        segments: [
          { text: '自分', rt: 'じぶん' },
          { text: 'で' },
          { text: '作', rt: 'つく' },
          { text: 'ったカードを' },
          { text: '使', rt: 'つか' },
          { text: 'っています。' }
        ],
        translation: 'I use cards I made myself.'
      }
    ]
  },
  {
    question: [
      { text: 'どんな' },
      { text: '日本', rt: 'にほん' },
      { text: 'のメディアが' },
      { text: '好', rt: 'す' },
      { text: 'きですか？' }
    ],
    translation: 'What kind of Japanese media (anime, movies, music) do you like?',
    answers: [
      {
        segments: [
          { text: '日本', rt: 'にほん' },
          { text: 'の' },
          { text: 'アニメと' },
          { text: '漫画', rt: 'まんが' },
          { text: 'が' },
          { text: '大好', rt: 'だいす' },
          { text: 'きです。' }
        ],
        translation: 'I love Japanese anime and manga.'
      },
      {
        segments: [
          { text: '最近', rt: 'さいきん' },
          { text: 'は' },
          { text: '日本', rt: 'にほん' },
          { text: 'のシティポップをよく' },
          { text: '聴', rt: 'き' },
          { text: 'きます。' }
        ],
        translation: 'Lately I often listen to Japanese City Pop.'
      },
      {
        segments: [
          { text: '日本', rt: 'にほん' },
          { text: 'の' },
          { text: '実写映画', rt: 'じっしゃえいが' },
          { text: 'に' },
          { text: '興味', rt: 'きょうみ' },
          { text: 'があります。' }
        ],
        translation: "I'm interested in Japanese live-action movies."
      }
    ]
  },
  {
    question: [
      { text: '漢字', rt: 'かんじ' },
      { text: 'を' },
      { text: '覚', rt: 'おぼ' },
      { text: 'えるためのコツはありますか？' }
    ],
    translation: 'Do you have any tips for learning Kanji?',
    answers: [
      {
        segments: [
          { text: '毎日', rt: 'まいにち' },
          { text: '少', rt: 'すこ' },
          { text: 'しずつ' },
          { text: '書', rt: 'か' },
          { text: 'くのが' },
          { text: '大切', rt: 'たいせつ' },
          { text: 'だと' },
          { text: '思', rt: 'おも' },
          { text: 'います。' }
        ],
        translation: "I think it's important to write a little every day."
      },
      {
        segments: [
          { text: '部首', rt: 'ぶしゅ' },
          { text: 'の' },
          { text: '意味', rt: 'いみ' },
          { text: 'を' },
          { text: '理解', rt: 'りかい' },
          { text: 'すると' },
          { text: '覚', rt: 'おぼ' },
          { text: 'えやすいです。' }
        ],
        translation: 'Understanding the meaning of radicals makes it easier to remember.'
      },
      {
        segments: [
          { text: '実際', rt: 'じっさい' },
          { text: 'の' },
          { text: '文章', rt: 'ぶんしょう' },
          { text: 'の' },
          { text: '中', rt: 'なか' },
          { text: 'で' },
          { text: '覚', rt: 'おぼ' },
          { text: 'えるようにしています。' }
        ],
        translation: 'I try to remember them within actual sentences.'
      }
    ]
  },
  {
    question: [
      { text: '言語交換会', rt: 'げんごこうかんかい' },
      { text: 'に' },
      { text: '参加', rt: 'さんか' },
      { text: 'したことはありますか？' }
    ],
    translation: 'Have you ever been to a language meetup before?',
    answers: [
      {
        segments: [
          { text: 'はい、' },
          { text: '先週初', rt: 'せんしゅうはじ' },
          { text: 'めて' },
          { text: '参加', rt: 'さんか' },
          { text: 'しました。' }
        ],
        translation: 'Yes, I participated for the first time last week.'
      },
      {
        segments: [
          { text: 'いいえ、まだありませんが、' },
          { text: '行', rt: 'い' },
          { text: 'ってみたいです。' }
        ],
        translation: 'No, not yet, but I want to go.'
      },
      {
        segments: [
          { text: 'オンラインの' },
          { text: '交流会', rt: 'こうりゅうかい' },
          { text: 'によく' },
          { text: '参加', rt: 'さんか' },
          { text: 'します。' }
        ],
        translation: 'I often participate in online exchange meetings.'
      }
    ]
  }
]
