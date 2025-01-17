export interface QueryResults {
  cached: boolean | null
  database_id: number
  started_at: string
  json_query: any
  average_execution_time: number | null
  status: string
  context: string
  row_count: number
  running_time: number
  data: {
    results_timezone: string
    rows_truncated: number
    download_perms: string
    results_metadata: {
      columns: any[]
    }
    requested_timezone: string
    format_rows?: boolean
    rows: any[][]
    cols: {
      name: string
      base_type: string
      display_name: string
      [key: string]: any
    }[]
    native_form: {
      query: string
      params: any
    }
    is_sandboxed: boolean
    insights: any
  }
}
