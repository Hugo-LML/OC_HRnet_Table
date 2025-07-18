import { ChangeEvent, useMemo, useState } from 'react';

interface Column<T> {
  label: string;
  key: keyof T;
  sortable?: boolean;
}

interface CustomTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

const CustomTable = <T extends Record<string, unknown>>({ data, columns }: CustomTableProps<T>) => {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    return data.filter(row =>
      columns.some(col => {
        const cellValue = row[col.key];
        if (cellValue instanceof Date) {
          return new Intl.DateTimeFormat('en-us').format(cellValue).toLowerCase().includes(searchQuery.toLowerCase());
        }
        return String(cellValue).toLowerCase().includes(searchQuery.toLowerCase());
      }),
    );
  }, [data, columns, searchQuery]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey] as string | number | Date;
      const bValue = b[sortKey] as string | number | Date;

      if (aValue instanceof Date || bValue instanceof Date) {
        return sortDirection === 'asc'
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      return sortDirection === 'asc' ? String(aValue).localeCompare(String(bValue)) : String(bValue).localeCompare(String(aValue));
    });
  }, [filteredData, sortKey, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className='custom-table-wrapper'>
      <div className='custom-table-filter flex items-center justify-between'>
        <label htmlFor='rowsPerPage'>
          Show
          <select id='rowsPerPage' value={rowsPerPage} onChange={e => handleRowsPerPageChange(e)} className='mx-2 rounded border px-2 py-1'>
            {[10, 25, 50, 100].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          entries
        </label>
        <div>
          <label htmlFor='search' className='mr-2'>
            Search:
          </label>
          <input
            id='search'
            type='text'
            value={searchQuery}
            onChange={e => handleSearchChange(e)}
            placeholder='type to search...'
            className='rounded border px-2 py-1'
          />
        </div>
      </div>
      <table className='mt-4 w-full table-auto border border-gray-300'>
        <thead>
          <tr className='bg-gray-200'>
            {columns.map(column => (
              <th key={String(column.key)} className='cursor-pointer px-4 py-2' onClick={() => column.sortable && handleSort(column.key)}>
                <div className='flex items-center justify-between'>
                  {column.label}
                  {column.sortable && (
                    <span className={`ml-2 ${sortKey === column.key ? 'text-blue-500' : ''}`}>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={index} className='hover:bg-gray-100'>
              {columns.map(column => (
                <td key={String(column.key)} className='border-b px-4 py-2'>
                  {row[column.key] instanceof Date
                    ? new Intl.DateTimeFormat('en-us').format(new Date(row[column.key] as Date))
                    : String(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className='custom-table-pagination mt-4 flex items-center justify-between'>
        <span>
          Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, data.length)} of {data.length} entries
        </span>
        <div>
          Page {currentPage} of {totalPages}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='ml-2 rounded bg-gray-300 px-3 py-1 disabled:opacity-50'
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='ml-2 rounded bg-gray-300 px-3 py-1 disabled:opacity-50'
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTable;
