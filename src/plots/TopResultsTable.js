import Card from 'react-bootstrap/Card'
import { useState } from 'react'
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

export const TopResultsTable = ({data, cols}) => {
  const [colDefs, ] = useState(cols.map(col => ({field: col})))

  return (
    <Card>
      <div className="ag-theme-quartz" style={{ height: 500 }} >
        <AgGridReact rowData={data} columnDefs={colDefs}/>
      </div>
    </Card>
  )
}