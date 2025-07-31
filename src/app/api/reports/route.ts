import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)

  const response = await fetch(
    'https://f5q80hfi91.execute-api.eu-south-1.amazonaws.com/prod/get_scouting_reports'
  )
  const data = await response.json()

  // Pagination logic
  const start = (page - 1) * limit
  const paginated = data.slice(start, start + limit)
  const totalPages = Math.ceil(data.length / limit)

  return NextResponse.json({
    data: paginated,
    page,
    totalPages,
  })
}
