import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider,
  Card,
  CardContent,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  DoneAll as DoneAllIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { format } from 'date-fns';
import { user } from '../../services/api';

interface Notification {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  createdAt: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  // 알림 목록 조회
  const { data: notifications, isLoading } = useQuery(
    ['notifications'],
    () => user.getNotifications()
  );

  // 알림 읽음 처리
  const markAsReadMutation = useMutation(
    (notificationId: string) => user.markNotificationAsRead(notificationId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications']);
      },
      onError: (err: any) => {
        setError(err.message || '알림 읽음 처리 중 오류가 발생했습니다.');
      },
    }
  );

  // 알림 삭제
  const deleteNotificationMutation = useMutation(
    (notificationId: string) => user.deleteNotification(notificationId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications']);
      },
      onError: (err: any) => {
        setError(err.message || '알림 삭제 중 오류가 발생했습니다.');
      },
    }
  );

  // 모든 알림 읽음 처리
  const markAllAsReadMutation = useMutation(
    () => user.markAllNotificationsAsRead(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications']);
      },
      onError: (err: any) => {
        setError(
          err.message || '모든 알림 읽음 처리 중 오류가 발생했습니다.'
        );
      },
    }
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      default:
        return <InfoIcon color="info" />;
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

  const unreadCount = notifications?.items.filter(
    (n: Notification) => !n.read
  ).length;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4">알림</Typography>
            {unreadCount > 0 && (
              <Chip
                label={`읽지 않은 알림 ${unreadCount}개`}
                color="primary"
              />
            )}
          </Box>
          {unreadCount > 0 && (
            <Button
              startIcon={<DoneAllIcon />}
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isLoading}
            >
              모두 읽음 처리
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card>
          <List>
            {notifications?.items.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        py: 4,
                      }}
                    >
                      <NotificationsIcon
                        sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                      />
                      <Typography color="textSecondary">
                        알림이 없습니다.
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ) : (
              notifications?.items.map((notification: Notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      bgcolor: notification.read
                        ? 'inherit'
                        : 'action.hover',
                    }}
                  >
                    <ListItemIcon>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.message}
                      secondary={format(
                        new Date(notification.createdAt),
                        'yyyy-MM-dd HH:mm:ss'
                      )}
                    />
                    <ListItemSecondaryAction>
                      {!notification.read && (
                        <Tooltip title="읽음 처리">
                          <IconButton
                            edge="end"
                            onClick={() =>
                              markAsReadMutation.mutate(notification.id)
                            }
                            disabled={markAsReadMutation.isLoading}
                            sx={{ mr: 1 }}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="삭제">
                        <IconButton
                          edge="end"
                          onClick={() =>
                            deleteNotificationMutation.mutate(
                              notification.id
                            )
                          }
                          disabled={deleteNotificationMutation.isLoading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))
            )}
          </List>
        </Card>
      </Box>
    </Container>
  );
};

export default Notifications;
