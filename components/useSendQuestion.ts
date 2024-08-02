import { supabase } from "@/utils/supabase";

export function useSendQuestion() {
  const sendEmail = async (
    name: string,
    age: string,
    email: string,
    marja: string,
    gender: string | null,
    question: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.from("Emails").insert({
        name,
        age,
        email,
        marja,
        gender,
        question,
      });
      if (error) {
        throw error;
      } else {
        return true;
      }
    } catch (e) {
      return false;
    }
  };

  return {
    sendEmail,
  };
}
