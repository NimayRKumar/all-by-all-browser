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

const HUDSON_LAYOUT = {
  grid: {rows: 2, columns: 1, pattern: 'independent'},
  width: 1000, height: 750,
  showlegend: false,
  xaxis: { tickvals: null, ticktext: CHROMOSOMES},
  xaxis2: { tickvals: null, ticktext: CHROMOSOMES, title: 'Chromosome'},
  yaxis: {title: '-log10 pvalue'},
  yaxis2: {title: '-log10 pvalue', autorange: 'reversed'},
  shapes: [BORDER, {...BORDER, yref: 'y2'}],
}

const prepData = (trace, dyn, top) => {
  return {
    ...trace,
    text: trace.y.map(y => Math.pow(10, -y).toPrecision(3)),
    type: 'scattergl',
    mode: 'markers',
    marker: {color: GREYS[trace.chr % GREYS.length]},
    xaxis: top ? 'x1' : 'x2',
    yaxis: top ? 'y1' : 'y2',
    hovertemplate: dyn ? 'p-value: %{text}' : '',
    hoverinfo: 'skip'
  }
}

export const Hudson = ({dynTop, statTop, dynBott, statBott, ticksTop, ticksBott}) => {
  const dynDataTop = dynTop.filter(datum => datum != null).map(datum => {return prepData(datum, true, true)})
  const statDataTop = statTop.filter(datum => datum != null).map(datum => {return prepData(datum, false, true)})

  const dynDataBott = dynBott.filter(datum => datum != null).map(datum => {return prepData(datum, true, false)})
  const statDataBott = statBott.filter(datum => datum != null).map(datum => {return prepData(datum, false, false)})

  const data = [...dynDataTop, ...statDataTop, ...dynDataBott, ...statDataBott]
  HUDSON_LAYOUT.xaxis.tickvals = ticksTop
  HUDSON_LAYOUT.xaxis2.tickvals = ticksBott
  
  return (
    <Card style={defaultStyle}>
      <Card.Body>
        <Plot
          data={data}
          layout={HUDSON_LAYOUT}
        />
      </Card.Body>
    </Card>
  )
}