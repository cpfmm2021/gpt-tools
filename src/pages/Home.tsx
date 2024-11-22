import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useQuery } from 'react-query';
import { tools } from '../services/api';
import { Tool, ToolsResponse } from '../types/tool';
import { useAuth } from '../contexts/AuthContext';

// 개발 모드용 더미 데이터
const mockTools: Tool[] = [
  {
    id: '1',
    name: '텍스트 요약',
    description: '긴 텍스트를 핵심 내용만 간단하게 요약해주는 도구입니다.',
    type: 'text',
    usageCount: 0,
    inputs: [{ name: 'text', type: 'text', required: true }],
  },
  {
    id: '2',
    name: '이미지 생성',
    description: '텍스트 설명을 바탕으로 AI가 이미지를 생성해주는 도구입니다.',
    type: 'image',
    usageCount: 0,
    inputs: [{ name: 'prompt', type: 'text', required: true }],
  },
  {
    id: '3',
    name: '코드 리뷰',
    description: 'AI가 코드를 분석하고 개선점을 제안해주는 도구입니다.',
    type: 'code',
    usageCount: 0,
    inputs: [{ name: 'code', type: 'code', required: true }],
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const { data: response, error, isLoading, isError } = useQuery<ToolsResponse>(
    'tools',
    () => tools.getAll({ limit: 6 }),
    {
      retry: isDevelopment ? 0 : 1,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
      // 개발 모드에서는 에러 시 더미 데이터 사용
      placeholderData: isDevelopment ? { tools: mockTools } : undefined,
    }
  );

  const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {tool.name}
        </Typography>
        <Typography>{tool.description}</Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => navigate(`/tools/${tool.id}`)}
        >
          자세히 보기
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          pt: 8,
          pb: 6,
          textAlign: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          color="text.primary"
          gutterBottom
        >
          GPT Tools Platform
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          AI 기반 도구들을 손쉽게 사용해보세요.
          다양한 작업을 자동화하고 생산성을 높일 수 있습니다.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate(user ? '/tools' : '/login')}
          sx={{ mt: 4 }}
        >
          {user ? '도구 둘러보기' : '시작하기'}
        </Button>
      </Box>

      {/* Featured Tools Section */}
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          인기 도구
        </Typography>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : isError && !isDevelopment ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            현재 서버 점검 중입니다. 잠시 후 다시 시도해주세요.
          </Alert>
        ) : response?.tools && response.tools.length > 0 ? (
          <Grid container spacing={4}>
            {response.tools.map((tool) => (
              <Grid item key={tool.id} xs={12} sm={6} md={4}>
                <ToolCard tool={tool} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            아직 등록된 도구가 없습니다.
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default Home;
