'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { ChevronDown, Menu, MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Input } from './ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table'
import { Avatar, AvatarGroup, Tooltip } from '@chakra-ui/react'
import { Dialog } from './ui/dialog'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Date2 } from './date2'
import AppoinmentModal from './appoinment-modal'
import { Badge } from './ui/badge'

const data: Lawyers[] = [
  {
    id: 1,
    name: 'John Doe',
    speciality: 'Criminal Defense',
    firms: ['Law Firm A', 'Law Firm B'],
    address: '123 Main Street, Cityville',
    phone: '555-1234',
    availableTime: {
      from: '10:00 AM',
      to: '1:00 PM'
    }
  },
  {
    id: 2,
    name: 'Jane Smith',
    speciality: 'Family Law',
    firms: ['Law Firm C'],
    address: '456 Oak Avenue, Townsville',
    phone: '555-5678',
    availableTime: {
      from: '9:00 AM',
      to: '6:00 PM'
    }
  },
  {
    id: 3,
    name: 'Robert Johnson',
    speciality: 'Personal Injury',
    firms: ['Law Firm B', 'Law Firm D'],
    address: '789 Pine Road, Villagetown',
    phone: '555-9012',
    availableTime: {
      from: '10:00 AM',
      to: '9:00 PM'
    }
  },
  {
    id: 4,
    name: 'Alice Anderson',
    speciality: 'Real Estate Law',
    firms: ['Law Firm E', 'Law Firm F'],
    address: '101 Elm Street, Suburbia',
    phone: '555-3456',
    availableTime: {
      from: '9:00 AM',
      to: '5:00 PM'
    }
  },
  {
    id: 5,
    name: 'Michael Miller',
    speciality: 'Immigration Law',
    firms: ['Law Firm G'],
    address: '202 Maple Avenue, Downtown',
    phone: '555-6789',
    availableTime: {
      from: '2:00 PM',
      to: '4:00 PM'
    }
  },
  {
    id: 6,
    name: 'Emily Evans',
    speciality: 'Intellectual Property',
    firms: ['Law Firm H', 'Law Firm I'],
    address: '303 Cedar Lane, Tech City',
    phone: '555-1122',
    availableTime: {
      from: '10:30 AM',
      to: '3:00 PM'
    }
  },
  {
    id: 7,
    name: 'Daniel Davis',
    speciality: 'Corporate Law',
    firms: ['Law Firm J'],
    address: '404 Birch Boulevard, Business City',
    phone: '555-3344',
    availableTime: {
      from: '12:00 PM',
      to: '5:00 PM'
    }
  },
  {
    id: 8,
    name: 'Sophia Sanchez',
    speciality: 'Bankruptcy Law',
    firms: ['Law Firm K', 'Law Firm L'],
    address: '505 Pine Lane, Financeville',
    phone: '555-5566',
    availableTime: {
      from: '11:00 AM',
      to: '6:00 PM'
    }
  },
  {
    id: 9,
    name: 'William White',
    speciality: 'Environmental Law',
    firms: ['Law Firm M'],
    address: '606 Oak Street, Naturetown',
    phone: '555-7788',
    availableTime: {
      from: '1:00 PM',
      to: '6:00 PM'
    }
  },
  {
    id: 10,
    name: 'Olivia Oliver',
    speciality: 'Employment Law',
    firms: ['Law Firm N', 'Law Firm O'],
    address: '707 Maple Lane, Jobsville',
    phone: '555-9900',
    availableTime: {
      from: '9:00 AM',
      to: '6:00 PM'
    }
  }
]

export type Lawyers = {
  id: number
  name: string
  speciality: string
  firms: string[]
  address: string
  phone: string
  availableTime: {
    from: string
    to: string
  }
}

const DraggableRow = ({
  row,
  reorderRow
}: {
  row: Row<Lawyers>
  reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void
}) => {
  const [, dropRef] = useDrop({
    accept: 'row',
    drop: (draggedRow: Row<Lawyers>) => reorderRow(draggedRow.index, row.index)
  })

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    item: () => row,
    type: 'row'
  })

  return (
    <TableRow ref={previewRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <TableCell ref={dropRef}>
        <button ref={dragRef}>
          <Menu size={22} />
        </button>
      </TableCell>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable() {
  const [lawyersData, setLawyersData] = React.useState(data)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [bookingModal, setBookingModal] = React.useState<number | null>(null)

  const reorderRow = (draggedRowIndex: number, targetRowIndex: number) => {
    lawyersData.splice(
      targetRowIndex,
      0,
      lawyersData.splice(draggedRowIndex, 1)[0] as Lawyers
    )
    setLawyersData([...lawyersData])
  }

  const columns: ColumnDef<Lawyers>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue('name')}</div>
      )
    },
    {
      accessorKey: 'speciality',
      header: 'Speciality',
      cell: ({ row }) => <Badge>{row.getValue('speciality')}</Badge>
    },
    {
      accessorKey: 'firms',
      header: 'Firms',
      cell: ({ row }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const allfirms: string[] = row.getValue('firms')
        return (
          <Tooltip label={allfirms.join(', ')}>
            <AvatarGroup size='sm' max={2}>
              {allfirms.map((val: string) => (
                <Avatar backgroundColor='black' key={val} name={val} src='' />
              ))}
            </AvatarGroup>
          </Tooltip>
        )
      }
    },
    {
      accessorKey: 'availableTime',
      header: 'Available Time',
      cell: ({ row }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const date: {
          from: string
          to: string
        } = row.getValue('availableTime')

        return <Date2 date={date} />
      }
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row.getValue('phone')}</div>
    },
    {
      accessorKey: 'address',
      header: () => <div className='text-right'>Address</div>,
      cell: ({ row }) => {
        return <div className='text-right'>{row.getValue('address')}</div>
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const Lawyers = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setBookingModal(Lawyers.id)}>
                Book Appoinment
              </DropdownMenuItem>
              <DropdownMenuItem>View Lawyers details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  const table = useReactTable({
    data: lawyersData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getRowId: (row) => `${row.id}`,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter
    }
  })

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='w-full'>
        <div className='flex items-center py-4'>
          <Input
            placeholder='Filter Name, speciality, address...'
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className='max-w-sm'
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='ml-auto'>
                Columns <ChevronDown className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  <TableHead></TableHead>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table
                  .getRowModel()
                  .rows.map((row) => (
                    <DraggableRow
                      key={row.id}
                      row={row}
                      reorderRow={reorderRow}
                    />
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {bookingModal != null && (
          <Dialog open={true} onOpenChange={() => setBookingModal(null)}>
            <AppoinmentModal
              lawyer={data.find((each) => {
                return each.id === bookingModal
              })}
            />
          </Dialog>
        )}
      </div>
    </DndProvider>
  )
}
