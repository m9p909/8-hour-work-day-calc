import React, { useState } from "react";
import { Button, Container, Dropdown, InputGroup } from "react-bootstrap";
import "./App.css";
import { Map } from "immutable";

function range(start, end) {
  var ans = [];
  for (let i = start; i <= end; i++) {
    ans.push(i);
  }
  return ans;
}

function calculateFinishTime(startTime, lunchTime, workingHours) {
  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  const month = 2;
  const year = 2000;
  const day = 14;
  const hoursToMS = (hours) => hours * 60 * 60 * 1000;
  const minutesToMS = (minutes) => minutes * 60 * 1000;
  const start = new Date(
    year,
    month,
    day,
    startTime.ampm === am ? startTime.hours : startTime.hours + 12,
    startTime.minutes
  );
  const endTime =
    start.getTime() +
    hoursToMS(workingHours) +
    hoursToMS(lunchTime.hours) +
    minutesToMS(lunchTime.minutes);

  const end = new Date(endTime);
  return formatAMPM(end);
}

const am = "am";
const pm = "pm";

const timeRanges = {
  hoursWorking: range(0, 10).reverse(),
  hours: range(1, 12).reverse(),
  minutes: [0, 15, 30, 45],
  ampm: [am, pm],
};

function App() {
  const [workingHours, setWorkingHours] = useState(8);

  const [result, setResult] = useState(undefined);

  const [startTime, setStartTime] = useState(
    Map({
      hours: 9,
      minutes: 0,
      ampm: am,
    })
  );

  const [lunchTime, setLunchTime] = useState(
    Map({
      hours: 1,
      minutes: 0,
    })
  );

  const isValidHours = (val) => {
    if (!isNaN(val)) {
      const value = parseInt(val);
      if (value <= 12 && value > 0) {
        return true;
      } else if (val.length === 0) {
        return true;
      }
    }
    return false;
  };

  const isValidMinutes = (val) => {
    if (!isNaN(val)) {
      const value = parseInt(val);
      if (value <= 59 && value >= 0) {
        return true;
      } else if (val.length === 0) {
        return true;
      }
    }
  };

  const calculate = () => {
    setResult(
      calculateFinishTime(
        startTime.toObject(),
        lunchTime.toObject(),
        workingHours
      )
    );
  };

  return (
    <div className="App">
      <Container className="text-center">
        <h1> Work Day Calculator</h1>
        <div id="calculator">
          <div id="hoursWorked">
            <InputGroup className="mb-3 d-flex justify-content-center">
              <Dropdown>
                <Dropdown.Toggle>{workingHours}</Dropdown.Toggle>
                <Dropdown.Menu>
                  {timeRanges.hoursWorking.map((val) => (
                    <Dropdown.Item
                      onClick={() => setWorkingHours(val)}
                    >
                      {" "}
                      {val}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </InputGroup>
          </div>
          <div id="startingTime">
            <h2>Starting Time</h2>
            <InputGroup className="mb-3 d-flex justify-content-center">
              <input
                className="form-control"
                type="number"
                value={startTime.get("hours")}
                onChange={(change) => {
                  const targetValue = change.target.value;
                  if (isValidHours(targetValue)) {
                    setStartTime(startTime.set("hours", targetValue));
                  }
                }}
              ></input>
              <span className="input-group-text">:</span>
              <input
                className="form-control"
                type="number"
                value={startTime.get("minutes")}
                onChange={(change) => {
                  const targetValue = change.target.value;
                  if (isValidMinutes(targetValue)) {
                    setStartTime(startTime.set("minutes", targetValue));
                  }
                }}
              ></input>
              <Dropdown>
                <Dropdown.Toggle></Dropdown.Toggle>
                <Dropdown.Menu>
                  {timeRanges.minutes.map((minute) => (
                    <Dropdown.Item
                      onClick={() =>
                        setStartTime(startTime.set("minutes", minute))
                      }
                    >
                      {minute}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle>{startTime.get("ampm")}</Dropdown.Toggle>
                <Dropdown.Menu>
                  {timeRanges.ampm.map((ampm) => (
                    <Dropdown.Item
                      onClick={() => setStartTime(startTime.set("ampm", ampm))}
                    >
                      {" "}
                      {ampm}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </InputGroup>
          </div>
          <div id="lunchContainer">
            <h2>Lunch Duration</h2>
            <InputGroup className="mb-3">
              <input
                type="number"
                className="form-control"
                value={lunchTime.get("hours")}
                onChange={(event) => {
                  const value = event.target.value;
                  if (!isNaN(value)) {
                    setLunchTime(lunchTime.set("hours", value));
                  }
                }}
              ></input>
              <span className="input-group-text">:</span>
              <input
                type="number"
                className="form-control"
                value={lunchTime.get("minutes")}
                onChange={(event) => {
                  const value = event.target.value;
                  if (isValidMinutes(value)) {
                    setLunchTime(lunchTime.set("minutes", value));
                  }
                }}
              ></input>
              <Dropdown>
                <Dropdown.Toggle></Dropdown.Toggle>
                <Dropdown.Menu>
                  {timeRanges.minutes.map((minute, index) => (
                    <Dropdown.Item
                      onClick={() =>
                        setLunchTime(lunchTime.set("minutes", minute))
                      }
                    >
                      {minute}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </InputGroup>
          </div>
          <Button onClick={calculate}>Calculate</Button>
          {result && <h2>You are done at {result}</h2>}
        </div>
      </Container>
    </div>
  );
}

export default App;
