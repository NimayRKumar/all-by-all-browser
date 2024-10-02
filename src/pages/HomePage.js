import { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import { SearchBar } from '../components/SearchBar'

const formStyle = { width: '300px' }

export const HomePage = () => {
  const phenos = Object.keys(require(`../data/gwas/meta.json`))
  const exwas_projects = [{id: '22', name: 'saige_exwas_suggestive', type: 'exwas'}]
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const gwas_projects = phenos.map((pheno, idx) => {
      return ({ id: idx, name: pheno, type: 'gwas' })
    })
    
    setProjects([...gwas_projects, ...exwas_projects])
  }, [])

  return (
    <Card style={{alignItems: 'center', paddingTop: '10px', paddingBottom: '10px'}}>
      <Card.Title>All x All Association Browser</Card.Title>
      <Form>
        <Form.Group style={formStyle}>
        <Form.Label>Search for a gene, SNP, or phenotype:</Form.Label>
          <SearchBar items={projects}/>
        </Form.Group>
      </Form>
    </Card>
  )
}