import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Card from 'react-bootstrap/Card'
import { OptionBar } from '../components/OptionBar'
import { ManhattanImagePlot } from '../plots/ManhattanImagePlot'
import { QQ } from '../plots/QQ'
import { TopResultsTable } from '../plots/TopResultsTable'
import { HudsonImagePlot } from '../plots/HudsonImagePlot';

const tableCols = ['af', 'case_af', 'ci', 'control_af', 'pval', 'r2', 'ref']

export const GWASPage = () => {
  const { name } = useParams()
  const metadata = require(`../data/gwas/meta.json`)[name]

  const [tab, setTab] = useState('about')
  const [cohorts, ] = useState(metadata['cohorts'])
  const [cohort, setCohort] = useState(metadata['cohorts'][0])
  const [about, setAbout] = useState([])
  const [manData, setManData] = useState([])
  const [qq, setQQ] = useState('')
  const [man, setMan] = useState('')
  const [tableData, setTableData] = useState([])

  const [disableOpt, setDisableOpt] = useState(false)
  const [tableVis, setTableVis] = useState(true)

  const [cohort1, setCohort1] = useState('')
  const [cohort2, setCohort2] = useState('')

  const [man1, setMan1] = useState('')
  const [man2, setMan2] = useState('')
  const [data1, setData1] = useState('')
  const [data2, setData2] = useState('')
  const [qqAll, setQQAll] = useState('')

  useEffect(() => {
    setQQAll(require(`../data/gwas/${name}/qq_comp.png`))
  }, [])

  useEffect(() => {
    if (tab !== 'hudson') {
      setDisableOpt(false)
    }
    else {
      setDisableOpt(true)
      setMan1(require(`../data/gwas/${name}/${cohort1}/img.json`))
      setMan2(require(`../data/gwas/${name}/${cohort2}/img.json`))
      setData1(require(`../data/gwas/${name}/${cohort1}/data.json`))
      setData2(require(`../data/gwas/${name}/${cohort2}/data.json`))
    }

    if ((tab !== 'man') && (tab !== 'qq')) {
      setTableVis(false)
    }
    else {
      setTableVis(true)
    }
  }, [tab])

  useEffect(() => {
    setCohort1(cohorts[0])
    setCohort2(cohorts[1])
  }, [cohorts])

  useEffect(() => {
    setAbout(metadata['metadata'][cohort])
    setMan(require(`../data/gwas/${name}/${cohort}/img.json`))
    setManData(require(`../data/gwas/${name}/${cohort}/data.json`))
    setTableData(require(`../data/gwas/${name}/${cohort}/table.json`))
    setQQ(require(`../data/gwas/${name}/${cohort}/qq.png`))
  }, [cohort])

  useEffect(() => {
    if (cohort1 !== '') {
      setMan1(require(`../data/gwas/${name}/${cohort1}/img.json`))
      setData1(require(`../data/gwas/${name}/${cohort1}/data.json`))
    }
  }, [cohort1])

  useEffect(() => {
    if (cohort2 !== '') {
      setMan2(require(`../data/gwas/${name}/${cohort2}/img.json`))
      setData2(require(`../data/gwas/${name}/${cohort2}/data.json`))
    }
  }, [cohort2])

  return (
    <Container fluid>
      <OptionBar idSuffix={'man'} options={cohorts} selected={cohort} handler={setCohort} disabled={disableOpt} buttonStyle={'primary'}/>
      <Row>
        <Col>
          <Card style={{height: 650}}>
          <Tabs onSelect={(e) => setTab(e)} variant={'tabs'} justify>
            <Tab eventKey="about" title="About">
              <Card>
                {about.length > 0 && about.map(d => {
                  return (<div> <strong>{d.Info}:</strong> <p>{d.Description}</p> </div>)
              })}
              </Card>
            </Tab>
            <Tab eventKey="man" title="Analysis">
              <Row>
                  <Col>
                    <div style={{paddingTop: 10}}>
                      {!!manData && !!man && <ManhattanImagePlot src={man} data={manData} flipped={false}/>}
                    </div>
                  </Col>
                  <Col>
                    <div style={{paddingLeft: 250, paddingTop: 100}}>
                      <QQ src={qq}/>
                    </div>
                  </Col>
              </Row>
            </Tab>
            <Tab eventKey="compare" title="Compare Ancestries">
              <Card>
                <Tabs variant={'tabs'}>
                  <Tab eventKey='hudson' title='Hudson Plot'>
                    <div>
                      <OptionBar idSuffix={'hud_top'} options={cohorts} selected={cohort1} handler={setCohort1} buttonStyle={'dark'}/>
                    </div>
                    <div>
                      <OptionBar idSuffix={'hud_bott'} options={cohorts} selected={cohort2} handler={setCohort2} buttonStyle={'dark'}/>
                    </div>
                    {!!data1 && !!data2 && <HudsonImagePlot coh1={cohort1} coh2={cohort2} src1={man1} data1={data1} src2={man2} data2={data2}/>} 
                  </Tab>
                  <Tab eventKey='qqAll' title='QQ Plot'>
                    <QQ src={qqAll}/>
                  </Tab>
                </Tabs> 
              </Card>
            </Tab>
          </Tabs>
        </Card>
        <Card>
          {tableVis && <TopResultsTable key={tableData} data={tableData} cols={tableCols}/>} 
        </Card>
        </Col> 
      </Row>
    </Container>
  )
}