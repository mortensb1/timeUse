import { useState } from 'react'
import { Button, Container, Typography, TimePicker } from "@mui/material";
import dayjs from 'dayjs'
import supabase from '../utils/supabase'
import './App.css'

function App() {
  async function uploadTime(amount_people: number, hours: number) {
    const { error } = await supabase
      .from("time")
      .insert({ time_used: hours, people: amount_people })
    if (error) {
      console.log("ERROR:", error)
    }
  }

  async function getValues() {
    const { error, data } = await supabase
      .from("time")
      .select()

    if (error) {
      console.log("Error:", error)
    }

    return data
  }

  return (
    <Container sx={{ textAlign: "center", mt: 5 }}>
      <TimePicker label="test" />
      <Typography variant="body1">Count: </Typography>
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
