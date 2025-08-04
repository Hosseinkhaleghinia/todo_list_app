// src/components/LogoutButton.js
import React from 'react';
import { Button } from '@mui/material';
import { signOut } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const LogoutButton = ({...props }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      console.log('خروج موفقیت‌آمیز');
      navigate('/login');
    } catch (error) {
      console.error('خطا در خروج:', error.message);
      alert('خطا در خروج: ' + error.message);
    }
  };

  return (
    <Button variant="text" onClick={handleLogout} {...props} color='error'>
      Logout
      <LogoutIcon/>
    </Button>
  );
};

export default LogoutButton;