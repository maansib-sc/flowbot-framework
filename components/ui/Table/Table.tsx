import { useState } from 'react';
import styles from './Table.module.css'; // Import CSS module

interface Product {
  id: number;
  brand: string;
  description: string;
  price: string;
  model: string;
}

interface TableProps {
    products: Product[];
    onChange: (value: string) => void;
}

const Table: React.FC<TableProps> = ({ products,onChange }) => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortedColumn, setSortedColumn] = useState<string>('brand');

  const handleSort = (column: string) => {
    if (sortedColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortedColumn(column);
      setSortOrder('asc');
    }
  };

  const sortedProducts = [...products].sort((a: any, b: any) => {
    const comparison = sortOrder === 'asc' ? -1 : 1;
    if (a[sortedColumn] < b[sortedColumn]) return comparison;
    if (a[sortedColumn] > b[sortedColumn]) return -comparison;
    return 0;
  });

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th style={{width:"20px"}} onClick={() => handleSort('')}></th>
          <th onClick={() => handleSort('brand')}>Brand / Model Number</th>
          <th onClick={() => handleSort('description')}>Description</th>
          <th onClick={() => handleSort('price')}>Price</th>
        </tr>
      </thead>
      <tbody>
        {sortedProducts.map((product) => (
          <tr key={product.id} className={selectedRow === product.id ? styles.selectedRow : ''}>
            <td className={styles.selectCell}>
              <input
                type="radio"
                value={product.id}
                checked={selectedRow === product.id}
                onChange={() => {
                    setSelectedRow(product.id)
                    onChange(String(product.id))
                }}
              />
            </td>
            <td>
            <div className={styles.brandcell}>
                <span className={styles.brand}>
              {product.brand}
                </span>
                <span className={styles.model}>
                    {product.model}
                </span>

              </div>
            </td>
            <td>{product.description}</td>
            <td>{product.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
