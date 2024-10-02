import React from 'react'
import Card from 'react-bootstrap/Card'
import Plot from 'react-plotly.js'
import { THRESHOLD, GREYS } from '../util/Enums'

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
  xaxis: {title: 'Average Position'},
  yaxis: {title: '-log10 pvalue'},
  shapes: [BORDER],
  width: 850
}

export const RegionManhattan = ({data, pheno, cohort}) => {
  return (
    <Card style={defaultStyle}>
      <Card.Body>Burden Analysis for <b>{pheno}</b> in <b>{cohort}</b></Card.Body>
      <Card.Body>
        <Plot
          data={[data]}
          layout={MANHATTAN_LAYOUT}
        />
      </Card.Body>
    </Card>
  )
}