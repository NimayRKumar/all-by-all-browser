import Plot from 'react-plotly.js'
import Card from 'react-bootstrap/Card'
import { THRESHOLD } from '../util/Enums'

const BORDER = {
  type: 'line',
  xref: 'paper',
  x0: 0,
  x1: 1,
  y0: THRESHOLD, 
  y1: THRESHOLD,
  line: { color: 'red', width: 1, dash: 'dash' }
}

export const ManhattanImagePlot = ({src, data, flipped}) => {
  data.odd['type'] = 'scatter'
  data.odd['mode'] = 'markers'
  data.odd['marker'] = {color: 'Blue'}
  data.even['type'] = 'scatter'
  data.even['mode'] = 'markers'
  data.even['marker'] = {color: 'Red'}

  const norm_factor = parseInt(data.norm_factor)
  const xticks = data.tick_vals.map(tick => {return (1.00) * (parseInt(tick)/norm_factor)})
  const xlabels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  const range = flipped ? [10, 0] : [0, 10]
  const layout = {
    plot_bgcolor:'rgba(0, 0, 0, 0)',
    paper_bgcolor:'rgba(0, 0, 0, 0)',
    displayModeBar: false,
    showlegend: false,
    xaxis: {showgrid: false, tickvals: xticks, ticktext: xlabels, range: [0, 1], constrain:'domain', title: 'Chromosome', fixedrange: true},
    yaxis: {showgrid: false, range: range, constrain:'domain', title: '-log10 pval', fixedrange: true},
    width: 900,
    height: 600,
    margin: {r: 0, t: 0},
    shapes: [BORDER],
    images: [
      {
        source: `data:image/png;base64,${flipped ? src['src_flipped'] : src['src']}`,
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
      
  return (
    <Card>
      <div style={{position: 'absolute'}}>
        <Plot data={[data.even, data.odd]} layout={layout}/>
      </div>
    </Card>
  )
}