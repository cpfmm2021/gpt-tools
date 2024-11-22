import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useQuery, useMutation } from 'react-query';
import { tools } from '../../services/api';
import { Tool, InputField } from '../../types';

const categories = [
  '텍스트 생성',
  '코드',
  '번역',
  '분석',
  '요약',
  '기타',
];

const defaultInputField: InputField = {
  name: '',
  type: 'text',
  label: '',
  placeholder: '',
  required: true,
  options: [],
};

const ToolForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // 폼 상태
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [inputFields, setInputFields] = useState<InputField[]>([]);
  const [error, setError] = useState('');

  // 기존 도구 정보 조회
  const { data: tool } = useQuery<Tool>(
    ['tool', id],
    () => tools.getById(id!),
    {
      enabled: isEdit,
    }
  );

  // 도구 생성/수정
  const mutation = useMutation(
    (data: Partial<Tool>) =>
      isEdit ? tools.update(id!, data) : tools.create(data),
    {
      onSuccess: () => {
        navigate('/tools');
      },
      onError: (err: any) => {
        setError(err.message || '도구 저장 중 오류가 발생했습니다.');
      },
    }
  );

  // 기존 도구 정보로 폼 초기화
  useEffect(() => {
    if (tool) {
      setTitle(tool.title);
      setDescription(tool.description);
      setCategory(tool.category);
      setPrompt(tool.prompt);
      setIsPublic(tool.isPublic);
      setInputFields(tool.inputFields);
    }
  }, [tool]);

  const handleAddInputField = () => {
    setInputFields([...inputFields, { ...defaultInputField }]);
  };

  const handleRemoveInputField = (index: number) => {
    setInputFields(inputFields.filter((_, i) => i !== index));
  };

  const handleInputFieldChange = (
    index: number,
    field: keyof InputField,
    value: any
  ) => {
    const newFields = [...inputFields];
    newFields[index] = { ...newFields[index], [field]: value };
    setInputFields(newFields);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    if (!title || !description || !category || !prompt) {
      setError('모든 필수 항목을 입력해주세요.');
      return;
    }

    if (inputFields.length === 0) {
      setError('최소 하나의 입력 필드가 필요합니다.');
      return;
    }

    // 입력 필드 유효성 검사
    const invalidField = inputFields.find(
      (field) => !field.name || !field.label
    );
    if (invalidField) {
      setError('모든 입력 필드의 이름과 레이블을 입력해주세요.');
      return;
    }

    mutation.mutate({
      title,
      description,
      category,
      prompt,
      isPublic,
      inputFields,
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEdit ? '도구 수정' : '새 도구 만들기'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                기본 정보
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="제목"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="설명"
                    required
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>카테고리</InputLabel>
                    <Select
                      value={category}
                      label="카테고리"
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                      />
                    }
                    label="공개"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="프롬프트"
                    required
                    multiline
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    helperText="입력 필드의 값은 {{field_name}} 형식으로 참조할 수 있습니다."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">입력 필드</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddInputField}
                >
                  필드 추가
                </Button>
              </Box>

              {inputFields.map((field, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: 1,
                    borderColor: 'grey.300',
                    borderRadius: 1,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="필드 이름"
                        required
                        value={field.name}
                        onChange={(e) =>
                          handleInputFieldChange(index, 'name', e.target.value)
                        }
                        helperText="영문, 숫자, 언더스코어만 사용"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="레이블"
                        required
                        value={field.label}
                        onChange={(e) =>
                          handleInputFieldChange(index, 'label', e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>타입</InputLabel>
                        <Select
                          value={field.type}
                          label="타입"
                          onChange={(e) =>
                            handleInputFieldChange(index, 'type', e.target.value)
                          }
                        >
                          <MenuItem value="text">텍스트</MenuItem>
                          <MenuItem value="textarea">텍스트 영역</MenuItem>
                          <MenuItem value="select">선택</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="플레이스홀더"
                        value={field.placeholder || ''}
                        onChange={(e) =>
                          handleInputFieldChange(
                            index,
                            'placeholder',
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.required}
                            onChange={(e) =>
                              handleInputFieldChange(
                                index,
                                'required',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label="필수"
                      />
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveInputField(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/tools')}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={mutation.isLoading}
            >
              {isEdit ? '수정' : '생성'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default ToolForm;
