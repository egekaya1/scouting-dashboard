'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Report = {
  player_name: string
  scouted_position: string
  team_name: string
  final_judgement: string
}

type ApiResponse = {
  data: Report[]
  page: number
  totalPages: number
}

export default function HomePage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')

  const limit = 10

  const { data, isLoading, isError, refetch } = useQuery<ApiResponse>({
    queryKey: ['reports', page, search, sortBy, order],
    queryFn: async (): Promise<ApiResponse> => {
      const res = await axios.get('/api/reports', {
        params: {
          page,
          limit,
          search,
          sort_by: sortBy,
          order,
        },
      })
      return res.data
    },
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  })

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setOrder('asc')
    }
  }

  if (isLoading) return <p className="p-4">Loading reports...</p>
  if (isError) return <p className="p-4 text-red-600">Failed to load reports.</p>
  if (!data) return null

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Scouting Reports</h1>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setPage(1)
        }}
        className="mb-4 p-2 border rounded w-full max-w-md"
      />

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 cursor-pointer" onClick={() => handleSort('player_name')}>
              Player {sortBy === 'player_name' ? (order === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th className="border p-2 cursor-pointer" onClick={() => handleSort('scouted_position')}>
              Position {sortBy === 'scouted_position' ? (order === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th className="border p-2 cursor-pointer" onClick={() => handleSort('team_name')}>
              Team {sortBy === 'team_name' ? (order === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th className="border p-2 cursor-pointer" onClick={() => handleSort('final_judgement')}>
              Report {sortBy === 'final_judgement' ? (order === 'asc' ? '▲' : '▼') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((report, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="border p-2">{report.player_name}</td>
              <td className="border p-2">{report.scouted_position}</td>
              <td className="border p-2">{report.team_name}</td>
              <td className="border p-2">{report.final_judgement}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>Page {data.page} of {data.totalPages}</span>
        <button
          onClick={() => setPage((old) => Math.min(old + 1, data.totalPages))}
          disabled={page === data.totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </main>
  )
}
