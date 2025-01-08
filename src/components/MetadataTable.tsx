import React from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface MetadataTableProps {
  metadata: Record<string, any>
}

const MetadataTable: React.FC<MetadataTableProps> = ({ metadata }) => {
  const renderValue = (value: any): React.ReactNode => {
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside">
          {value.map((item, index) => (
            <li key={index}>{renderValue(item)}</li>
          ))}
        </ul>
      )
    } else if (typeof value === 'object' && value !== null) {
      return (
        <Table>
          <TableBody>
            {Object.entries(value).map(([subKey, subValue]) => (
              <TableRow key={subKey}>
                <TableCell className="font-medium">{subKey}</TableCell>
                <TableCell>{renderValue(subValue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    }
    return typeof value === 'string' ? value : JSON.stringify(value)
  }

  const renderTable = (data: Record<string, any>) => (
    <div className="mb-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/5">Key</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(data).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell className="font-medium">{key}</TableCell>
              <TableCell>{renderValue(value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  if (!metadata || !Object.keys(metadata).length) {
    return <p className="text-center">No data 🙁</p>
  }

  return <ScrollArea className="h-[calc(100vh-12rem)] w-full">{renderTable(metadata)}</ScrollArea>
}

export { MetadataTable }
