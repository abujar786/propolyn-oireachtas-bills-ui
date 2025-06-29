import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

const BillTypeFilter: React.FC<Props> = ({ value, onChange, options }) => {
  const labelId = "bill-type-select-label";
  return (
    <FormControl sx={{ mb: 2, minWidth: 200 }} size="small">
      <InputLabel id={labelId}>Filter by Bill Type</InputLabel>
      <Select
        labelId={labelId}
        value={value}
        label="Filter by Bill Type"
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">All</MenuItem>
        {options.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BillTypeFilter;
