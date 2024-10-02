import { ReactSearchAutocomplete } from 'react-search-autocomplete'

const formatResult = (item) => {
  return (<span>{item.name}</span>)
}

const handleSelect = (item) => {
  if (item.type == 'gwas') {
    window.open(`/gwas/${item.name}`, '_blank')
  }
  else if (item.type == 'exwas') {
    window.open(`/exwas/${item.name}`, '_blank')
  }
}

export const SearchBar = ({items}) => {
  return (
    <div style={{ width: 300 }}>
      <ReactSearchAutocomplete
        items={items}
        formatResult={formatResult}
        onSelect={handleSelect}
        autoFocus
      />
    </div>
  )
}