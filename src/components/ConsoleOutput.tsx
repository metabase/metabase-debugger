import { ChevronRight } from 'lucide-react'
import React, { useMemo, useState } from 'react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ConsoleOutputProps {
  errors: string[]
  onErrorCountChange?: (number: number) => void
}

const getLevelStyle = (level: string) => {
  switch (level) {
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
    case 'warn':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
    case 'info':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ errors, onErrorCountChange }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setOpenItems((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]
    )
  }

  const parsedErrors = useMemo(() => {
    const parsed = errors.map((error, index) => {
      const cleanError = error?.replace(/^"|"$/g, '').replace(/\\n/g, '\n')
      let message = cleanError
      let jsonData = null
      let stack = ''
      let level = 'error'

      try {
        // Try to parse as JSON first
        const parsedJson = JSON.parse(cleanError)
        if (parsedJson.level && parsedJson.message) {
          jsonData = parsedJson
          message = parsedJson.message
          stack = parsedJson.stack || ''
          level = parsedJson.level
          return {
            id: index,
            level,
            message,
            stack,
            details: jsonData,
          }
        }
      } catch (e) {
        // If JSON parsing fails, try the other formats
        try {
          const jsonMatch = cleanError.match(/(?:Error:|Warning:)({.*})/i)
          if (jsonMatch && jsonMatch[1]) {
            jsonData = JSON.parse(jsonMatch[1])
            message = cleanError.split('{')[0].trim()
            if (jsonData.status) message += ` Status: ${jsonData.status}`
            if (jsonData.data) message += ` ${jsonData.data}`
          }
        } catch (innerE) {
          // If all JSON parsing fails, fall back to original parsing logic
          const parts = cleanError.split('"').filter(Boolean)
          message = parts[0] || cleanError
        }
      }

      return {
        id: index,
        level: message.startsWith('Warning:') ? 'warn' : 'error',
        message,
        stack: message.split('\n').slice(1).join('\n'),
        details: jsonData,
      }
    })

    const errorCount = parsed.filter((error) => error.level === 'error').length
    onErrorCountChange?.(errorCount)

    return parsed
  }, [errors, onErrorCountChange])

  const filteredErrors = useMemo(
    () =>
      parsedErrors.filter((error) =>
        error.message.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [parsedErrors, searchQuery]
  )

  if (!parsedErrors.length) {
    return <div className="p-5">No errors to show 🙂</div>
  }

  return (
    <>
      <Input
        type="text"
        placeholder="Search logs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      <ScrollArea className="h-[calc(100vh-240px)] w-full rounded-md border">
        {filteredErrors.map((error) => (
          <Collapsible
            key={error.id}
            open={openItems.includes(error.id)}
            onOpenChange={() => toggleItem(error.id)}
            className={`border-b ${getLevelStyle(error.level)}`}
          >
            <CollapsibleTrigger className="flex items-center w-full p-2 hover:bg-black/5">
              <ChevronRight
                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                  openItems.includes(error.id) ? 'rotate-90' : ''
                }`}
              />
              <div className="flex items-center ml-2">
                <span className="font-mono text-sm font-semibold text-left">
                  {error.message.split('\n')[0]}
                </span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="CollapsibleContent">
              {error.stack && (
                <pre className="p-2 pl-8 text-xs font-mono opacity-75 whitespace-pre-wrap">
                  {error.stack}
                </pre>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </ScrollArea>
    </>
  )
}
