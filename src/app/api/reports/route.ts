import { NextRequest, NextResponse } from 'next/server'

// Cache variables outside the handler scope (module scope)
let cachedData: any[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION_MS = 1000 * 60 * 5 // 5 minutes

export async function GET(req: NextRequest) {
  const now = Date.now()
  
  if (!cachedData || now - cacheTimestamp > CACHE_DURATION_MS) {
    // Cache expired or empty — fetch fresh data
    const response = await fetch('https://f5q80hfi91.execute-api.eu-south-1.amazonaws.com/prod/get_scouting_reports')
    cachedData = await response.json()
    cacheTimestamp = now
  }

  // Extract query params
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const search = searchParams.get('search')?.toLowerCase() || ''
  const sortBy = searchParams.get('sort_by') || ''
  const order = searchParams.get('order') === 'desc' ? 'desc' : 'asc'

  // Filter data locally
  const filtered = cachedData.filter((report: any) =>
    report.player_name.toLowerCase().includes(search) ||
    report.scouted_position.toLowerCase().includes(search) ||
    report.team_name.toLowerCase().includes(search) ||
    report.final_judgement.toLowerCase().includes(search)
  )

  // Sort locally
  const sorted = [...filtered].sort((a, b) => {
    if (!sortBy || !(sortBy in a)) return 0

    const valA = a[sortBy]?.toString().toLowerCase() ?? ''
    const valB = b[sortBy]?.toString().toLowerCase() ?? ''

    if (valA < valB) return order === 'asc' ? -1 : 1
    if (valA > valB) return order === 'asc' ? 1 : -1
    return 0
  })

  // Paginate
  const start = (page - 1) * limit
  const paginated = sorted.slice(start, start + limit)
  const totalPages = Math.ceil(sorted.length / limit)

  return NextResponse.json({
    data: paginated,
    page,
    totalPages,
  })
}
