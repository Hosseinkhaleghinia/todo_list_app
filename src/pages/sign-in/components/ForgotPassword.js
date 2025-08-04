// src/pages/sign-in/components/ForgotPassword.js
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { resetPassword } from '../../../services/authService';

export default function ForgotPassword({ open, handleClose }) {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!email || !validateEmail(email)) {
      setEmailError(true);
      return;
    }

    setEmailError(false);
    setLoading(true);

    try {
      await resetPassword(email);
      alert('لینک بازیابی رمز عبور به ایمیل شما ارسال شد. لطفاً ایمیل خود را بررسی کنید.');
      handleClose();
      setEmail('');
    } catch (error) {
      console.error('خطا در ارسال ایمیل بازیابی:', error.message);
      
      if (error.message.includes('Email not found')) {
        alert('این ایمیل در سیستم یافت نشد');
      } else {
        alert('خطا در ارسال ایمیل بازیابی: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (emailError && validateEmail(event.target.value)) {
      setEmailError(false);
    }
  };

  const handleDialogClose = () => {
    if (!loading) {
      handleClose();
      setEmail('');
      setEmailError(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
        sx: { backgroundImage: 'none' },
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a link to
          reset your password.
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Email address"
          placeholder="Email address"
          type="email"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          error={emailError}
          disabled={loading}
        />
        {emailError && (
          <DialogContentText sx={{ color: 'error.main', fontSize: '0.75rem' }}>
            Please enter a valid email address.
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleDialogClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Continue'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}