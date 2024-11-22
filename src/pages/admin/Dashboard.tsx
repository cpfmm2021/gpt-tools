import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import {
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Build as BuildIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { admin } from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard: React.FC = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // 대시보드 통계 데이터 조회
  const { data: stats } = useQuery(['adminStats'], () =>
    admin.getStats()
  );

  // 최근 사용자 활동 조회
  const { data: recentActivity } = useQuery(['adminRecentActivity'], () =>
    admin.getRecentActivity()
  );

  // 시스템 상태 조회
  const { data: systemStatus } = useQuery(
    ['adminSystemStatus'],
    () => admin.getSystemStatus(),
    {
      refetchInterval: 30000, // 30초마다 갱신
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          관리자 대시보드
        </Typography>

        {/* 통계 카드 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <PeopleIcon
                    sx={{ fontSize: 40, color: 'primary.main', mr: 2 }}
                  />
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      총 사용자
                    </Typography>
                    <Typography variant="h4">
                      {stats?.totalUsers || 0}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  color={stats?.userGrowth > 0 ? 'success.main' : 'error.main'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <TrendingUpIcon sx={{ mr: 0.5 }} />
                  {stats?.userGrowth}% 증가
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <BuildIcon
                    sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }}
                  />
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      총 도구
                    </Typography>
                    <Typography variant="h4">
                      {stats?.totalTools || 0}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  color="textSecondary"
                >
                  활성 도구: {stats?.activeTools || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <SpeedIcon
                    sx={{ fontSize: 40, color: 'success.main', mr: 2 }}
                  />
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      실행 횟수
                    </Typography>
                    <Typography variant="h4">
                      {stats?.totalExecutions || 0}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  오늘: {stats?.todayExecutions || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <CheckCircleIcon
                    sx={{ fontSize: 40, color: 'info.main', mr: 2 }}
                  />
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      성공률
                    </Typography>
                    <Typography variant="h4">
                      {stats?.successRate || 0}%
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats?.successRate || 0}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 차트와 활동 로그 */}
        <Grid container spacing={3}>
          {/* 사용량 차트 */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  일일 사용량
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.dailyUsage || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar
                        dataKey="executions"
                        fill="#1976d2"
                        name="실행 횟수"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 시스템 상태 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  시스템 상태
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="CPU 사용량"
                      secondary={
                        <LinearProgress
                          variant="determinate"
                          value={systemStatus?.cpuUsage || 0}
                          sx={{ mt: 1 }}
                        />
                      }
                    />
                    <Typography variant="body2">
                      {systemStatus?.cpuUsage}%
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="메모리 사용량"
                      secondary={
                        <LinearProgress
                          variant="determinate"
                          value={systemStatus?.memoryUsage || 0}
                          sx={{ mt: 1 }}
                        />
                      }
                    />
                    <Typography variant="body2">
                      {systemStatus?.memoryUsage}%
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="API 응답 시간"
                      secondary={`${systemStatus?.apiLatency || 0}ms`}
                    />
                    {systemStatus?.apiStatus === 'healthy' ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <WarningIcon color="error" />
                    )}
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* 최근 활동 */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  최근 활동
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>사용자</TableCell>
                        <TableCell>활동</TableCell>
                        <TableCell>도구</TableCell>
                        <TableCell>상태</TableCell>
                        <TableCell>시간</TableCell>
                        <TableCell>작업</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(recentActivity || [])
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((activity: any) => (
                          <TableRow key={activity.id}>
                            <TableCell>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <ListItemAvatar>
                                  <Avatar>
                                    {activity.user.name.charAt(0)}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={activity.user.name}
                                  secondary={activity.user.email}
                                />
                              </Box>
                            </TableCell>
                            <TableCell>{activity.action}</TableCell>
                            <TableCell>{activity.tool?.title}</TableCell>
                            <TableCell>
                              {activity.status === 'success' ? (
                                <CheckCircleIcon color="success" />
                              ) : (
                                <WarningIcon color="error" />
                              )}
                            </TableCell>
                            <TableCell>
                              {new Date(
                                activity.timestamp
                              ).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Tooltip title="사용자 차단">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    // 사용자 차단 처리
                                  }}
                                >
                                  <BlockIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={recentActivity?.length || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
