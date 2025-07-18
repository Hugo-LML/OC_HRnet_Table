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

type Employee = {
  firstName: string;
  lastName: string;
  department: string;
};

const data: Employee[] = [
  { firstName: 'Alice', lastName: 'Smith', department: 'HR' },
  { firstName: 'Bob', lastName: 'Johnson', department: 'Engineering' },
];

const columns = [
  { label: 'First Name', key: 'firstName', sortable: true },
  { label: 'Last Name', key: 'lastName' },
  { label: 'Department', key: 'department', sortable: true },
];

<CustomTable<Employee> data={data} columns={columns} />;
```

## API

### Props

#### `CustomTable<T>`

| Prop      | Type               | Description                                             |
|-----------|--------------------|---------------------------------------------------------|
| `data`    | `T[]`              | The list of rows to display in the table               |
| `columns` | `Column<T>[]`     | Array of column definitions used to render the table   |

#### `Column<T>`

```ts
interface Column<T> {
  label: string;
  key: keyof T;
  sortable?: boolean;
}
```

- `label`: The text displayed in the column header.
- `key`: The key used to access the corresponding field in each row object.
- `sortable` *(optional)*: Whether the column is sortable by clicking the header.

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
    { label: 'First Name', key: 'firstName', sortable: true },
    { label: 'Last Name', key: 'lastName' },
    { label: 'Department', key: 'department', sortable: true },
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