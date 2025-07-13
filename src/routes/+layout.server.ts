import { supabase } from "$lib/supabaseClient";
export const load = async () => {
    const { data } = await supabase.from("instruments").select();
    const instruments = data;
    return { instruments }
}
