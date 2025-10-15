import { useState } from 'react'
import { Button, Container, Typography } from "@mui/material";
import supabase from '../utils/supabase'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  async function uploadTime(amount_people: number, hours: number) {
    const { error } = await supabase
      .from("time")
      .insert({ time_used: 10 })
    if (error) {
      console.log("ERROR:", error)
    }
    const { data } = await supabase
      .from("time")
      .select()
    console.log(data)
  }

  return (
    <Container sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="body1">Count: {count}</Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => uploadTime(1, 1)}
      >
        Increment
      </Button>
    </Container>
  )
}

export default App
