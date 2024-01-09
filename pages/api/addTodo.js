import { getSupabase } from "../../utils/supabase";

export default async function handler(req, res) {
  const { userID, todo } = req.body;
  const supabase = getSupabase(userID);
  const { data, error } = await supabase
    .from("todo")
    .insert({ title: todo })
    .select()
    .single();
  if (error) return res.status(400).json(error);
  res.status(200).json(data);
}
