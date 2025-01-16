import { describe, it, expect } from 'vitest'

import { parseStacktraceLines, prettyPrintClojure } from './stacktraces'

describe('stacktraces', () => {
  const exceptionClojure =
    'clojure.lang.ExceptionInfo: Unknown type of ref {:ref [:= {:lib/uuid \"4ef19767-9f89-46b6-98d6-b0dd146eabd5\"} [:field {:base-type :type/Text, :lib/uuid \"6d64c71f-dd2c-4f7d-a9b0-cf0bd082962a\"} \"source\"] [:value {:effective_type :type/Text, :base-type :type/Text, :database-type \"text\", :effective-type :type/Text, :lib/uuid \"044b07d9-7b78-4903-a194-fe3ba4a46a4d\"} \"pylon\"]], :toucan2/context-trace [[\"parse args\" {:toucan2.query/query-type :toucan.query-type/insert.update-count, :toucan2.query/unparsed-args (:model/FieldUsage ())}]]}'
  const formattedException = `clojure.lang.ExceptionInfo: Unknown type of ref {
  :ref [
    := {
      :lib/uuid "4ef19767-9f89-46b6-98d6-b0dd146eabd5"
    }
    [
      :field {
        :base-type :type/Text,
        :lib/uuid "6d64c71f-dd2c-4f7d-a9b0-cf0bd082962a"
      }
      "source"
    ]
    [
      :value {
        :effective_type :type/Text,
        :base-type :type/Text,
        :database-type "text",
        :effective-type :type/Text,
        :lib/uuid "044b07d9-7b78-4903-a194-fe3ba4a46a4d"
      }
      "pylon"
    ]
  ],
  :toucan2/context-trace [
    [
      "parse args" {
        :toucan2.query/query-type :toucan.query-type/insert.update-count,
        :toucan2.query/unparsed-args (
          :model/FieldUsage (
            
          )
        )
      }
    ]
  ]
}`

  const metabaseFrame =
    '\tat metabase.lib.equality$find_matching_column32424__32427.invokeStatic(equality.cljc:308)'
  const otherFrame = '\tat grouper.core$body_fn$fn__66831.invoke(core.clj:72)'

  const stacktrace = [exceptionClojure, metabaseFrame, otherFrame]
  it('formats Clojure data structure correctly', () => {
    expect(prettyPrintClojure(exceptionClojure)).toEqual(formattedException)
  })

  it('parses stackframes properly', () => {
    const parsed = parseStacktraceLines(stacktrace, false)
    expect(parsed).not.toBeNull()
    expect(parsed.length).toEqual(3)
    expect(parsed[0]).toEqual({
      type: 'exception',
      raw: exceptionClojure,
      formatted: formattedException,
    })
    expect(parsed[1]).toEqual({
      type: 'frame',
      method: 'invokeStatic',
      namespace: 'metabase.lib.equality$find_matching_column32424__32427',
      raw: metabaseFrame,
      file: 'equality.cljc',
      codeUrl:
        'https://github.com/metabase/metabase/tree/master/src/metabase/lib/equality.cljc#L308',
      isMetabaseFrame: true,
      lineNum: 308,
    })
    expect(parsed[2]).toEqual({
      type: 'frame',
      method: 'invoke',
      namespace: 'grouper.core$body_fn$fn__66831',
      raw: otherFrame,
      file: 'core.clj',
      codeUrl: null,
      isMetabaseFrame: false,
      lineNum: 72,
    })
  })
  it('filters for Metabase frames properly', () => {
    const parsed = parseStacktraceLines(stacktrace, true)
    expect(parsed).not.toBeNull()
    expect(parsed.length).toEqual(2)
  })
})
