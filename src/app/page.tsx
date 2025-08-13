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
  const [debouncedSearch, setDebouncedSearch] = useState(search) // <-- new debounced search state
  const [sortBy, setSortBy] = useState('')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')

  const limit = 10

  // Debounce search input by 600ms
  useEffect(() => { 
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset page when search changes after debounce
    }, 600)

    return () => {
      clearTimeout(handler) // Cleanup if search changes before 300ms
    }
  }, [search])

  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ['reports', page, debouncedSearch, sortBy, order], // <-- use debouncedSearch here
    queryFn: async (): Promise<ApiResponse> => {
      const res = await axios.get('/api/reports', {
        params: {
          page,
          limit,
          search: debouncedSearch,
          sort_by: sortBy,
          order,
        },
      })
      return res.data
    },
    staleTime: 1000 * 60,
  })

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setOrder('asc')
    }
  }

  if (isLoading)
    return (
      <p className="p-6 text-center text-gray-500 dark:text-gray-400">Loading reports...</p>
    )
  if (isError)
    return (
      <p className="p-6 text-center text-red-600 dark:text-red-400">
        Failed to load reports.
      </p>
    )
  if (!data) return null

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Scouting Reports
      </h1>

      <input
        type="text"
        placeholder="Search players, positions, teams..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          // remove setPage(1) here, handled in debounce effect instead
        }}
        className="mb-6 w-full max-w-md p-3 border border-gray-300 rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
      />

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {[
                { label: 'Player', field: 'player_name' },
                { label: 'Position', field: 'scouted_position' },
                { label: 'Team', field: 'team_name' },
                { label: 'Report', field: 'final_judgement' },
              ].map(({ label, field }) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  className="cursor-pointer select-none px-4 py-3 text-left text-sm font-semibold
                    text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700
                    transition-colors"
                  scope="col"
                >
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    {sortBy === field && (
                      <span aria-label={order === 'asc' ? 'Ascending' : 'Descending'}>
                        {order === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900">
            {data.data.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center p-6 text-gray-500 dark:text-gray-400 italic"
                >
                  No reports found.
                </td>
              </tr>
            )}
            {data.data.map((report, i) => (
              <tr
                key={i}
                className={`border-b border-gray-200 dark:border-gray-700 ${
                  i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''
                } hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors`}
              >
                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{report.player_name}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{report.scouted_position}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{report.team_name}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{report.final_judgement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
          className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold
            hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
            transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Previous
        </button>

        <span className="text-gray-700 dark:text-gray-300 font-medium">
          Page {data.page} of {data.totalPages}
        </span>

        <button
          onClick={() => setPage((old) => Math.min(old + 1, data.totalPages))}
          disabled={page === data.totalPages}
          className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold
            hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
            transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
    </main>
  )
}
