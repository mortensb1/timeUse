// import { useState } from 'react'
import * as React from "react";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Button, 
  Container, 
  Typography, 
  TextField, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, 
  Paper} from "@mui/material";
import supabase from '../utils/supabase'
import './App.css'

function App() {
  const [timeStart, setTimeStart] = React.useState<Dayjs | null>();
  const [timeEnd, setTimeEnd] = React.useState<Dayjs | null>();
  const [amountPeople, setAmountPeople] = React.useState<number>();
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs());

  const [values, setValues] = React.useState<any[] | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      const result = await getValues();
      setValues(result);
    }
    fetchData();
  }, []);


  async function uploadTime() {
    const { error } = await supabase
      .from("time")
      .insert({ hours_used: Number(timeEnd?.diff(timeStart, 'minute'))/60, people: amountPeople, time_start: timeStart, time_end: timeEnd, date: selectedDate })
    if (error) {
      console.log("ERROR:", error)
    }

    var data = await getValues()
    console.log(data)
  }

  async function getValues(): Promise<any[] | null> {
    const { error, data } = await supabase
      .from("time")
      .select()
      .order("created_at", { ascending: false })
      .limit(15);

    if (error) {
      console.log("Error:", error)
    }
    return data
  }

  // const data = await getValues()

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container sx={{ textAlign: "center", }}>
          <Typography variant="h3" sx={{ 
            top: 10,
            left: 0,
            width: "100%",
            textAlign: "center",
            }}>Trænings tid</Typography>
        <Container sx={{ textAlign: "center", mt: 1 }}>
          <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          sx={{ mt: 2 }}
        />
          <Container>
            <DesktopTimePicker 
              label="Start tid" 
              ampm={false} 
              sx={{ mt: 5, mb: 2 }} 
              onChange={(newValue) => {
                setTimeStart(newValue)
              }}
            />
          </Container>
          <Container>
            <DesktopTimePicker 
              label="Slut tid" 
              ampm={false} 
              sx={{ mb: 4 }}
              onChange={(newValue) => {
                setTimeEnd(newValue)
              }}
            />
          </Container>
            <Container>
              <TextField
              label="Antal mennesker"
              type="number"
              onChange={(e) => setAmountPeople(Number(e.target.value))}
              sx={{ width: 250 }}
            />
            </Container>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            onClick={() => uploadTime()}
            >
            Tilføj tid
          </Button>


          <Typography variant="h4" sx={{ mt: 3, mb: 3, textAlign: "center" }}>
            Time Entries
          </Typography>
          {/*  */}
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, px:0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Id</b></TableCell>
              <TableCell><b>Tid Start</b></TableCell>
              <TableCell><b>Tid Slut</b></TableCell>
              <TableCell><b>Timer</b></TableCell>
              <TableCell><b>Antal</b></TableCell>
              <TableCell><b>Dato</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {values?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{dayjs(item.time_start).format("HH:mm")}</TableCell>
                <TableCell>{dayjs(item.time_end).format("HH:mm")}</TableCell>
                <TableCell>{item.hours_used}</TableCell>
                <TableCell>{item.people}</TableCell>
                <TableCell>{dayjs(item.time_end).format("MM-DD")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
          {/*  */}
        </Container>
      </Container>
    </LocalizationProvider>
  )
}

export default App
