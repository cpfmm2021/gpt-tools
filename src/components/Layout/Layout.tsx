import React from 'react';
import { Container, Box } from '@mui/material';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
      {/* AdMob 광고 컴포넌트는 나중에 추가 */}
    </Box>
  );
};

export default Layout;
