import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Alert,
} from '@mui/material';
import {
  Block as BlockIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { admin } from '../../services/api';
import { UsersResponse } from '../../types/admin';
import { User } from '../../types/user';

const Users: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 사용자 목록 조회
  const {
    data: usersData,
    isLoading,
    error: queryError,
  } = useQuery<UsersResponse>(['adminUsers', page, rowsPerPage, search], () =>
    admin.getUsers({
      page: page + 1,
      limit: rowsPerPage,
      search,
    })
  );

  if (queryError) {
    setError(queryError.message || '사용자 목록 조회 중 오류가 발생했습니다.');
  }

  // 사용자 수정
  const updateUserMutation = useMutation<User, Error, { userId: string; userData: Partial<User> }>(
    ({ userId, userData }) => admin.updateUser(userId, userData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['adminUsers']);
        setEditingUser(null);
        setSuccess('사용자 정보가 업데이트되었습니다.');
      },
      onError: (err: any) => {
        setError(err.message || '사용자 수정 중 오류가 발생했습니다.');
      },
    }
  );

  // 사용자 삭제
  const deleteUserMutation = useMutation<void, Error, string>(
    (userId) => admin.deleteUser(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['adminUsers']);
        setDeleteUserId(null);
        setSuccess('사용자가 삭제되었습니다.');
      },
      onError: (err: any) => {
        setError(err.message || '사용자 삭제 중 오류가 발생했습니다.');
      },
    }
  );

  // 사용자 차단/차단 해제
  const toggleBlockMutation = useMutation<void, Error, { userId: string; blocked: boolean }>(
    ({ userId, blocked }) =>
      blocked ? admin.unblockUser(userId) : admin.blockUser(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['adminUsers']);
        setSuccess('사용자 상태가 변경되었습니다.');
      },
      onError: (err: any) => {
        setError(
          err.message || '사용자 상태 변경 중 오류가 발생했습니다.'
        );
      },
    }
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(0);
  };

  const handleUpdateUser = (data: Partial<User>) => {
    if (editingUser) {
      updateUserMutation.mutate({
        userId: editingUser.id,
        userData: data,
      });
    }
  };

  const handleDeleteUser = () => {
    if (deleteUserId) {
      deleteUserMutation.mutate(deleteUserId);
    }
  };

  const handleToggleBlock = (user: User) => {
    toggleBlockMutation.mutate({
      userId: user.id,
      blocked: user.blocked,
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          사용자 관리
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

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <form onSubmit={handleSearch}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                }}
              >
                <TextField
                  fullWidth
                  placeholder="이름 또는 이메일로 검색"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ minWidth: 100 }}
                >
                  검색
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>사용자</TableCell>
                <TableCell>역할</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>가입일</TableCell>
                <TableCell>마지막 접속</TableCell>
                <TableCell>작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersData?.items.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2 }}>
                        {user.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">
                          {user.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                        >
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={user.role === 'admin' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={
                        user.blocked ? (
                          <BlockIcon />
                        ) : (
                          <CheckCircleIcon />
                        )
                      }
                      label={user.blocked ? '차단됨' : '활성'}
                      color={user.blocked ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleString()
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="수정">
                        <IconButton
                          size="small"
                          onClick={() => setEditingUser(user)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={user.blocked ? '차단 해제' : '차단'}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleToggleBlock(user)}
                        >
                          <BlockIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="삭제">
                        <IconButton
                          size="small"
                          onClick={() => setDeleteUserId(user.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={usersData?.total || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        {/* 사용자 수정 다이얼로그 */}
        <Dialog
          open={Boolean(editingUser)}
          onClose={() => setEditingUser(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>사용자 수정</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="이름"
                value={editingUser?.name || ''}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="이메일"
                value={editingUser?.email || ''}
                disabled
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>역할</InputLabel>
                <Select
                  value={editingUser?.role || ''}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  label="역할"
                >
                  <MenuItem value="user">일반 사용자</MenuItem>
                  <MenuItem value="admin">관리자</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingUser(null)}>취소</Button>
            <Button
              onClick={() => handleUpdateUser(editingUser)}
              variant="contained"
              disabled={updateUserMutation.isLoading}
            >
              저장
            </Button>
          </DialogActions>
        </Dialog>

        {/* 사용자 삭제 확인 다이얼로그 */}
        <Dialog
          open={Boolean(deleteUserId)}
          onClose={() => setDeleteUserId(null)}
        >
          <DialogTitle>사용자 삭제 확인</DialogTitle>
          <DialogContent>
            <Typography>
              사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 사용자의
              모든 데이터가 삭제됩니다.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteUserId(null)}>취소</Button>
            <Button
              onClick={handleDeleteUser}
              color="error"
              disabled={deleteUserMutation.isLoading}
            >
              삭제
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Users;
