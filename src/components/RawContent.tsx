import { ScrollArea } from '@radix-ui/react-scroll-area'
import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'

interface RawContentProps {
  content: object
}

const RawContent: React.FC<RawContentProps> = ({ content }) => {
  return (
    <div className="h-full">
      <div className="text-sm text-muted-foreground pb-2">
        Press <kbd>{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</kbd>+<kbd>F</kbd> to search
      </div>
      <ScrollArea className="h-[calc(100%-3rem)] w-full rounded-md border">
        <JsonView className="text-xs" theme="winter-is-coming" src={content} />
      </ScrollArea>
    </div>
  )
}

export { RawContent }
