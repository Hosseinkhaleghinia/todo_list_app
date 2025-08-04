// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseConfig";
import { useDispatch } from "react-redux";
import { setTasks } from "../features/checkboxList/taskSlice";
import { getAllTasks } from "../services/taskService";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

useEffect(() => {
  let isMounted = true;

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!isMounted) return;

    if (currentUser) {
      setUser(currentUser);

      const tasks = await getAllTasks(currentUser.id);
      dispatch(setTasks(tasks));
    } else {
      setUser(null);
    }

    setLoading(false);
  };

  checkAuth();

  // ✅ اضافه کن: گوش دادن به تغییر وضعیت ورود/خروج کاربر
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    console.log("🔄 تغییر وضعیت احراز هویت:", _event);
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  });

  return () => {
    isMounted = false;
    listener.subscription.unsubscribe(); // جلوگیری از memory leak
  };
}, []);


  // Debug info در هر render
  console.log("🎯 useAuth State:", {
    user: user
      ? {
          id: user.id,
          email: user.email,
          metadata: user.user_metadata,
        }
      : null,
    loading,
  });

  return { user, loading };
};
