'use client'
import { type TableProps } from '@/types/TableProps'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
  Selection,
  Card
} from '@nextui-org/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {
  FaColumns,
  FaDownload,
  FaFileExcel,
  FaFilePdf,
  FaPlus,
  FaSearch
} from 'react-icons/fa'
import { FiFilter } from 'react-icons/fi'

import { useAsyncList } from '@react-stately/data'

const TableComponent: React.FC<TableProps> = ({
  columns = [],
  rows = [],
  linkButton,
  linkButtonText = 'Agregar',
  showHeader = true,
  showFooter = true,
  removeWrapper = false,
  loading = false,
  button
}) => {
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<Selection>('all')
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(columns.map((column) => column.key))
  )

  const router = useRouter()
  const pages = Math.ceil(rows.length / rowsPerPage)

  const filteredItems = React.useMemo(() => {
    let filteredRows = rows

    if (searchTerm) {
      filteredRows = filteredRows.filter((row) =>
        Object.values(row).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    if (statusFilter !== 'all') {
      filteredRows = filteredRows.filter((row) =>
        Array.from(statusFilter).includes(row.status)
      )
    }

    return filteredRows
  }, [rows, searchTerm, statusFilter])

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const list = useAsyncList({
    async load() {
      return { items: rows }
    },
    async sort({ items, sortDescriptor }) {
      if (!sortDescriptor.column) {
        // Retornamos los elementos sin orden si no hay columna para ordenar
        return { items }
      }

      return {
        items: items.sort((a, b) => {
          const first = a[sortDescriptor.column as keyof typeof a]
          const second = b[sortDescriptor.column as keyof typeof b]

          let cmp =
            (parseInt(first as string) || first) <
            (parseInt(second as string) || second)
              ? -1
              : 1

          if (sortDescriptor.direction === 'descending') {
            cmp *= -1
          }

          return cmp
        })
      }
    }
  })

  return (
    <>
      {loading ? (
        <div className="w-full min-h-[222px] flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <Table
          className="flex items-center justify-center"
          selectionMode="multiple"
          sortDescriptor={list.sortDescriptor}
          onSortChange={list.sort}
          removeWrapper={removeWrapper}
          aria-label="Table"
          color="danger"
          topContent={
            showHeader && (
              <Card className="w-full shadow-small border-1 border-slate-200 mb-4">
                <div className="flex gap-4 p-4 w-full">
                  <div className="flex items-center justify-start w-3/5">
                    <Input
                      isClearable
                      size="lg"
                      placeholder="Buscar..."
                      startContent={<FaSearch />}
                      value={searchTerm}
                      onClear={() => setSearchTerm('')}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-end w-2/5 gap-2">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          className="w-min"
                          size="md"
                          variant="bordered"
                          startContent={<FiFilter />}>
                          Filtrar
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        selectionMode="multiple"
                        selectedKeys={statusFilter}
                        onSelectionChange={setStatusFilter}>
                        <DropdownItem key="active">Activo</DropdownItem>
                        <DropdownItem key="inactive">Inactivo</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          className="w-min"
                          size="md"
                          variant="bordered"
                          startContent={<FaColumns />}>
                          Columnas
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        selectionMode="multiple"
                        selectedKeys={visibleColumns}
                        onSelectionChange={setVisibleColumns}>
                        {columns.map((column) => (
                          <DropdownItem key={column.key}>
                            {column.label}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                    <Button
                      className="w-min"
                      size="md"
                      color="success"
                      variant="bordered"
                      startContent={<FaFileExcel />}>
                      Exportar
                    </Button>
                    {linkButton && (
                      <Button
                        className="w-min"
                        variant="solid"
                        size="md"
                        color="danger"
                        onPress={() => {
                          router.push(linkButton)
                        }}
                        startContent={<FaPlus size="20" />}>
                        {linkButtonText}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          }
          bottomContent={
            showFooter && (
              <>
                <div className="flex items-center justify-center w-full">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    size="sm"
                    color="danger"
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                  />
                </div>
                <p className="flex text-slate-600 text-sm">
                  Mostrando {items.length} de {rows.length} registros
                </p>
              </>
            )
          }>
          <TableHeader>
            {columns
              .filter((column) =>
                Array.from(visibleColumns).includes(column.key)
              )
              .map((column) => (
                <TableColumn
                  key={column.key}
                  className="text-center"
                  allowsSorting>
                  {column.label}
                </TableColumn>
              ))}
          </TableHeader>
          <TableBody emptyContent={'No hay información'} items={list.items}>
            {(item) => (
              <TableRow key={item.key}>
                {columns
                  .filter((column) =>
                    Array.from(visibleColumns).includes(column.key)
                  )
                  .map((column) => (
                    <TableCell key={column.key} className="text-center">
                      {getKeyValue(item, column.key)}
                    </TableCell>
                  ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </>
  )
}

export default TableComponent
