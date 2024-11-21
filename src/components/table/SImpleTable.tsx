import React from 'react'
import { TableProps } from '@/types/TableProps'
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableColumn,
  getKeyValue
} from '@nextui-org/react'

const SimpleTableComponent: React.FC<TableProps> = ({ columns, rows }) => {
  return (
    <div className="overflow-auto">
      <Table
        aria-label="Simple striped table"
        className="table-auto w-full table-striped table-striped-ghost border-spacing-y-8">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key} className="text-center">
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent={'No hay información'} items={rows}>
          {(item) => (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell key={column.key} className="text-center">
                  {getKeyValue(item, column.key)}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default SimpleTableComponent
