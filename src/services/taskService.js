
import { supabase } from "../supabase/supabaseConfig";

// دریافت تمام تسک‌های مربوط به کاربر فعلی
export const getAllTasks = async () => {
  try {
    // چک کردن اینکه کاربر لاگین کرده باشد
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("خطا در دریافت کاربر:", userError);
      return [];
    }
    
    if (!user) {
      console.log("کاربر وارد نشده است");
      return [];
    }

    console.log("دریافت تسک‌ها برای کاربر:", user.id);

    // دریافت تسک‌های کاربر از دیتابیس
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("خطا در دریافت تسک‌ها:", error);
      return [];
    }

    console.log("تسک‌های دریافت شده:", tasks);

    // تبدیل نام فیلدها برای سازگاری
    const mappedTasks = tasks?.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      dateTime: task.date_time,
      categoryId: task.category_id,
      finished: task.finished,
      created_at: task.created_at,
      updated_at: task.updated_at,
      user_id: task.user_id
    })) || [];

    return mappedTasks;

  } catch (error) {
    console.error("خطا در دریافت تسک‌ها:", error);
    return [];
  }
};

// اضافه کردن تسک جدید
export const addTaskToDB = async (task) => {
  try {
    console.log("شروع اضافه کردن تسک:", task);

    // چک کردن اینکه کاربر لاگین کرده باشد
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("خطا در دریافت کاربر:", userError);
      throw new Error("خطا در دریافت اطلاعات کاربر");
    }
    
    if (!user) {
      throw new Error("کاربر وارد نشده است");
    }

    console.log("کاربر احراز هویت شده:", user.id);

    // آماده‌سازی داده برای Supabase
    const taskData = {
      title: task.title,
      description: task.description || '',
      date_time: task.dateTime,
      category_id: task.categoryId || null,
      finished: task.finished || false,
      user_id: user.id,
      created_at: new Date().toISOString()
    };

    console.log("داده آماده برای ارسال:", taskData);

    // اضافه کردن به دیتابیس
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();

    if (error) {
      console.error("خطا در insert:", error);
      throw error;
    }

    console.log("تسک با موفقیت اضافه شد:", data);

    // برگرداندن با format مناسب برای frontend
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      dateTime: data.date_time,
      categoryId: data.category_id,
      finished: data.finished,
      created_at: data.created_at,
      updated_at: data.updated_at,
      user_id: data.user_id
    };

  } catch (error) {
    console.error("خطای کامل در اضافه کردن تسک:", error);
    throw error;
  }
};

// به‌روزرسانی تسک
export const updateTaskInDB = async (id, updates) => {
  try {
    console.log("شروع به‌روزرسانی تسک:", id, updates);

    // چک کردن اینکه کاربر لاگین کرده باشد
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("کاربر وارد نشده است");
    }

    // آماده‌سازی داده برای Supabase
    const updateData = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.dateTime !== undefined) updateData.date_time = updates.dateTime;
    if (updates.categoryId !== undefined) updateData.category_id = updates.categoryId;
    if (updates.finished !== undefined) updateData.finished = updates.finished;
    
    // اضافه کردن timestamp به‌روزرسانی
    updateData.updated_at = new Date().toISOString();

    console.log("داده برای به‌روزرسانی:", updateData);

    // به‌روزرسانی در دیتابیس
    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id) // اطمینان از اینکه فقط تسک‌های خود کاربر به‌روزرسانی شوند
      .select()
      .single();

    if (error) {
      console.error("خطا در به‌روزرسانی تسک:", error);
      throw error;
    }

    console.log("تسک با موفقیت به‌روزرسانی شد:", data);

    // برگرداندن با format مناسب
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      dateTime: data.date_time,
      categoryId: data.category_id,
      finished: data.finished,
      created_at: data.created_at,
      updated_at: data.updated_at,
      user_id: data.user_id
    };

  } catch (error) {
    console.error("خطا در به‌روزرسانی تسک:", error);
    throw error;
  }
};

// حذف تسک
export const deleteTaskFromDB = async (id) => {
  try {
    console.log("شروع حذف تسک:", id);

    // چک کردن اینکه کاربر لاگین کرده باشد
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("کاربر وارد نشده است");
    }

    // حذف از دیتابیس
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // اطمینان از اینکه فقط تسک‌های خود کاربر حذف شوند

    if (error) {
      console.error("خطا در حذف تسک:", error);
      throw error;
    }

    console.log("تسک با موفقیت حذف شد");

  } catch (error) {
    console.error("خطا در حذف تسک:", error);
    throw error;
  }
};