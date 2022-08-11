import { React } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const ThreeStateIcon = ({
  iconState,
  icons,
  ...props
}) => {

  console.log('iconState', iconState)
  console.log('icons', icons)

  const getIcon = () => {
    if(iconState === ICON_STATE.INITIAL) return icons.initial;
    if(iconState === ICON_STATE.LOADING) return icons.loading;
    if(iconState === ICON_STATE.FINAL) return icons.final;


  }

  console.log('icon', getIcon())
  return <FontAwesomeIcon className={iconState === ICON_STATE.LOADING ? 'spinning' : ''} icon={getIcon()} />
}

export const ICON_STATE = {
  INITIAL : 0,
  LOADING : 1,
  FINAL : 2
}

export default ThreeStateIcon;
