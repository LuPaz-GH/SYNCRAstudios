import { Fragment } from 'react'

// Divide un texto en palabras que suben una por una cuando el bloque aparece.
// "start" permite continuar la secuencia de demoras entre varios fragmentos del mismo título.
export default function RevealText({ text, start = 0, mark = false }) {
  const words = text.split(' ').map((word, i) => (
    <Fragment key={i}>
      <span className="word">
        <span style={{ '--i': start + i }}>{word}</span>
      </span>{' '}
    </Fragment>
  ))
  return mark ? <span className="mark">{words}</span> : words
}
