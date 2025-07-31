import { createClient } from '@/lib/supabase/server' // Or wherever your server client is
import { NextResponse } from 'next/server'

// This ensures the route is treated as dynamic and can access cookies.
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Create a Supabase client for this specific server-side request
  const supabase = createClient()

  // Now you can safely use the client
  const { data, error } = await supabase.from('resumes').select('*')

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ resumes: data })
}
