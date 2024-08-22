import { TextField, FormControlLabel, Checkbox, MenuItem, Select, InputLabel, FormControl, Box } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import parse from 'html-react-parser';
import dayjs from "dayjs";
import customParser from 'dayjs/plugin/customParseFormat';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { dateFormat, dateTimeFormat, timeFormat } from "./constants";
import TextEditor from "../components/TextEditor";
import { DateTimePicker, TimePicker } from "@mui/x-date-pickers";

dayjs.extend(customParser);

export default function getInputComponent({ type, value, onChange, filter, label = 'Value' }) {
  function _onChange(value) {
    onChange(value);
    if (filter) {
      // filter.handleFilterChange(value);
    }
  }

  switch (type) {
    case 'INT':
    case 'FLOAT':
      if (filter) {
        return (
          <Box display={'flex'} flexDirection={'column'}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Mode</InputLabel>
              <Select label="Mode" value={filter.filterMode} onChange={filter.handleModeChange}>
                <MenuItem value="lessThan">Less than</MenuItem>
                <MenuItem value="equals">Equal to</MenuItem>
                <MenuItem value="greaterThan">Greater than</MenuItem>
              </Select>
            </FormControl>
            <Box height={10} />
            <TextField
              type="number"
              label={label}
              value={value}
              // onChange={(e) => handleFilterChange(e.target.value)}
              onChange={onChange ? (e) => { _onChange(e.target.value) } : undefined}
              fullWidth
            />
          </Box>
        );
      }
      else {
        return (
          <TextField
            value={onChange ? value : undefined}
            onChange={(e) => onChange ? _onChange(e.target.value) : undefined}
            label={label}
            type="number"
            fullWidth
          />
        );
      }

    case 'VARCHAR':
      return (
        <TextField
          value={onChange ? value : undefined}
          onChange={(e) => onChange ? _onChange(e.target.value) : undefined}
          label={label}
          fullWidth
        />
      );
    case 'TEXT':
      if (filter) {
        return (
          <TextField
            value={onChange ? value : undefined}
            onChange={(e) => onChange ? _onChange(e.target.value) : undefined}
            label={label}
            fullWidth
          />
        );
      }
      else {
        return (
          <TextEditor
            onContentChange={_onChange}
            initialContent={value}
            placeholder={label}
          />
        )
      }

    // return (
    //   <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
    //     <DatePicker
    //       fullWidth
    //       label={label}
    //       value={onChange ? dayjs(value, dateFormat) : undefined}
    //       onChange={onChange ? (newValue) => { onChange(dayjs(newValue).format(dateFormat)) } : undefined}
    //     />
    //   </LocalizationProvider>
    // )


    // return (
    //   <LocalizationProvider dateAdapter={AdapterDayjs}>
    //     <TimePicker
    //       label={label}
    //       value={onChange ? dayjs(value, timeFormat) : undefined}
    //       onChange={onChange ? (newValue) => { onChange(dayjs(newValue).format(timeFormat)) } : undefined}
    //     />
    //   </LocalizationProvider>
    // )

    case 'DATE':
    case 'TIME':
    case 'DATETIME':
      const PickerComponent =
        type === 'DATE' ? DatePicker :
          type === 'TIME' ? TimePicker : DateTimePicker;
      const format =
        type === 'DATE' ? dateFormat :
          type === 'TIME' ? timeFormat : dateTimeFormat;
      console.log(value);
      console.log(format);
      if (filter) {
        return (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Mode</InputLabel>
              <Select label="Mode" value={filter.filterMode} onChange={filter.handleModeChange}>
                <MenuItem value="before">Before</MenuItem>
                <MenuItem value="equals">Same as</MenuItem>
                <MenuItem value="after">After</MenuItem>
              </Select>
            </FormControl>
            <Box height={10} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <PickerComponent
                label={label}
                // value={onChange ? dayjs(value, format) : undefined}
                value={dayjs(value || undefined, format).isValid() ? dayjs(value, format) : dayjs()}
                onChange={onChange ? (newValue) => { _onChange(dayjs(newValue).format(format)) } : undefined}
                InputLabelProps={{ shrink: true }}
              />
            </LocalizationProvider>
          </>
        );
      }
      else {
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <PickerComponent
              label={label}
              value={onChange ? dayjs(value, format) : undefined}
              onChange={onChange ? (newValue) => { _onChange(dayjs(newValue).format(format)) } : undefined}
              InputLabelProps={{ shrink: true }}
            />
          </LocalizationProvider>
        );
      }
    case 'BOOLEAN':
      return (
        <FormControlLabel
          checked={onChange ? value : undefined}
          onChange={onChange ? (e) => _onChange(e.target.checked) : undefined}
          control={<Checkbox />}
          label={label}
        />
      );
    case 'ENUM':
    case 'SET':
      return (
        <TextField
          label={label}
          value={onChange ? value : undefined}
          onChange={(e) => onChange ? onChange(e.target.value) : undefined}
          placeholder="Option1, Option2, Option3"
          fullWidth
        />
      );
    default:
      return null;
  }
}

export function parseValueOfType({ type, value }) {
  switch (type) {
    case 'INT':
    case 'FLOAT':
    case 'VARCHAR':
    case 'DATE':
    case 'TIME':
    case 'DATETIME':
      return value;
    case 'TEXT':
      return parse(value)
    // case 'VARCHAR':
    //   return parse(value);
    // case 'DATE':
    //   return dayjs(value).format(dateFormat);
    // case 'TIME':
    //   return dayjs(value).format(timeFormat);
    // case 'DATETIME':
    //   return dayjs(value).format(dateTimeFormat);
    case 'BOOLEAN':
      return value ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />;
    default:
      return null;
  }
}

export function getDefaultValues(type) {
  switch (type) {
    case 'INT':
    case 'FLOAT':
    case 'VARCHAR':
    case 'TEXT':
      return '';
    case 'DATE':
      return dayjs(Date.now()).format(dateFormat);
    case 'TIME':
      return dayjs(Date.now()).format(timeFormat);
    case 'DATETIME':
      return dayjs(Date.now()).format(dateTimeFormat);
    // case 'VARCHAR':
    //   return parse(value);
    // case 'DATE':
    //   return dayjs(value).format(dateFormat);
    // case 'TIME':
    //   return dayjs(value).format(timeFormat);
    // case 'DATETIME':
    //   return dayjs(value).format(dateTimeFormat);
    case 'BOOLEAN':
      return false;
    default:
      return null;
  }
}
