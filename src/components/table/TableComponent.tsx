'use client'
import React, { useEffect, useState } from 'react'
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
  Card,
  SortDescriptor
} from '@nextui-org/react'

import { useRouter } from 'next/navigation'
import {
  FaColumns,
  FaFileExcel,
  FaPen,
  FaPlus,
  FaSearch,
  FaTrash
} from 'react-icons/fa'

import { type TableProps } from '@/types/TableProps'
import { useSelectedRecords } from '@/store/tableRecords/tableRecordsSlice'

const TableComponent: React.FC<TableProps> = ({
  columns = [],
  rows = [],
  linkButton,
  linkButtonText = 'Agregar',
  showHeader = true,
  showFooter = true,
  removeWrapper = false,
  loading = false,
  deleteButton = true,
  editButton = true,
  button,
  onSelectedIdsChange,
  onEditSelected,
  onDeleteSelected
}) => {
  const { addToSelectedIds, clearSelectedIds } = useSelectedRecords()
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set())
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<Selection>('all')
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(columns.map((column) => column.key))
  )
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: '',
    direction: 'ascending'
  })

  const router = useRouter()

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

    // Aplicar ordenamiento
    if (sortDescriptor.column) {
      filteredRows = [...filteredRows].sort((a, b) => {
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

    return filteredRows
  }, [rows, searchTerm, statusFilter, sortDescriptor])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor)
  }

  // Opciones para el selector de registros por página
  const rowsPerPageOptions = [
    { key: '5', value: 5 },
    { key: '10', value: 10 },
    { key: '15', value: 15 },
    { key: '20', value: 20 },
    { key: '25', value: 25 },
    { key: '30', value: 30 }
  ]

  // Manejador para cambiar registros por página
  const onRowsPerPageChange = (value: number) => {
    setRowsPerPage(value)
    setPage(1) // Reset a la primera página cuando cambia el número de registros
  }

  // Manejador para cambiar los ids de los registros seleccionados
  useEffect(() => {
    clearSelectedIds()
    if (selectedKeys instanceof Set) {
      selectedKeys.forEach((key) => addToSelectedIds(Number(key)))
    } else if (selectedKeys === 'all') {
      rows.forEach((row) => addToSelectedIds(row.id))
    }
  }, [addToSelectedIds, clearSelectedIds, selectedKeys, rows])

  const isEditEnabled = selectedKeys instanceof Set && selectedKeys.size === 1
  const isDeleteEnabled = selectedKeys instanceof Set && selectedKeys.size > 0

  return (
    <>
      {loading ? (
        <div className="w-full min-h-[222px] flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            className="flex items-center justify-center"
            isStriped
            selectionMode="multiple"
            onSelectionChange={setSelectedKeys}
            sortDescriptor={sortDescriptor}
            onSortChange={handleSortChange}
            removeWrapper={removeWrapper}
            aria-label="Table"
            color="danger"
            topContent={
              showHeader && (
                <Card className="w-full shadow-small border-1 border-slate-200 mb-4 ">
                  <div className="flex gap-4 p-4 w-full">
                    <div className="items-center justify-start md:w-3/5 hidden md:flex ">
                      <Input
                        isClearable
                        size="lg"
                        placeholder="Buscar..."
                        startContent={<FaSearch />}
                        value={searchTerm}
                        onClear={() => setSearchTerm('')}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-1/3"
                      />
                    </div>
                    <div className="flex items-center justify-end w-2/5 gap-2">
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
                      {/* <Button
                        className="w-min hidden md:flex"
                        size="md"
                        color="success"
                        variant="bordered"
                        startContent={<FaFileExcel />}>
                        Exportar
                      </Button> */}
                      {linkButton && (
                        <Button
                          className="w-min hidden md:flex"
                          variant="solid"
                          size="md"
                          color="danger"
                          onPress={() => {
                            router.push(linkButton)
                          }}
                          startContent={<FaPlus />}>
                          {linkButtonText}
                        </Button>
                      )}
                      {deleteButton && (
                        <Button
                          className="w-min hidden md:flex"
                          variant="bordered"
                          size="md"
                          color="danger"
                          startContent={<FaTrash />}
                          isDisabled={!isDeleteEnabled}
                          onPress={onDeleteSelected}>
                          Eliminar
                        </Button>
                      )}
                      {editButton && (
                        <Button
                          className="w-min hidden md:flex"
                          variant="bordered"
                          size="md"
                          color="warning"
                          startContent={<FaPen />}
                          isDisabled={!isEditEnabled}
                          onPress={onEditSelected}>
                          Editar
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            }
            bottomContent={
              showFooter && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between px-2 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-small text-default-400">
                        Registros por página:
                      </span>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button variant="bordered" size="sm">
                            {rowsPerPage}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Rows per page"
                          selectionMode="single"
                          selectedKeys={new Set([rowsPerPage.toString()])}
                          onSelectionChange={(selection) => {
                            const value = Array.from(selection)[0] as string
                            onRowsPerPageChange(Number(value))
                          }}>
                          {rowsPerPageOptions.map((option) => (
                            <DropdownItem key={option.key}>
                              {option.value}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="danger"
                      page={page}
                      total={pages}
                      onChange={setPage}
                    />
                    <div className="hidden sm:flex w-[30%] justify-end gap-2">
                      <span className="text-small text-default-400">
                        {items.length} de {filteredItems.length} registros
                      </span>
                    </div>
                  </div>
                </div>
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
            <TableBody emptyContent={'No hay información'} items={items}>
              {(item) => (
                <TableRow key={item.id}>
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
        </div>
      )}
    </>
  )
}

export default TableComponent
