'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

// Adjusted type to match the API response keys
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
  const limit = 10

  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ['reports', page],
    queryFn: async (): Promise<ApiResponse> => {
      const res = await axios.get(`/api/reports?page=${page}&limit=${limit}`)
      return res.data
    },
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  })

  if (isLoading) return <p className="p-4">Loading reports...</p>
  if (isError) return <p className="p-4 text-red-600">Failed to load reports.</p>
  if (!data) return null

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Scouting Reports</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Player</th>
            <th className="border border-gray-300 p-2 text-left">Position</th>
            <th className="border border-gray-300 p-2 text-left">Team</th>
            <th className="border border-gray-300 p-2 text-left">Report</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((report, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{report.player_name}</td>
              <td className="border border-gray-300 p-2">{report.scouted_position}</td>
              <td className="border border-gray-300 p-2">{report.team_name}</td>
              <td className="border border-gray-300 p-2">{report.final_judgement}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage(old => Math.max(old - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>

        <span>
          Page {data.page} of {data.totalPages}
        </span>

        <button
          onClick={() => setPage(old => Math.min(old + 1, data.totalPages))}
          disabled={page === data.totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </main>
  )
}
