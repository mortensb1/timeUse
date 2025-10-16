// import { useState } from 'react'
import * as React from "react";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { Button, Container, Typography, TextField } from "@mui/material";
import supabase from '../utils/supabase'
import './App.css'

function App() {
  const [timeStart, setTimeStart] = React.useState<Dayjs | null>();
  const [timeEnd, setTimeEnd] = React.useState<Dayjs | null>();
  const [amountPeople, setAmountPeople] = React.useState<number>();


  async function uploadTime() {
    const { error } = await supabase
      .from("time")
      .insert({ hours_used: Number(timeEnd?.diff(timeStart, 'minute'))/60, people: amountPeople, time_start: timeStart, time_end: timeEnd })
    if (error) {
      console.log("ERROR:", error)
    }
  }

  async function getValues(): Promise<any[] | null> {
    const { error, data } = await supabase
      .from("time")
      .select()

    if (error) {
      console.log("Error:", error)
    }

    return data
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container sx={{ textAlign: "center", }}>
          <Typography variant="h3" sx={{ 
            position: "fixed",
            top: 10,
            left: 0,
            width: "100%",
            textAlign: "center",
            }}>Trænings tid</Typography>
        <Container sx={{ textAlign: "center", mt: 5 }}>
          <DesktopTimePicker 
            label="Start tid" 
            ampm={false} 
            sx={{ mt: 5, mb: 2 }} 
            onChange={(newValue) => {
              setTimeStart(newValue)
            }}
          />
          <DesktopTimePicker 
            label="Slut tid" 
            ampm={false} 
            sx={{ mb: 4 }}
            onChange={(newValue) => {
              setTimeEnd(newValue)
            }}
            />
            <TextField
              label="Antal mennesker"
              type="number"
              value={amountPeople}
              onChange={(e) => setAmountPeople(Number(e.target.value))}
              sx={{ width: 250 }}
            />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            onClick={() => uploadTime()}
            >
            Tilføj tid
          </Button>
        </Container>
      </Container>
    </LocalizationProvider>
  )
}

export default App
