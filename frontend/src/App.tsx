/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { getEntries } from './api/entries/get-entries';
import { postEntry } from './api/entries/post-entries';
import { EntryResponse, EntryRequest } from './api/entries/types/entry';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


function App() {
  const [user, setUser] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [newEntry, setNewEntry] = useState('');
  const [isEntriesLoading, setIsEntriesLoading] = useState(false);
  const [entryList, setEntryList] = useState<EntryResponse[]>([]);


  async function getDiaryEntries() {
    setIsEntriesLoading(true);
    getEntries(user)
      .then((res) => {
        setEntryList(res.data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsEntriesLoading(false);
      });
  }

  async function addNewEntry() {
    const payload: EntryRequest = {
      username: user,
      value: newEntry,
    };
    postEntry(payload)
      .then(() => {
        getDiaryEntries();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    if (sessionStorage.getItem("userInfo")) {
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo")!);
      setUser(userInfo.username);
      setIsAuthenticated(true);
    }
    setIsAuthenticating(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getDiaryEntries();
    }
  }, [isAuthenticated]);

  if (isAuthenticating) {
    return <CircularProgress />;
  }

  if (!isAuthenticated) {
    return <LoginButton />;
  }

  return (
    <>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          Welcome, {user}!
        </Typography>
        <LogoutButton />
      </Stack>
      <hr />
      <Card variant="outlined" sx={{ bgcolor: 'ButtonShadow' }}>
        <CardContent>
          <Stack spacing={2}>
            <TextField variant="outlined" label="Diary entry" onChange={e => { setNewEntry(e.target.value) }} />
            <Button variant="contained" onClick={addNewEntry}>Add Entry</Button>
          </Stack>
        </CardContent>
      </Card>
      <hr />
      <Card variant="outlined" sx={{ bgcolor: 'ButtonHighlight' }}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <CardHeader title="My Diary Entries" />
          <CardActions>
            <Button onClick={getDiaryEntries}>Refresh</Button>
          </CardActions>
        </Stack>
        <CardContent>
          {
            isEntriesLoading
              ?
              <CircularProgress />
              :
              entryList.length === 0
                ?
                <Typography variant="body1">The user does not have any entries</Typography>
                :
                <List>
                  {entryList.map((entry) => {
                    return (
                      <ListItem key={entry.id}>
                        <ListItemText primary={entry.value} />
                      </ListItem>
                    );
                  })}
                </List>
          }
        </CardContent>
      </Card>
    </>
  );
}

function LoginButton() {
  const [username, setUsername] = useState('');

  function handleLogin() {
    sessionStorage.setItem('userInfo', JSON.stringify({ username }));
    window.location.reload();
  }

  return (
    <Container sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <TextField variant="outlined" label="Username" onChange={e => { setUsername(e.target.value) }} />
            <Button variant="contained" onClick={handleLogin}>Login</Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

function LogoutButton() {
  function handleLogout() {
    sessionStorage.removeItem('userInfo');
    window.location.reload();
  }

  return (
    <Button variant='outlined' onClick={handleLogout}>Logout</Button>
  );
}

export default App;
