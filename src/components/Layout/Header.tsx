import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSelector from '../LanguageSelector';
import ThemeToggle from '../ThemeToggle';

interface HeaderProps {
  onDrawerToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDrawerToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {onDrawerToggle && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
        >
          GPT Tools
        </Typography>

        {/* 공통 네비게이션 */}
        <Button
          color="inherit"
          component={RouterLink}
          to="/tools"
          sx={{ mr: 2 }}
        >
          도구 목록
        </Button>

        {/* 언어 선택 및 테마 토글 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <LanguageSelector />
          <ThemeToggle />
        </Box>

        {/* 사용자 메뉴 */}
        {user ? (
          <>
            <IconButton
              onClick={handleMenu}
              color="inherit"
              sx={{ ml: 2 }}
            >
              <Avatar>{user.name?.[0]}</Avatar>
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
              <MenuItem
                component={RouterLink}
                to="/profile"
                onClick={handleClose}
              >
                프로필
              </MenuItem>
              {user.role === 'admin' && (
                <MenuItem
                  component={RouterLink}
                  to="/admin/dashboard"
                  onClick={handleClose}
                >
                  관리자
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ ml: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/login"
              sx={{ mr: 1 }}
            >
              로그인
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/register"
              variant="outlined"
            >
              회원가입
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
