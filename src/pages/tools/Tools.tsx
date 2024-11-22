import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as RunIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { tools } from '../../services/api';
import { Tool, ToolsResponse } from '../../types/tool';
import { useAuth } from '../../contexts/AuthContext';

interface Tool {
  id: string;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

const Tools: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [deleteToolId, setDeleteToolId] = useState<string | null>(null);

  // 도구 목록 조회
  const {
    data: toolsData,
    isLoading,
    error,
  } = useQuery<ToolsResponse>(['tools', search], () =>
    tools.getAll({ search, userId: user?.id })
  );

  // 도구 삭제
  const deleteToolMutation = useMutation<void, Error, string>(
    (toolId: string) => tools.delete(toolId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tools']);
        setDeleteToolId(null);
      },
    }
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleCreate = () => {
    navigate('/tools/create');
  };

  const handleEdit = (id: string) => {
    navigate(`/tools/${id}/edit`);
  };

  const handleRun = (id: string) => {
    navigate(`/tools/${id}/run`);
  };

  const handleDelete = async (toolId: string) => {
    try {
      await deleteToolMutation.mutateAsync(toolId);
    } catch (error) {
      console.error('Failed to delete tool:', error);
    }
  };

  const confirmDelete = () => {
    if (deleteToolId) {
      handleDelete(deleteToolId);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4">내 도구</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            새 도구 만들기
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="도구 검색..."
            value={search}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
            }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            도구 목록을 불러오는데 실패했습니다.
          </Alert>
        )}

        <Grid container spacing={3}>
          {toolsData?.tools.map((tool: Tool) => (
            <Grid item xs={12} sm={6} md={4} key={tool.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {tool.name}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {tool.description}
                  </Typography>
                  <Chip
                    label={tool.type}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    마지막 수정: {new Date(tool.updatedAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Tooltip title="실행">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleRun(tool.id)}
                    >
                      <RunIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="수정">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(tool.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="삭제">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteToolId(tool.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* 도구 삭제 확인 다이얼로그 */}
        <Dialog
          open={Boolean(deleteToolId)}
          onClose={() => setDeleteToolId(null)}
        >
          <DialogTitle>도구 삭제 확인</DialogTitle>
          <DialogContent>
            <Typography>
              정말로 이 도구를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteToolId(null)}>취소</Button>
            <Button
              onClick={confirmDelete}
              color="error"
              disabled={deleteToolMutation.isLoading}
            >
              삭제
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Tools;
