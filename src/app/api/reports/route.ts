import { NextRequest, NextResponse } from 'next/server'

// Cache variables outside the handler scope
let cachedData: any[] = [] // always an array
let cacheTimestamp = 0
const CACHE_DURATION_MS = 1000 * 60 * 5 // 5 minutes

export async function GET(req: NextRequest) {
  const now = Date.now()

  // Refresh cache if expired or empty
  if (cachedData.length === 0 || now - cacheTimestamp > CACHE_DURATION_MS) {
    try {
      const response = await fetch(
        'https://f5q80hfi91.execute-api.eu-south-1.amazonaws.com/prod/get_scouting_reports'
      )
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      cachedData = await response.json()
      cacheTimestamp = now
    } catch (err) {
      console.error(err)
      return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
    }
  }

  // Extract query params
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const search = searchParams.get('search')?.toLowerCase() || ''
  const sortBy = searchParams.get('sort_by') || ''
  const order = searchParams.get('order') === 'desc' ? 'desc' : 'asc'

  // Filter data
  const filtered = cachedData.filter((report: any) =>
    report.player_name.toLowerCase().includes(search) ||
    report.scouted_position.toLowerCase().includes(search) ||
    report.team_name.toLowerCase().includes(search) ||
    report.final_judgement.toLowerCase().includes(search)
  )

  // Sort data
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
