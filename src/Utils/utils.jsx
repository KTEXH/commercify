import { createClient } from "@supabase/supabase-js";




export const supabase = createClient(
    'https://weuixpchomstirwcwyxc.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndldWl4cGNob21zdGlyd2N3eXhjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTUzMzQwMiwiZXhwIjoyMDkxMTA5NDAyfQ.KL5VOuMkAk_ctI65IgonWGdNs1IIMvtTiAjDGoRVkgg'
);