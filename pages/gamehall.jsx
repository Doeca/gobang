import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import GrainIcon from '@mui/icons-material/Grain';
import { pink } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Appbar from '../components/Appbar';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ResponsiveGrid() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Appbar />
      <Box sx={{ flexGrow: 1 }}>
        <Stack spacing={2} sx={{ width: 300 }}>
          <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            options={top100Films.map((option) => option.title)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="搜索房间"
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          />
        </Stack>
        <Grid
          container
          spacing={{ xs: 1, md: 3 }}
          columns={{ xs: 6, sm: 8, md: 12 }}
        >
          <Grid item xs={2}>
            <Item>
              <Typography
                sx={{ display: 'flex', alignItems: 'center' }}
                color="text.primary"
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="large" color="primary" />
                房间号
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={2}>
            <Item>
              <Typography
                sx={{ display: 'flex', alignItems: 'center' }}
                color="text.primary"
              >
                <WhatshotIcon
                  sx={({ mr: 0.5 }, { color: pink[500] })}
                  fontSize="large"
                />
                房间人数
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={2}>
            <Item>
              {' '}
              <Typography
                sx={{ display: 'flex', alignItems: 'center' }}
                color="text.primary"
              >
                <GrainIcon sx={{ mr: 0.5 }} fontSize="large" />
                房间状态
              </Typography>
            </Item>
          </Grid>
        </Grid>
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
const columns = [
  { id: 'roomcode', minWidth: 100 },
  {
    id: 'roomnumber',
    minWidth: 100,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'population',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
];
function createData(roomcode, roomnumber, population) {
  return { roomcode, roomnumber, population };
}
const rows = [
  createData('001', '0', '空闲中'),
  createData('002', '1', '等待中'),
  createData('003', '2', '游戏中'),
  createData('004', '3', '观战中'),
  createData('005', '6', '观战中'),
  createData('006', '0', '空闲中'),
  createData('007', '1', '等待中'),
];

const top100Films = [
  { title: '001' },
  { title: '002' },
  { title: '003' },
  { title: '004' },
  { title: '005' },
  { title: '006' },
  { title: '007' },
  { title: '008' },
  { title: '009' },
  { title: '010' },
  { title: '011' },
  { title: '012' },
  { title: '013' },
  { title: '014' },
  { title: '015' },
];
