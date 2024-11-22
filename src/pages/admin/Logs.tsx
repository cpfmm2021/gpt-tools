import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  GetApp as DownloadIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useQuery, useMutation } from 'react-query';
import { admin } from '../../services/api';
import { format } from 'date-fns';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  source: string;
  userId?: string;
  metadata?: any;
}

interface LogFilter {
  startDate?: string;
  endDate?: string;
  level?: string;
  source?: string;
  search?: string;
}

const Logs: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState<LogFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState('');

  // 로그 데이터 조회
  const {
    data: logs,
    isLoading,
    refetch,
  } = useQuery(['adminLogs', page, rowsPerPage, filters], () =>
    admin.getLogs({ page: page + 1, limit: rowsPerPage, ...filters })
  );

  // 로그 삭제
  const deleteMutation = useMutation(
    (dates: { startDate: string; endDate: string }) =>
      admin.deleteLogs(dates),
    {
      onSuccess: () => {
        refetch();
      },
      onError: (err: any) => {
        setError(err.message || '로그 삭제에 실패했습니다.');
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

  const handleFilterChange = (field: keyof LogFilter, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
    setPage(0);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleDownload = async () => {
    try {
      const data = await admin.downloadLogs(filters);
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || '로그 다운로드에 실패했습니다.');
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        '선택한 기간의 로그를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
      )
    ) {
      deleteMutation.mutate({
        startDate: filters.startDate || '',
        endDate: filters.endDate || '',
      });
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'error';
      case 'warn':
        return 'warning';
      case 'info':
        return 'info';
      case 'debug':
        return 'default';
      default:
        return 'default';
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
          <Typography variant="h4">시스템 로그</Typography>
          <Box>
            <Tooltip title="새로고침">
              <IconButton onClick={handleRefresh} sx={{ mr: 1 }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="다운로드">
              <IconButton onClick={handleDownload} sx={{ mr: 1 }}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="삭제">
              <IconButton
                onClick={handleDelete}
                color="error"
                sx={{ mr: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="필터">
              <IconButton
                onClick={() => setShowFilters(!showFilters)}
                color={showFilters ? 'primary' : 'default'}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {showFilters && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="시작일"
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) =>
                      handleFilterChange('startDate', e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="종료일"
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) =>
                      handleFilterChange('endDate', e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>로그 레벨</InputLabel>
                    <Select
                      value={filters.level || ''}
                      label="로그 레벨"
                      onChange={(e) =>
                        handleFilterChange('level', e.target.value)
                      }
                    >
                      <MenuItem value="">전체</MenuItem>
                      <MenuItem value="error">Error</MenuItem>
                      <MenuItem value="warn">Warning</MenuItem>
                      <MenuItem value="info">Info</MenuItem>
                      <MenuItem value="debug">Debug</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="검색"
                    value={filters.search || ''}
                    onChange={(e) =>
                      handleFilterChange('search', e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>시간</TableCell>
                <TableCell>레벨</TableCell>
                <TableCell>소스</TableCell>
                <TableCell>메시지</TableCell>
                <TableCell>사용자 ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs?.items.map((log: LogEntry) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.level.toUpperCase()}
                      size="small"
                      color={getLevelColor(log.level) as any}
                    />
                  </TableCell>
                  <TableCell>{log.source}</TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell>{log.userId || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={logs?.total || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Logs;
