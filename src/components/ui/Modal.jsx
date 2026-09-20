import PropTypes from 'prop-types';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import styles from './Modal.module.css';

export default function Modal({ open, title, onClose, children, footer, width = 520 }) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={() => onClose?.()} className={styles.root}>
      <DialogBackdrop transition className={styles.overlay} />

      <div className={styles.wrap}>
        <DialogPanel transition className={styles.dialog} style={{ maxWidth: width }}>
          <header className={styles.header}>
            <DialogTitle className={styles.title}>{title}</DialogTitle>
            <button
              type="button"
              className={styles.close}
              onClick={() => onClose?.()}
              aria-label={t('common.close')}
            >
              ×
            </button>
          </header>

          <div className={styles.body}>{children}</div>

          {footer && <footer className={styles.footer}>{footer}</footer>}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

Modal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.node,
  footer: PropTypes.node,
  width: PropTypes.number,
};
