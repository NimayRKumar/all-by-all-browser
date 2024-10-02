import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

export const OptionBar = ({idSuffix, options, selected, handler, disabled, buttonStyle}) => {
  return (
  <ButtonGroup>
    {options.map((opt, idx) => {
      return (
        <ToggleButton
          id={`${idx}-${idSuffix}`}
          variant={opt === selected ? buttonStyle : `outline-${buttonStyle}`}
          type="radio"
          value={opt}
          checked={opt === selected}
          disabled={disabled}
          onChange={(e) => handler(e.target.value)}
        >
          {opt}
        </ToggleButton>
      )
    })}
  </ButtonGroup>
)}