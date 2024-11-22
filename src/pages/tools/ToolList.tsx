import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  TextField,
  MenuItem,
  CardActions,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from 'react-query';
import { tools } from '../../services/api';

interface Tool {
  _id: string;
  name: string;
  description: string;
  category: string;
  usageCount: number;
}

interface ToolsResponse {
  tools: Tool[];
  total: number;
}

const ToolList: React.FC = () => {
  const [category, setCategory] = useState<string>('전체');
  const [sort, setSort] = useState<string>('latest');
  const [search, setSearch] = useState<string>('');

  const { data: toolsData } = useQuery<ToolsResponse>(
    ['tools', category, sort, search],
    () =>
      tools.getAll({
        page: 1,
        limit: 100,
        search: search || undefined,
      })
  );

  const categories = ['전체', '텍스트', '이미지', '코드', '데이터'];

  return (
    <Box>
      {/* 필터 및 검색 */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="카테고리"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="정렬"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="latest">최신순</MenuItem>
              <MenuItem value="popular">인기순</MenuItem>
              <MenuItem value="name">이름순</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="도구 이름 또는 설명으로 검색"
            />
          </Grid>
        </Grid>
      </Box>

      {/* 도구 목록 */}
      <Grid container spacing={3}>
        {toolsData?.tools.map((tool) => (
          <Grid item xs={12} sm={6} md={4} key={tool._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {tool.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {tool.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label={tool.category} size="small" />
                  <Chip
                    label={`${tool.usageCount}회 사용`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  component={RouterLink}
                  to={`/tools/${tool._id}`}
                  size="small"
                  color="primary"
                >
                  자세히 보기
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ToolList;
