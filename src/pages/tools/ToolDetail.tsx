import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useQuery, useMutation } from 'react-query';
import { tools } from '../../services/api';
import { Tool, ExecuteResponse } from '../../types/tool';

const ToolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { data: tool, isLoading } = useQuery<Tool>(['tool', id], () =>
    tools.getById(id!)
  );

  const executeMutation = useMutation<ExecuteResponse, Error, Record<string, string>>(
    (inputData) => tools.execute(id!, inputData),
    {
      onSuccess: (data) => {
        setResult(data.result);
      },
      onError: (error) => {
        setError(error.message);
      },
    }
  );

  const handleInputChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputs((prev) => ({
      ...prev,
      [name]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    executeMutation.mutate(inputs);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!tool) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">도구를 찾을 수 없습니다.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* 도구 정보 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {tool.name}
        </Typography>
        <Typography variant="body1" paragraph>
          {tool.description}
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Chip label={tool.category} sx={{ mr: 1 }} />
          <Chip label={`${tool.usageCount}회 사용됨`} variant="outlined" />
        </Box>

        {/* 에러 메시지 */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit}>
          {tool.inputs.map((input) => (
            <TextField
              key={input.name}
              fullWidth
              label={input.description}
              value={inputs[input.name] || ''}
              onChange={handleInputChange(input.name)}
              required={input.required}
              type={input.type}
              margin="normal"
            />
          ))}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={executeMutation.isLoading}
            sx={{ mt: 2 }}
          >
            {executeMutation.isLoading ? '실행 중...' : '실행하기'}
          </Button>
        </form>
      </Paper>

      {/* 결과 표시 */}
      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            실행 결과
          </Typography>
          <Typography
            component="pre"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              bgcolor: 'grey.100',
              p: 2,
              borderRadius: 1,
            }}
          >
            {result}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ToolDetail;
