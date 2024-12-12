import { ScrollArea } from '@/components/ui/scroll-area'

interface RawContentProps {
  content: string
}

export function RawContent({ content }: RawContentProps) {
  return (
    <div className="h-full">
      <div className="text-sm text-muted-foreground pb-2">
        Press <kbd>{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</kbd>+<kbd>F</kbd> to search
      </div>
      <ScrollArea className="h-[calc(100%-3rem)] w-full rounded-md border">
        <pre>{content}</pre>
      </ScrollArea>
    </div>
  )
}
