import { logger } from "@/common/utils/logger";
import { createClient } from "@supabase/supabase-js";

export const getSupabase = async (email: string) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
  // const { data, error } = await supabase.auth.signInWithPassword({
  //   email: email,
  //   password: process.env.KAISEI_CAFETERIA_AUTH_USER_PASSWORD,
  // });

  // if (error) {
  //   logger.error(error);
  // }

  return supabase;
};
