import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Consultant {
  id: string;
  username: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  title: string | null;
  profile_summary: string | null;
  experience: number | null;
  hourly_rate: number | null;
  rating: number | null;
  project_category: string | null;
  can_relocate: boolean | null;
  skill_1: string | null;
  skill_2: string | null;
  skill_3: string | null;
  skill_4: string | null;
  skill_5: string | null;
  skill_6: string | null;
  skill_7: string | null;
  skill_8: string | null;
  skill_9: string | null;
  skill_10: string | null;
  created_at: string;
  updated_at: string;
}

export const useConsultants = () => {
  return useQuery({
    queryKey: ["consultants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultants")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Consultant[];
    },
  });
};

export const getSkillsFromConsultant = (consultant: Consultant): string[] => {
  const skills: string[] = [];
  if (consultant.skill_1) skills.push(consultant.skill_1);
  if (consultant.skill_2) skills.push(consultant.skill_2);
  if (consultant.skill_3) skills.push(consultant.skill_3);
  if (consultant.skill_4) skills.push(consultant.skill_4);
  if (consultant.skill_5) skills.push(consultant.skill_5);
  return skills.slice(0, 5); // Return max 5 skills for display
};
