const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rymazwmtgjrvpmodjcw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5bWF6d210Z2pydnBtb3ZkamN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0ODcwNTYsImV4cCI6MjA5MzA2MzA1Nn0.5hGhPQQikAj-y7VG6HtoeBhq_3ISX7759yjaY9W11oM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, data } = req.body;

  try {
    if (action === 'save') {
      const { data: result, error } = await supabase
        .from('life_map_entries')
        .insert([data])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(400).json({ success: false, error: error.message });
      }

      return res.status(200).json({ success: true, data: result });
    }

    if (action === 'load') {
      const { data: result, error } = await supabase
        .from('life_map_entries')
        .select('*')
        .eq('user_id', data.user_id)
        .order('year', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(400).json({ success: false, error: error.message });
      }

      return res.status(200).json({ success: true, data: result || [] });
    }

    return res.status(400).json({ success: false, error: 'Unknown action' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
