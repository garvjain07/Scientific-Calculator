// Exports history data as a CSV download.
export function exportHistoryAsCsv(historyItems) {
  const header = 'timestamp,expression,result\n'
  const rows = historyItems
    .map((item) => `"${item.timestamp}","${item.expression}","${item.result}"`)
    .join('\n')

  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.setAttribute('download', 'calculator-history.csv')
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
