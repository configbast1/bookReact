export const favoritesSeed = [
  {
    id: 'fav-clean-code',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genreKey: 'programming',
    year: 2008,
    pages: 464,
    myRating: 5,
    description: {
      ru: 'Книга о том, как писать код, который легко читать и поддерживать через год после написания.',
      en: 'A book about writing code that is still easy to read and maintain a year later.',
    },
    reviews: [
      {
        id: 'r1',
        author: 'Anna',
        rating: 5,
        date: '2026-01-12',
        text: {
          ru: 'После этой книги стыдно за старые проекты — и это хороший знак.',
          en: 'After this book my old projects make me blush, and that is a good sign.',
        },
      },
      {
        id: 'r2',
        author: 'Dmytro',
        rating: 5,
        date: '2026-01-20',
        text: {
          ru: 'Главы про именование и функции стоит перечитывать раз в полгода.',
          en: 'The chapters on naming and functions are worth rereading twice a year.',
        },
      },
      {
        id: 'r3',
        author: 'Serhii',
        rating: 4,
        date: '2026-02-02',
        text: {
          ru: 'Примеры на Java, но принципы работают в любом языке.',
          en: 'The examples are in Java, yet the principles work in any language.',
        },
      },
      {
        id: 'r4',
        author: 'Kateryna',
        rating: 5,
        date: '2026-02-14',
        text: {
          ru: 'Лучшее объяснение, почему комментарии не спасают плохой код.',
          en: 'The best explanation of why comments do not rescue bad code.',
        },
      },
      {
        id: 'r5',
        author: 'Oleh',
        rating: 4,
        date: '2026-02-28',
        text: {
          ru: 'Местами категорично, но спорить с автором полезно.',
          en: 'Opinionated in places, but arguing with the author is useful.',
        },
      },
      {
        id: 'r6',
        author: 'Marta',
        rating: 5,
        date: '2026-03-05',
        text: {
          ru: 'Читала параллельно с рефакторингом учебного проекта — идеальное сочетание.',
          en: 'I read it while refactoring a study project, a perfect combination.',
        },
      },
      {
        id: 'r7',
        author: 'Ihor',
        rating: 5,
        date: '2026-03-19',
        text: {
          ru: 'Раздел про тесты изменил моё отношение к TDD.',
          en: 'The testing chapter changed how I feel about TDD.',
        },
      },
      {
        id: 'r8',
        author: 'Yulia',
        rating: 4,
        date: '2026-04-02',
        text: {
          ru: 'Полезно даже новичку: многое становится понятно на примерах до и после.',
          en: 'Useful even for a beginner: the before and after examples explain a lot.',
        },
      },
      {
        id: 'r9',
        author: 'Pavlo',
        rating: 5,
        date: '2026-04-21',
        text: {
          ru: 'Перечитываю перед каждым код-ревью в команде.',
          en: 'I reread it before every team code review.',
        },
      },
      {
        id: 'r10',
        author: 'Nazar',
        rating: 5,
        date: '2026-05-10',
        text: {
          ru: 'Книга, после которой начинаешь замечать запахи кода везде.',
          en: 'After this book you start noticing code smells everywhere.',
        },
      },
    ],
  },
  {
    id: 'fav-dune',
    title: 'Dune',
    author: 'Frank Herbert',
    genreKey: 'scifi',
    year: 1965,
    pages: 688,
    myRating: 5,
    description: {
      ru: 'История про пустынную планету, политику, веру и воду, которая дороже золота.',
      en: 'A story about a desert planet, politics, faith and water worth more than gold.',
    },
    reviews: [
      {
        id: 'r11',
        author: 'Viktor',
        rating: 5,
        date: '2026-01-08',
        text: {
          ru: 'Мир прописан так, что чувствуешь песок на зубах.',
          en: 'The world is written so well you can feel sand on your teeth.',
        },
      },
      {
        id: 'r12',
        author: 'Sofia',
        rating: 4,
        date: '2026-02-11',
        text: {
          ru: 'Первые сто страниц тяжело, дальше не оторваться.',
          en: 'The first hundred pages are slow, after that it is unputdownable.',
        },
      },
      {
        id: 'r13',
        author: 'Roman',
        rating: 5,
        date: '2026-03-01',
        text: {
          ru: 'Политические интриги написаны лучше, чем в большинстве исторических романов.',
          en: 'The political intrigue beats most historical novels.',
        },
      },
      {
        id: 'r14',
        author: 'Alina',
        rating: 5,
        date: '2026-03-27',
        text: {
          ru: 'Аудиоверсия отличная, слушала в дороге две недели.',
          en: 'The audio version is great, I listened to it on the road for two weeks.',
        },
      },
      {
        id: 'r15',
        author: 'Taras',
        rating: 4,
        date: '2026-04-30',
        text: {
          ru: 'Фильм красивый, но книга глубже.',
          en: 'The film is beautiful, but the book goes deeper.',
        },
      },
    ],
  },
  {
    id: 'fav-witcher',
    title: 'The Last Wish',
    author: 'Andrzej Sapkowski',
    genreKey: 'fantasy',
    year: 1993,
    pages: 288,
    myRating: 4,
    description: {
      ru: 'Сборник рассказов о ведьмаке Геральте: сказки, вывернутые наизнанку.',
      en: 'Short stories about Geralt the witcher: fairy tales turned inside out.',
    },
    reviews: [
      {
        id: 'r16',
        author: 'Bohdan',
        rating: 5,
        date: '2026-01-30',
        text: {
          ru: 'Диалоги и ирония — сильнейшая часть книги.',
          en: 'The dialogue and irony are the strongest part of the book.',
        },
      },
      {
        id: 'r17',
        author: 'Olena',
        rating: 4,
        date: '2026-02-18',
        text: {
          ru: 'Читается быстро, каждый рассказ — отдельная история.',
          en: 'A quick read, every story stands on its own.',
        },
      },
      {
        id: 'r18',
        author: 'Maksym',
        rating: 4,
        date: '2026-03-14',
        text: {
          ru: 'После игры читать особенно интересно: многое узнаёшь.',
          en: 'Reading it after the game is fun: you recognise a lot.',
        },
      },
      {
        id: 'r19',
        author: 'Iryna',
        rating: 5,
        date: '2026-04-09',
        text: {
          ru: 'Переосмысленные сказки — лучшая идея цикла.',
          en: 'Retold fairy tales are the best idea in the series.',
        },
      },
      {
        id: 'r20',
        author: 'Denys',
        rating: 4,
        date: '2026-05-02',
        text: {
          ru: 'Отличная точка входа в большой цикл.',
          en: 'A great entry point into a long series.',
        },
      },
    ],
  },
];

export default favoritesSeed;
