export interface FrameLine {
  type: 'frame'
  namespace: string
  method: string
  file: string
  lineNum: number
  raw: string
  isMetabaseFrame: boolean
  codeUrl: string | null
}

export interface ExceptionLine {
  type: 'exception'
  raw: string
  formatted: string
}

/**
 * Clojure objects can't typically be formatted using JSON formatting, so this
 * function is making this possible.
 * @param str Clojure string containing an object structure to pretty print
 * @returns The result formatted in a readable format
 */
export const prettyPrintClojure = (str: string) => {
  let depth = 0
  let inString = false
  let formatted = ''

  for (let i = 0; i < str.length; i++) {
    const indent = '  '
    const char = str[i]

    // Handle string literals
    if (char === '"' && str[i - 1] !== '\\') {
      inString = !inString
      formatted += char
      continue
    }

    if (inString) {
      formatted += char
      continue
    }

    // Handle brackets and braces
    if (char === '{' || char === '[' || char === '(') {
      depth++
      formatted += char + '\n' + indent.repeat(depth)
    } else if (char === '}' || char === ']' || char === ')') {
      depth--
      formatted += '\n' + indent.repeat(depth) + char
    } else if (
      char === ' ' &&
      (str[i - 1] === ',' || str[i - 1] === '}' || str[i - 1] === ']' || str[i - 1] === ')')
    ) {
      formatted += '\n' + indent.repeat(depth)
    } else {
      formatted += char
    }
  }
  return formatted
}

/**
 * Parses stacktrace lines for formatting purposes
 * @param lines Exception stacktrace lines
 * @param parseMetabaseOnly Whether to only parse Metabase stacktrace frames
 * @returns Parsed stack traces suitable for formatting
 */
export const parseStacktraceLines = (lines: string[], parseMetabaseOnly: boolean) => {
  if (!lines) return []

  const parsedLines = new Array<ExceptionLine | FrameLine>()

  // Process first line (exception)
  if (lines[0]) {
    const excLine = lines[0]
    // Extract the message part and the data structure for formatting purposes
    const match = excLine.match(/^([^{[\n]+)({.+|[.+])/s)
    if (match) {
      // Ignore first argument
      match.shift()
      const [prefix, clojureData] = match
      parsedLines.push({
        type: 'exception',
        raw: excLine,
        formatted: prefix + prettyPrintClojure(clojureData),
      })
    }
  }

  // Process stack frames, eaxtracting each piece for formatting purposes
  const framePattern = /\s*at\s+([a-zA-Z0-9.$_/]+(?:\$[^(]+)?)\s*\(([\w.]+):(\d+)\)/

  lines.forEach((frameLine) => {
    const match = frameLine.match(framePattern)
    if (match) {
      // Ignore first argument
      match.shift()
      const [fullMethod, file, lineNum] = match
      const lastDotIndex = fullMethod.lastIndexOf('.')
      const namespace = fullMethod.substring(0, lastDotIndex)
      const method = fullMethod.substring(lastDotIndex + 1)
      const path = namespace.substring(0, namespace.lastIndexOf('.')).replaceAll('.', '/')

      const isMetabaseFrame = namespace.startsWith('metabase')
      const codeUrl = isMetabaseFrame
        ? `https://github.com/metabase/metabase/tree/master/src/${path}/${file}#L${lineNum}`
        : null

      if (isMetabaseFrame || !parseMetabaseOnly) {
        parsedLines.push({
          type: 'frame',
          namespace,
          method,
          file,
          lineNum: parseInt(lineNum),
          raw: frameLine,
          isMetabaseFrame,
          codeUrl,
        })
      }
    }
  })

  return parsedLines
}
