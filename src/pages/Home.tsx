import { FC } from 'react';
import CustomTable from '../components/CustomTable/CustomTable';

const Home: FC = () => {
  return (
    <div>
      <h1 className='text-xl'>Hello world!</h1>
      <p className='mt-4'>Here is the repo of OC_HRnet_Table</p>
      <div className='mt-20 px-8'>
        <CustomTable
          data={[
            { id: 1, name: 'John Doe', age: 30, email: 'john@doe', birthdate: new Date('1993-01-01') },
            { id: 2, name: 'Jane Smith', age: 25, email: 'jane@smith', birthdate: new Date('1998-02-02') },
            { id: 3, name: 'Alice Johnson', age: 28, email: 'alice@johnson', birthdate: new Date('1995-03-03') },
            { id: 4, name: 'Bob Brown', age: 35, email: 'bob@brown', birthdate: new Date('1988-04-04') },
          ]}
          columns={[
            { key: 'id', label: 'ID', sortable: true },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'age', label: 'Age', sortable: true },
            { key: 'email', label: 'Email', sortable: false },
            { key: 'birthdate', label: 'Birthdate', sortable: true },
          ]}
        />
      </div>
    </div>
  );
};

export default Home;
