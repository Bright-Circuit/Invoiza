'use client';

import MuiButton from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

const StyledButton = styled(MuiButton)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: theme.spacing(1),
}));

export default function Button({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  onClick,
  type = 'button',
  className,
  ...props
}) {
  return (
    <StyledButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={!loading && startIcon}
      endIcon={!loading && endIcon}
      onClick={onClick}
      type={type}
      className={clsx(className)}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </StyledButton>
  );
}
