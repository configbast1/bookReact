import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext.jsx';
import { SUPPORTED_LANGUAGES } from '@/i18n';
import styles from './AccountPage.module.css';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>{t('account.settingsTitle')}</h2>

      <div className={styles.settingRow}>
        <span className={styles.settingLabel}>{t('account.theme')}</span>
        <div className={styles.buttons}>
          <Button
            size="sm"
            variant={theme === 'light' ? 'primary' : 'secondary'}
            onClick={() => setTheme('light')}
          >
            {t('account.themeLight')}
          </Button>
          <Button
            size="sm"
            variant={theme === 'dark' ? 'primary' : 'secondary'}
            onClick={() => setTheme('dark')}
          >
            {t('account.themeDark')}
          </Button>
        </div>
      </div>

      <div className={styles.settingRow}>
        <span className={styles.settingLabel}>{t('account.language')}</span>
        <div className={styles.buttons}>
          {SUPPORTED_LANGUAGES.map((language) => (
            <Button
              key={language.code}
              size="sm"
              variant={i18n.language === language.code ? 'primary' : 'secondary'}
              onClick={() => i18n.changeLanguage(language.code)}
            >
              {language.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
