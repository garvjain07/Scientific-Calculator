// Exports history data as a CSV download.
export function exportHistoryAsCsv(historyItems) {
  const escapeCsv = (value) => {
    let text = String(value ?? '')
    if (/^[=+\-@]/.test(text)) text = `'${text}`
    return `"${text.replace(/"/g, '""')}"`
  }

  const header = 'timestamp,expression,result\n'
  const rows = historyItems
    .map((item) => [item.timestamp, item.expression, item.result].map(escapeCsv).join(','))
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
