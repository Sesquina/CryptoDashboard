import styled from 'styled-components'
import { subtleBoxShadow, lightBlueBackground, blueBoxShadow, redBoxShadow } from './Styles'

export const Tile = styled.div`
    ${subtleBoxShadow};
    ${lightBlueBackground};
    padding: 10px;
`
export const SelectableTile = styled(Tile)`
    &:hover{
        cursor: pointer;
        ${blueBoxShadow}
    }
`
export const DeletableTile = styled(SelectableTile)`
    &:hover{
        cursor: pointer;
        ${redBoxShadow};
    }
`
export const DisabledTile = styled(Tile)`
    pointer-events: none; /*Does not allow selecting the coins*/
    opacity: 0.4;
`