interface TableProps {
    headers: string[];
    children: React.ReactNode;
  }
  
  function Table({ headers, children }: TableProps) {
    return (
      <table className="table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
  
        <tbody>{children}</tbody>
      </table>
    );
  }
  
  export default Table;