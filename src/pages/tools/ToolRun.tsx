import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { useQuery, useMutation } from 'react-query';
import { tools } from '../../services/api';
import { Tool, InputField } from '../../types';

const ToolRun: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState('');

  // 도구 정보 조회
  const {
    data: tool,
    isLoading,
    error: loadError,
  } = useQuery<Tool>(['tool', id], () => tools.getById(id!));

  // 도구 실행
  const runMutation = useMutation(
    (input: Record<string, any>) => tools.run(id!, input),
    {
      onSuccess: (data) => {
        setResult(data.result);
        setError('');
      },
      onError: (err: any) => {
        setError(err.message || '도구 실행 중 오류가 발생했습니다.');
      },
    }
  );

  const handleInputChange = (field: InputField, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [field.name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 필수 입력값 검사
    const missingFields = tool?.inputFields
      .filter((field) => field.required && !inputs[field.name])
      .map((field) => field.label);

    if (missingFields?.length) {
      setError(`다음 필드를 입력해주세요: ${missingFields.join(', ')}`);
      return;
    }

    runMutation.mutate(inputs);
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

  if (loadError || !tool) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">
            도구를 불러오는데 실패했습니다.
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/tools')}
            sx={{ mt: 2 }}
          >
            도구 목록으로 돌아가기
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          {tool.title}
        </Typography>
        <Typography color="textSecondary" paragraph>
          {tool.description}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  입력
                </Typography>
                <form onSubmit={handleSubmit}>
                  {tool.inputFields.map((field) => (
                    <Box key={field.name} sx={{ mb: 2 }}>
                      {field.type === 'select' ? (
                        <FormControl fullWidth required={field.required}>
                          <InputLabel>{field.label}</InputLabel>
                          <Select
                            value={inputs[field.name] || ''}
                            label={field.label}
                            onChange={(e) =>
                              handleInputChange(field, e.target.value)
                            }
                          >
                            {field.options?.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          fullWidth
                          label={field.label}
                          placeholder={field.placeholder}
                          required={field.required}
                          multiline={field.type === 'textarea'}
                          rows={field.type === 'textarea' ? 4 : 1}
                          value={inputs[field.name] || ''}
                          onChange={(e) =>
                            handleInputChange(field, e.target.value)
                          }
                        />
                      )}
                    </Box>
                  ))}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={runMutation.isLoading}
                  >
                    {runMutation.isLoading ? '실행 중...' : '실행'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  결과
                </Typography>
                {result ? (
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: 'grey.50',
                      minHeight: '200px',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {result}
                  </Paper>
                ) : (
                  <Typography color="textSecondary">
                    도구를 실행하면 여기에 결과가 표시됩니다.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ToolRun;
