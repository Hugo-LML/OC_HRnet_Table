# CustomTable Component

A reusable and generic table component built with **React** and **TypeScript**, designed to support flexible column definitions and data types, with built-in global search filtering.

## Features

- Generic typing with full TypeScript support
- Customizable columns and rendering
- Global search filter
- Styled with custom CSS (import manually)

## Installation

```bash
npm install @hugo-lml/hr-net-table
```

or

```bash
yarn add @hugo-lml/hr-net-table
```

## Usage

```tsx
import { CustomTable } from '@hugo-lml/hr-net-table';
import '@hugo-lml/hr-net-table/dist/index.css';

const data = [
  { firstName: 'Alice', lastName: 'Smith', department: 'HR' },
  { firstName: 'Bob', lastName: 'Johnson', department: 'Engineering' },
];

const columns = [
  { header: 'First Name', accessor: 'firstName' },
  { header: 'Last Name', accessor: 'lastName' },
  { header: 'Department', accessor: 'department' },
];

<CustomTable data={data} columns={columns} />
```

## API

### Props

#### `CustomTable<T>`

| Prop     | Type                                | Description                                                  |
|----------|-------------------------------------|--------------------------------------------------------------|
| `data`   | `T[]`                               | The list of rows to display in the table                     |
| `columns`| `Column<T>[]`                       | Column definitions with headers and accessors                |

#### `Column<T>`

```ts
type Column<T> = {
  header: string;
  accessor: keyof T;
};
```

- `header`: The text displayed in the column header.
- `accessor`: The key used to access the data from each row object.

## Example with Types

```ts
type Employee = {
  firstName: string;
  lastName: string;
  department: string;
};
```

```tsx
<CustomTable<Employee>
  data={employeeList}
  columns={[
    { header: 'First Name', accessor: 'firstName' },
    { header: 'Last Name', accessor: 'lastName' },
    { header: 'Department', accessor: 'department' },
  ]}
/>
```

## Styling

You need to manually import the CSS:

```tsx
import '@hugo-lml/hr-net-table/dist/index.css';
```

## 📜 License

ISC – © Hugo Lml