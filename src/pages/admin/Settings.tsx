import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useQuery, useMutation } from 'react-query';
import { admin } from '../../services/api';

interface SystemSettings {
  maintenance: boolean;
  registrationEnabled: boolean;
  maxToolsPerUser: number;
  maxExecutionsPerDay: number;
  defaultUserRole: string;
  apiRateLimit: number;
  emailNotifications: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  backupEnabled: boolean;
  backupFrequency: number;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 시스템 설정 조회
  const { isLoading } = useQuery(
    ['adminSettings'],
    () => admin.getSettings(),
    {
      onSuccess: (data) => {
        setSettings(data);
      },
      onError: (err: any) => {
        setError(err.message || '설정을 불러오는데 실패했습니다.');
      },
    }
  );

  // 설정 업데이트
  const updateMutation = useMutation(
    (data: Partial<SystemSettings>) => admin.updateSettings(data),
    {
      onSuccess: () => {
        setSuccess('설정이 성공적으로 업데이트되었습니다.');
        setTimeout(() => setSuccess(''), 3000);
      },
      onError: (err: any) => {
        setError(err.message || '설정 업데이트에 실패했습니다.');
      },
    }
  );

  const handleChange = (field: keyof SystemSettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings) {
      updateMutation.mutate(settings);
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
        <Typography variant="h4" gutterBottom>
          시스템 설정
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* 시스템 상태 설정 */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    시스템 상태
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings?.maintenance || false}
                            onChange={(e) =>
                              handleChange('maintenance', e.target.checked)
                            }
                          />
                        }
                        label="유지보수 모드"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings?.registrationEnabled || false}
                            onChange={(e) =>
                              handleChange('registrationEnabled', e.target.checked)
                            }
                          />
                        }
                        label="회원가입 허용"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* 사용자 제한 설정 */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    사용자 제한
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="사용자당 최대 도구 수"
                        type="number"
                        value={settings?.maxToolsPerUser || 0}
                        onChange={(e) =>
                          handleChange(
                            'maxToolsPerUser',
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="일일 최대 실행 횟수"
                        type="number"
                        value={settings?.maxExecutionsPerDay || 0}
                        onChange={(e) =>
                          handleChange(
                            'maxExecutionsPerDay',
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>기본 사용자 역할</InputLabel>
                        <Select
                          value={settings?.defaultUserRole || 'user'}
                          label="기본 사용자 역할"
                          onChange={(e) =>
                            handleChange('defaultUserRole', e.target.value)
                          }
                        >
                          <MenuItem value="user">일반 사용자</MenuItem>
                          <MenuItem value="admin">관리자</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="API 요청 제한 (requests/minute)"
                        type="number"
                        value={settings?.apiRateLimit || 0}
                        onChange={(e) =>
                          handleChange('apiRateLimit', parseInt(e.target.value))
                        }
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* 시스템 설정 */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    시스템 설정
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>로그 레벨</InputLabel>
                        <Select
                          value={settings?.logLevel || 'info'}
                          label="로그 레벨"
                          onChange={(e) =>
                            handleChange('logLevel', e.target.value)
                          }
                        >
                          <MenuItem value="error">Error</MenuItem>
                          <MenuItem value="warn">Warning</MenuItem>
                          <MenuItem value="info">Info</MenuItem>
                          <MenuItem value="debug">Debug</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings?.emailNotifications || false}
                            onChange={(e) =>
                              handleChange(
                                'emailNotifications',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label="이메일 알림"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* 백업 설정 */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    백업 설정
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings?.backupEnabled || false}
                            onChange={(e) =>
                              handleChange('backupEnabled', e.target.checked)
                            }
                          />
                        }
                        label="자동 백업"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="백업 주기 (시간)"
                        type="number"
                        value={settings?.backupFrequency || 24}
                        onChange={(e) =>
                          handleChange(
                            'backupFrequency',
                            parseInt(e.target.value)
                          )
                        }
                        disabled={!settings?.backupEnabled}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={updateMutation.isLoading}
            >
              {updateMutation.isLoading ? '저장 중...' : '설정 저장'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Settings;
