import { ChangeEvent, useMemo, useState } from "react";
import "./CustomTable.css";

// Column interface: describes a table column, with label, key, and optional sortable flag
interface Column<T> {
  label: string;
  key: keyof T;
  sortable?: boolean;
}

// Props for the CustomTable: array of data and columns
interface CustomTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

// Generic CustomTable component
const CustomTable = <T extends Record<string, unknown>>({
  data,
  columns,
}: CustomTableProps<T>) => {
  // State for sorting, pagination, and search
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((row) =>
      columns.some((col) => {
        const cellValue = row[col.key];
        // If value is a Date, format it before searching
        if (cellValue instanceof Date) {
          return new Intl.DateTimeFormat("en-us")
            .format(cellValue)
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
        // Otherwise, convert to string and search
        return String(cellValue)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      })
    );
  }, [data, columns, searchQuery]);

  // Sort filtered data based on sortKey and sortDirection
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey] as string | number | Date;
      const bValue = b[sortKey] as string | number | Date;

      // Handle Date sorting
      if (aValue instanceof Date || bValue instanceof Date) {
        return sortDirection === "asc"
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      // String/number sorting
      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [filteredData, sortKey, sortDirection]);

  // Paginate sorted data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  // Calculate total number of pages
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Handle sorting when a column header is clicked
  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Handle page change (pagination)
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Handle change in rows per page
  const handleRowsPerPageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  // Handle search input change
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="custom-table-wrapper">
      {/* Filter and search controls */}
      <div className="custom-table-filter">
        <label htmlFor="rowsPerPage">
          Show
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          entries
        </label>
        <div>
          <label htmlFor="search">Search:</label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="type to search..."
          />
        </div>
      </div>

      {/* Table rendering */}
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {column.label}
                  {/* Sort icon */}
                  {column.sortable && (
                    <span
                      className={`custom-table-sort-icon ${
                        sortKey === column.key ? "custom-table-sort-active" : ""
                      }`}
                    >
                      {sortDirection === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={String(column.key)}>
                  {/* Format Date values */}
                  {row[column.key] instanceof Date
                    ? new Intl.DateTimeFormat("en-us").format(
                        new Date(row[column.key] as Date)
                      )
                    : String(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="custom-table-pagination">
        <span>
          Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
          {Math.min(currentPage * rowsPerPage, data.length)} of {data.length}{" "}
          entries
        </span>
        <div>
          Page {currentPage} of {totalPages}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTable;
