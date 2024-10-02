import { useEffect, useState } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import { RegionManhattan } from '../plots/RegionManhattan'
import { GREYS } from '../util/Enums'
import { TopResultsTable } from '../plots/TopResultsTable'
import { OptionBar } from '../components/OptionBar'

const tableCols = ['p_value_burden', 'gene', 'seq_region_start', 'seq_region_end']

const getHoverData = (data) => {
  let text = []
  for (let i = 0; i < data['avg_pos'].length; ++i) {
    text.push(
      `pval: ${data['pval'][i].toPrecision(3)}<br>
      gene: ${data['gene'][i]}<br>
      seq start: ${data['seq_region_start'][i]}<br>
      seq end : ${data['seq_region_end'][i]}
      `
    )
  }

  return text
}

const prepData = (data) => {
  if (Object.keys(data).length > 0) {
    return {
      x: data['avg_pos'],
      y: data['logp'],
      text: getHoverData(data),
      type: 'scattergl',
      mode: 'markers',
      marker: {color: GREYS[1]},
      hovertemplate: '%{text}'
    }
  }
}

export const EXWASPage = () => {
  const { name } = useParams()
  const [data, setData] = useState({})
  const [cohort, setCohort] = useState('')
  const [cohorts, setCohorts] = useState([])

  const [phenos, setPhenos] = useState([])
  const [pheno, setPheno] = useState('')

  const [currData, setCurrData] = useState({})
  const [tableData, setTableData] = useState([])
  const [currTableData, setCurrTableData] = useState([])

  useEffect(() => {
    setData(require(`../data/exwas/${name}.json`))
    setTableData(require(`../data/exwas/${name}_table.json`))
  }, [name])

  useEffect(() => {
    setCohorts(Object.keys(data))
  }, [data])

  useEffect(() => {
    if (cohorts.length > 0) {
      const newCohort = cohorts[0]
      setCohort(newCohort)
      setPhenos(Object.keys(data[newCohort]))
    }
  }, [cohorts])

  useEffect(() => {
    if (!!data[cohort]) {
      setPhenos(Object.keys(data[cohort]))
    }
  }, [cohort])

  useEffect(() => {
    if (phenos.length > 0) {
      const newPheno = phenos[0]
      setPheno(newPheno)
      setCurrData(prepData(data[cohort][newPheno]))
      setCurrTableData(tableData[cohort][newPheno])
    }
  }, [phenos])

  useEffect(() => {
    if (!!data[cohort] && data[cohort][pheno]) {
      setCurrData(prepData(data[cohort][pheno]))
      setCurrTableData(tableData[cohort][pheno])
    }
  }, [pheno])

  const formatResult = (item) => {
    return (<span>{item.name}</span>)
  }
  
  const handleSelect = (item) => {
    setPheno(item.name)
  }

  return (
    <Container fluid>
      <OptionBar idSuffix={'exwas'} options={cohorts} selected={cohort} handler={setCohort} buttonStyle={'primary'}/>
      <div style={{ width: 300, position: 'relative', zIndex: 2 }}>
        <ReactSearchAutocomplete
          items={phenos.map((pheno, idx) => { return ({id: idx, name: pheno})})}
          formatResult={formatResult}
          onSelect={handleSelect}
          autoFocus
        />
      </div>
      <Card>
        <RegionManhattan data={currData} pheno={pheno} cohort={cohort}/>
      </Card>
      <Card>
        {(currTableData.length > 0) && <TopResultsTable data={currTableData} cols={tableCols}/>}
      </Card>
    </Container>
  )
}