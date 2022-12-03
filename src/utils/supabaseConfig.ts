import environment from "../loadEnvironment.js";
import { createClient } from "@supabase/supabase-js";

const { supabaseRecipesBucket, supabaseKey, supabaseUrl } = environment;
const supabase = createClient(supabaseUrl, supabaseKey);

const bucket = supabase.storage.from(supabaseRecipesBucket);

export default bucket;
