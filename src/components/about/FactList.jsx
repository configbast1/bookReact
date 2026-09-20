import PropTypes from 'prop-types';
import FactItem from './FactItem.jsx';
import styles from './FactList.module.css';

const LABELS = {
  fullName: 'Name',
  nickname: 'Nickname',
  role: 'Role',
  location: 'Location',
  school: 'School',
  course: 'Course',
  github: 'GitHub',
  email: 'Email',
  languages: 'Languages',
  programmingLanguages: 'Programming languages',
  stack: 'Stack',
  tools: 'Tools',
  currentProject: 'Current project',
  favoriteBook: 'Favorite book',
  favoriteGame: 'Favorite game',
  hobbies: 'Hobbies',
  yearGoal: 'Goal for the year',
  funFact: 'Fun fact',
  availableForWork: 'Open to work',
  updatedAt: 'Updated at',
};

export default function FactList({ facts }) {
  const entries = Object.entries(facts);

  return (
    <dl className={styles.list}>
      {entries.map(([key, value]) => (
        <FactItem key={key} label={LABELS[key] ?? key} value={value} />
      ))}
    </dl>
  );
}

FactList.propTypes = { facts: PropTypes.object.isRequired };
