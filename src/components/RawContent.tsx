import { ScrollArea } from '@radix-ui/react-scroll-area'

interface RawContentProps {
  content: Record<string, any> | Record<string, any>[]
}

const RawContent: React.FC<RawContentProps> = ({ content }) => {
  if (!content) {
    return null
  }

  return (
    <div className="h-[calc(100vh-24rem)] flex flex-col">
      <div className="text-sm text-muted-foreground pb-2">
        Press <kbd>{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</kbd>+<kbd>F</kbd> to search
      </div>
      <ScrollArea className="h-[calc(100vh-24rem)] w-full border overflow-auto bg-gray-100 rounded-md ">
        <pre className="text-xs h-full flex p-4 whitespace-pre-wrap">
          {JSON.stringify(content, null, 2)}
        </pre>
      </ScrollArea>
    </div>
  )
}

export { RawContent }
