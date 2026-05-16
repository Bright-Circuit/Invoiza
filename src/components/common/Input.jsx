'use client';

import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1),
  },
}));

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error = false,
  helperText,
  fullWidth = true,
  disabled = false,
  required = false,
  multiline = false,
  rows = 4,
  name,
  id,
  autoComplete,
  size = 'medium',
  variant = 'outlined',
  ...props
}) {
  return (
    <StyledTextField
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      disabled={disabled}
      required={required}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      name={name}
      id={id || name}
      autoComplete={autoComplete}
      size={size}
      variant={variant}
      {...props}
    />
  );
}
