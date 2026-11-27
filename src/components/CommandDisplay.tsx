import React from 'react'

/*
 * Add soft breaks ("line break opportunities") after commas and inside long strings to let
 * cmdline break gracefully without interfering with copy/paste
 */
function injectSoftBreaks(str: string) {
  return str
    ?.split(/(\S+?,)/) // commas
    .flatMap((s) => s.split(/(\w{50})/)) // words > 50 chars
    .filter((s) => s) // filter blanks
}

function CommandDisplay({ cmdLine }: { cmdLine: string | undefined }) {
  const withSyntaxHighlights = cmdLine?.split(/\s+/).flatMap((w, i) => {
    const withSplits = injectSoftBreaks(w)
    let className: string = ''

    if (i === 0) {
      // command name
      className = 'font-bold'
    } else if (w.startsWith('-')) {
      // flags
      className = 'font-bold text-indigo-800'
    } else if (w.match(/^(\/\w+)+/)) {
      // file names
      className = 'text-emerald-800'
    } else if (w.match(/([^,]+=[^,]+,?)+$/)) {
      // parameter string
      className = 'font-italic text-purple-800'
    }

    return (
      <span className="mr-1">
        {withSplits.map((str, i) => (
          <React.Fragment key={i}>
            <span className={className}>{str}</span>
            <wbr />
          </React.Fragment>
        ))}
      </span>
    )
  })

  return (
    <>
      <span className="font-bold">Command:</span>
      <span className="font-mono">{withSyntaxHighlights}</span>
    </>
  )
}

export default CommandDisplay
