// import { useState } from 'react'
import * as React from "react";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {
  Button,
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import supabase from '../utils/supabase'
import './App.css'
import { MobileDateTimePicker } from "@mui/x-date-pickers";

function App() {
  const [timeStart, setTimeStart] = React.useState<Dayjs | null>();
  const [timeEnd, setTimeEnd] = React.useState<Dayjs | null>();
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs());
  const [amountPeople04, setAmountPeople04] = React.useState<number>();
  const [amountPeople517, setAmountPeople517] = React.useState<number>();
  const [amountPeople1824, setAmountPeople1824] = React.useState<number>();
  const [amountPeopleOver, setAmountPeopleOver] = React.useState<number>();

  const [values, setValues] = React.useState<any[] | null>(null);

  const [timeLock, setTimeLock] = React.useState<Dayjs | null>(dayjs());

  React.useEffect(() => {
    async function fetchData() {
      const result = await getValues();
      setValues(result);
    }
    fetchData();
  }, []);


  async function uploadTime() {
    if (selectedDate == null || timeEnd == null || timeStart == null) {
      console.log("ERROR MISSING SOME VALUES")
    }
    const { error } = await supabase
      .from("time")
      .insert({
        hours_used: Number(timeEnd?.diff(timeStart, 'minute')) / 60,
        people_0_4: amountPeople04,
        people_5_17: amountPeople517,
        people_18_24: amountPeople1824,
        people_over: amountPeopleOver,
        time_start: timeStart,
        time_end: timeEnd,
        date: selectedDate
      })
    if (error) {
      console.log("ERROR:", error)
    }

    const data = await getValues()
    setValues(data);
  }

  async function getValues(): Promise<any[] | null> {
    const { error, data } = await supabase
      .from("time")
      .select()
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.log("Error:", error)
    }
    return data
  }

  async function openLocale(open: boolean) {
    const { error } = await supabase
      .from("building")
      .insert({
        unlocked: open,
        time: timeLock
      })
    if (error) {
      console.log("Error with Locking:", error)
    }
  }

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
          <Typography variant="h6" sx={{ mt: 3, mb: 3, textAlign: "center" }}>
            Antal mennesker i aldersgruppe:
          </Typography>
          <Container>
            <TextField
              label="(0-4)"
              type="number"
              onChange={(e) => setAmountPeople04(Number(e.target.value))}
              sx={{ width: 80, mb: 2, mr: 1 }}
            />
            <TextField
              label="(5-17)"
              type="number"
              onChange={(e) => setAmountPeople517(Number(e.target.value))}
              sx={{ width: 80, mb: 2, mr: 1 }}
            />
            <TextField
              label="(18-24)"
              type="number"
              onChange={(e) => setAmountPeople1824(Number(e.target.value))}
              sx={{ width: 80, mb: 2, mr: 1 }}
            />
            <TextField
              label="(Over)"
              type="number"
              onChange={(e) => setAmountPeopleOver(Number(e.target.value))}
              sx={{ width: 80 }}
            />
          </Container>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            onClick={() => {
              uploadTime()
            }}
          >
            Tilføj tid
          </Button>

          <Typography variant="h4" sx={{ mt: 5, mb: 1, textAlign: "center" }}>
            Lokaler
          </Typography>
          <Container>
            <MobileDateTimePicker
              label="Åben/lås tid"
              ampm={false}
              sx={{ mt: 1, mb: 2 }}
              value={timeLock}
              onChange={(newValue) => {
                setTimeLock(newValue)
              }}
            />
          </Container>
          <Container>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 0 }}
              onClick={() => {
                openLocale(false)
              }}
            >
              Lås
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
              onClick={() => {
                openLocale(true)
              }}
            >
              Åben
            </Button>
          </Container>

          <Typography variant="h4" sx={{ mt: 6, mb: 3, textAlign: "center" }}>
            Gemte Tider
          </Typography>
          {/*  */}
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, px: 0 }}>
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
                    <TableCell>{Math.round(Number(item.hours_used) * 1000) / 1000}</TableCell>
                    <TableCell>{item.people_0_4 + item.people_5_17 + item.people_18_24 + item.people_over}</TableCell>
                    <TableCell>{dayjs(item.time_end).format("DD-MMM")}</TableCell>
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
