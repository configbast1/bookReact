export const aboutMe = {
  fullName: 'Taras Okres',
  nickname: 'configbast1',
  role: 'Front-end developer (student)',
  location: 'Ukraine',
  school: 'IT STEP Computer Academy',
  course: 'React / JavaScript',
  github: 'https://github.com/configbast1',
  email: 'steelboy113@gmail.com',
  languages: ['Ukrainian', 'Russian', 'English (technical)'],
  programmingLanguages: ['JavaScript', 'TypeScript', 'C++', 'C#'],
  stack: ['React', 'Redux Toolkit', 'React Router', 'TanStack Query', 'Vite', 'Node.js'],
  tools: ['WebStorm', 'Git', 'GitHub', 'Vercel', 'Figma'],
  currentProject: 'Bookstore — online book shop built with React',
  favoriteBook: 'Clean Code by Robert Martin',
  favoriteGame: 'The Witcher 3',
  hobbies: ['programming', 'reading', 'gaming', 'music'],
  yearGoal: 'Get the first commercial front-end job',
  funFact: 'The first program I ever wrote was a console process manager in C++',
  availableForWork: true,
  updatedAt: '2026-09-20',
};

export default function handler(request, response) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=600');
  response.setHeader('Access-Control-Allow-Origin', '*');

  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  response.status(200).json(aboutMe);
}
