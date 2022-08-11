import { React } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const ThreeStateIcon = ({
  iconState,
  icons,
  ...props
}) => {

  const getIcon = () => {
    if(iconState === ICON_STATE.INITIAL) return icons.initial;
    if(iconState === ICON_STATE.LOADING) return icons.loading;
    if(iconState === ICON_STATE.FINAL) return icons.final;
    if(iconState === ICON_STATE.ERROR) return icons.error;
  }

  let classes = '';
  classes += iconState === ICON_STATE.LOADING ? ' spinning' : '';
  classes += iconState === ICON_STATE.ERROR ? ' text-danger' : '';

  return <FontAwesomeIcon className={classes} icon={getIcon()} />
}

export const ICON_STATE = {
  ERROR : -1,
  INITIAL : 0,
  LOADING : 1,
  FINAL : 2
}

export default ThreeStateIcon;
