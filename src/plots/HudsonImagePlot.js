import Plot from 'react-plotly.js'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import { THRESHOLD, CHROMOSOMES } from '../util/Enums'

const BORDER = {
  type: 'line',
  xref: 'paper',
  x0: 0,
  x1: 1,
  y0: THRESHOLD, 
  y1: THRESHOLD,
  line: { color: 'red', width: 1, dash: 'dash' }
}

const layout1 = {
  title: null,
  plot_bgcolor:'rgba(0, 0, 0, 0)',
  paper_bgcolor:'rgba(0, 0, 0, 0)',
  displayModeBar: false,
  showlegend: false,
  xaxis: {showgrid: false, tickvals: null, ticktext: CHROMOSOMES, range: [0, 1], constrain:'domain'},
  yaxis: {showgrid: false, range: [0, 10], constrain:'domain', title: '-log10 pval'},
  width: 750,
  height: 500,
  margin: {r: 0, t: 0},
  shapes: [BORDER],
  images: [
    {
      source: null,
      xref:"x domain",
      yref:"y domain",
      x: -(100/3600),
      y: -(150/3600),
      xanchor: 'left',
      yanchor: 'bottom',
      sizex: 1.0 + 100/3600,
      sizey: 1.0 + 150/3600,
      layer:"below",
      sizing: 'stretch'
    }
  ]
}

const layout2 = {
  title: null,
  plot_bgcolor:'rgba(0, 0, 0, 0)',
  paper_bgcolor:'rgba(0, 0, 0, 0)',
  displayModeBar: false,
  showlegend: false,
  xaxis: {showgrid: false, tickvals: null, ticktext: CHROMOSOMES, range: [0, 1], constrain:'domain', title: 'Chromosome', fixedrange: true},
  yaxis: {showgrid: false, range: [10, 0], constrain:'domain', title: '-log10 pval', fixedrange: true},
  width: 750,
  height: 500,
  margin: {r: 0, t: 0},
  shapes: [BORDER],
  images: [
    {
      source: null,
      xref:"x domain",
      yref:"y domain",
      x: -(100/3600),
      y: 1 + 150/3600,
      xanchor: 'left',
      yanchor: 'top',
      sizex: 1.0 + 100/3600,
      sizey: 1 + 150/3600,
      layer:"below",
      sizing: 'stretch'
    }
  ]
}

const prepData = (data) => {
  data.odd['type'] = 'scatter'
  data.odd['mode'] = 'markers'
  data.odd['marker'] = {color: 'Blue'}
  data.even['type'] = 'scatter'
  data.even['mode'] = 'markers'
  data.even['marker'] = {color: 'Red'}

  return data
}

export const HudsonImagePlot = ({coh1, coh2, data1, data2, src1, src2}) => {
  const norm_factor = parseInt(data1.norm_factor)

  data1 = prepData(data1)
  data2 = prepData(data2)

  layout1['title'] = coh1
  layout1['xaxis']['tickvals'] = data1.tick_vals.map(tick => {return (1.00) * (parseInt(tick)/norm_factor)})
  layout1['images'][0]['source'] = `data:image/png;base64,${src1['src']}`

  layout2['title'] = coh2
  layout2['xaxis']['tickvals'] = data2.tick_vals.map(tick => {return (1.00) * (parseInt(tick)/norm_factor)})
  layout2['images'][0]['source'] = `data:image/png;base64,${src2['src_flipped']}`

  return (
    <Container style={{width: 750}}>
      <Row style={{ marginBottom: 494 }}>
        <div style={{position: 'absolute'}}>
          <Plot data={[data1.even, data1.odd]} layout={layout1}/>
        </div>
      </Row>
      <Row>
        <div style={{position: 'absolute'}}>
          <Plot data={[data2.even, data2.odd]} layout={layout2}/>
        </div>
      </Row>
    </Container>
  )
}