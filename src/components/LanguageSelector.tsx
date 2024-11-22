import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ko', name: '한국어' },
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    handleClose();
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="change language"
        onClick={handleClick}
      >
        <LanguageIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            selected={i18n.language === lang.code}
          >
            {lang.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;
