import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { mode, toggleColorMode } = useTheme();

  return (
    <Tooltip
      title={mode === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      <IconButton color="inherit" onClick={toggleColorMode}>
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
