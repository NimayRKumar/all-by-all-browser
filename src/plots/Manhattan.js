import React from 'react'
import Card from 'react-bootstrap/Card'
import Plot from 'react-plotly.js'
import { THRESHOLD, CHROMOSOMES, GREYS } from '../util/Enums'

const defaultStyle = {alignItems: 'center'}

const BORDER = {
  type: 'line',
  xref: 'paper',
  x0: 0,
  x1: 1,
  y0: THRESHOLD, 
  y1: THRESHOLD,
  line: { color: 'red', width: 1, dash: 'dash' }
}

const MANHATTAN_LAYOUT = {
  showlegend: false,
  xaxis: {
    title: 'Chromosome',
    tickvals: null,
    ticktext: CHROMOSOMES
  },
  yaxis: {title: '-log10 pvalue'},
  shapes: [BORDER],
  width: 850
}

const prepData = (trace, dyn) => {
  return {
    ...trace,
    text: trace.y.map(y => Math.pow(10, -y).toPrecision(3)),
    type: 'scattergl',
    mode: 'markers',
    marker: {color: GREYS[trace.chr % GREYS.length]},
    xlab: 'x1',
    hovertemplate: dyn ? 'p-value: %{text}' : '',
    hoverinfo: 'skip'
  }
}

export const Manhattan = ({stat, dyn, ticks}) => {
  const dynData = dyn.filter(datum => datum !== null).map(datum => {return prepData(datum, true)})
  const statData = stat.filter(datum => datum != null).map(datum => {return prepData(datum, false)})
  const data = [...statData, ...dynData]

  MANHATTAN_LAYOUT.xaxis.tickvals = ticks

  return (
    <Card style={defaultStyle}>
      <Card.Body>
        <Plot
          data={data}
          layout={MANHATTAN_LAYOUT}
        />
      </Card.Body>
    </Card>
  )
}