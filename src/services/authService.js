// src/services/authService.js
import { supabase } from '../supabase/supabaseConfig';

// ثبت‌نام کاربر جدید با نام
export const signUp = async (email, password, displayName) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName, // ذخیره نام در metadata
          full_name: displayName     // فیلد اضافی برای سازگاری
        }
      }
    });

    if (error) {
      throw error;
    }

    console.log('کاربر با موفقیت ثبت شد:', data.user);
    return { user: data.user, session: data.session };
  } catch (error) {
    console.error('خطا در ثبت‌نام:', error.message);
    throw error;
  }
};

// ورود کاربر
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { user: data.user, session: data.session };
  } catch (error) {
    console.error('خطا در ورود:', error.message);
    throw error;
  }
};

// خروج کاربر
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در خروج:', error.message);
    throw error;
  }
};

// گرفتن کاربر فعلی
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw error;
    }
    
    return user;
  } catch (error) {
    console.error('خطا در گرفتن کاربر فعلی:', error.message);
    return null;
  }
};

// به‌روزرسانی پروفایل کاربر
export const updateUserProfile = async (updates) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    });

    if (error) {
      throw error;
    }

    return data.user;
  } catch (error) {
    console.error('خطا در به‌روزرسانی پروفایل:', error.message);
    throw error;
  }
};

// ریست پسورد
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('خطا در ریست پسورد:', error.message);
    throw error;
  }
};

// به‌روزرسانی پسورد
export const updatePassword = async (newPassword) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('خطا در به‌روزرسانی پسورد:', error.message);
    throw error;
  }
};