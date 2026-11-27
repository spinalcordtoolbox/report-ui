import {
  FilterFn,
} from '@tanstack/react-table'

/* Filter by includes all keywords, case insensitive, split on whitespace */
const allKeywordsFilter: FilterFn<any> = (row, _columnId, filterValue: string) => {
  const keywords = String(filterValue ?? '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)

  if (keywords.length === 0) return true

  // Build one searchable string from all globally-filterable cells in the row
  const haystack = row
    .getAllCells()
    .filter(cell => cell.column.getCanGlobalFilter())
    .map(cell => String(cell.getValue() ?? ''))
    .join(' ')
    .toLowerCase()

  return keywords.every(k => haystack.includes(k))
};

/* Bypass above if value is empty */
allKeywordsFilter.autoRemove = (val) => !val || !String(val).trim()

export default allKeywordsFilter
