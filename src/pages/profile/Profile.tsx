import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../contexts/AuthContext';
import { user, tools } from '../../services/api';

const Profile: React.FC = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 사용자의 도구 목록 조회
  const { data: userTools } = useQuery(['userTools'], () =>
    tools.getAll({ userId: currentUser?.id })
  );

  // 프로필 업데이트
  const updateProfileMutation = useMutation(
    (data: { name: string; email: string }) => user.updateProfile(data),
    {
      onSuccess: () => {
        setEditing(false);
        setSuccess('프로필이 업데이트되었습니다.');
        queryClient.invalidateQueries(['auth']);
      },
      onError: (err: any) => {
        setError(err.message || '프로필 업데이트에 실패했습니다.');
      },
    }
  );

  // 비밀번호 변경
  const changePasswordMutation = useMutation(
    (data: { currentPassword: string; newPassword: string }) =>
      user.changePassword(data),
    {
      onSuccess: () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccess('비밀번호가 변경되었습니다.');
      },
      onError: (err: any) => {
        setError(err.message || '비밀번호 변경에 실패했습니다.');
      },
    }
  );

  // 계정 삭제
  const deleteAccountMutation = useMutation(() => user.deleteAccount(), {
    onSuccess: () => {
      window.location.href = '/login';
    },
    onError: (err: any) => {
      setError(err.message || '계정 삭제에 실패했습니다.');
    },
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ name, email });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
    });
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          프로필 설정
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">프로필 정보</Typography>
                  <IconButton
                    onClick={() => setEditing(!editing)}
                    color={editing ? 'error' : 'primary'}
                  >
                    {editing ? <CancelIcon /> : <EditIcon />}
                  </IconButton>
                </Box>

                <form onSubmit={handleUpdateProfile}>
                  <TextField
                    fullWidth
                    label="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!editing}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!editing}
                    sx={{ mb: 2 }}
                  />
                  {editing && (
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={updateProfileMutation.isLoading}
                    >
                      저장
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  비밀번호 변경
                </Typography>
                <form onSubmit={handleChangePassword}>
                  <TextField
                    fullWidth
                    type="password"
                    label="현재 비밀번호"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="새 비밀번호"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="새 비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={changePasswordMutation.isLoading}
                  >
                    비밀번호 변경
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  내 도구 목록
                </Typography>
                {userTools?.length > 0 ? (
                  <List>
                    {userTools.map((tool: any) => (
                      <ListItem
                        key={tool.id}
                        secondaryAction={
                          <Tooltip title="도구 편집">
                            <IconButton
                              edge="end"
                              onClick={() =>
                                (window.location.href = `/tools/${tool.id}/edit`)
                              }
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        }
                      >
                        <ListItemText
                          primary={tool.name}
                          secondary={tool.description}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="textSecondary">
                    아직 만든 도구가 없습니다.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="error">
                  계정 삭제
                </Typography>
                <Typography color="textSecondary" paragraph>
                  계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수
                  없습니다.
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setShowDeleteDialog(true)}
                >
                  계정 삭제
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 계정 삭제 확인 다이얼로그 */}
        <Dialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        >
          <DialogTitle>계정 삭제 확인</DialogTitle>
          <DialogContent>
            <Typography paragraph>
              정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든
              데이터가 영구적으로 삭제됩니다.
            </Typography>
            <TextField
              fullWidth
              type="password"
              label="비밀번호 확인"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)}>취소</Button>
            <Button
              onClick={handleDeleteAccount}
              color="error"
              disabled={deleteAccountMutation.isLoading}
            >
              삭제
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Profile;
