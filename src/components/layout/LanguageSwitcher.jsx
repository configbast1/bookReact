import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/i18n';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current =
    SUPPORTED_LANGUAGES.find((item) => item.code === i18n.language) ?? SUPPORTED_LANGUAGES[0];

  return (
    <Menu as="div" className={styles.wrap}>
      <MenuButton className={styles.button} aria-label={t('nav.language')}>
        <span aria-hidden="true">🌐</span>
        {current.short}
      </MenuButton>

      <MenuItems anchor="bottom end" className={styles.items}>
        {SUPPORTED_LANGUAGES.map((language) => (
          <MenuItem key={language.code}>
            <button
              type="button"
              className={language.code === current.code ? styles.itemActive : styles.item}
              onClick={() => i18n.changeLanguage(language.code)}
            >
              {language.label}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
