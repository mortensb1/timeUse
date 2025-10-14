import { useState } from 'react'
import {Button, Container, Typography} from "@mui/material";
import supabase from '../utils/supabase'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Container sx={{ textAlign: "center", mt: 5}}>
      <Typography variant="body1">Count: {count}</Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2}}
        onClick={() => setCount(count + 1)}
        >
          Increment
        </Button>
    </Container>
  )
}

export default App
