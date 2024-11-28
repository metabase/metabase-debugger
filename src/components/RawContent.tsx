import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface RawContentProps {
  content: string
}

export function RawContent({ content }: RawContentProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [matches, setMatches] = useState<number[]>([])
  const preRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    if (searchTerm) {
      const indices: number[] = []
      let index = content.toLowerCase().indexOf(searchTerm.toLowerCase())
      while (index !== -1) {
        indices.push(index)
        index = content.toLowerCase().indexOf(searchTerm.toLowerCase(), index + 1)
      }
      setMatches(indices)
      setCurrentMatchIndex(0)
    } else {
      setMatches([])
      setCurrentMatchIndex(0)
    }
  }, [searchTerm, content])

  useEffect(() => {
    if (matches.length > 0 && preRef.current) {
      const element = preRef.current
      const highlightedElement = element.querySelector('.bg-yellow-500')

      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }
  }, [currentMatchIndex, matches])

  const handleNext = () => {
    if (matches.length > 0) {
      setCurrentMatchIndex((prev) => (prev + 1) % matches.length)
    }
  }

  const handlePrevious = () => {
    if (matches.length > 0) {
      setCurrentMatchIndex((prev) => (prev - 1 + matches.length) % matches.length)
    }
  }

  const highlightedText = () => {
    if (!searchTerm) return content

    const parts = []
    let lastIndex = 0

    matches.forEach((matchIndex, index) => {
      parts.push(content.slice(lastIndex, matchIndex))
      const matchText = content.slice(matchIndex, matchIndex + searchTerm.length)
      parts.push(
        `<span class="${
          index === currentMatchIndex ? 'bg-yellow-500 text-black' : 'bg-yellow-200 text-black'
        }" ${index === currentMatchIndex ? 'id="current-match"' : ''}>${matchText}</span>`
      )
      lastIndex = matchIndex + searchTerm.length
    })

    parts.push(content.slice(lastIndex))
    return parts.join('')
  }

  return (
    <div className="h-full">
      <div className="sticky -top-4 z-10 bg-background">
        <div className="flex items-center gap-2 mb-2">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm rounded-none"
          />
          {matches.length > 1 && (
            <>
              <Button onClick={handlePrevious} variant="outline">
                Previous
              </Button>
              <Button onClick={handleNext} variant="outline">
                Next
              </Button>
            </>
          )}
          {matches.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {matches.length === 1
                ? '1 match found'
                : `${currentMatchIndex + 1} of ${matches.length} matches`}
            </span>
          )}
        </div>
      </div>
      <ScrollArea className="h-[calc(100%-3rem)] w-full rounded-md border">
        <pre
          ref={preRef}
          dangerouslySetInnerHTML={{ __html: highlightedText() }}
          className="p-4 text-sm font-mono"
        />
      </ScrollArea>
    </div>
  )
}
