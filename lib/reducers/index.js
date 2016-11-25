'use babel'

import path from 'path'
import { combineReducers } from 'redux'
import su from '../server-util'
import isEbankProject from '../is-ebank-project'

const selectedEbank = (state=null, action) => {
  switch (action.type) {
    case 'SELECT-PROJECT':
      if (isEbankProject(action.project)) {
        return action.project
      } else {
        return null
      }
    default:
      return state
  }
}

const isRunning = (state=false, action) => {
  switch (action.type) {
    case 'TOGGLE-EBANK':
      if (state) {
        su.stop()
      } else {
        su.start(action.project)
      }
      return !state
    default:
      return state
  }
}

const servicePorts = (state={}, action) => {
  switch (action.type) {
    case 'OPEN-PORT':
      return {
        ...state,
        [action.service]: action.port
      }
    case 'CLOSE-PORT':
      let _state = {...state}
      Reflect.deleteProperty(_state, action.service)
      return _state
    default:
      return state
  }
}

const reducer = combineReducers({
  selectedEbank,
  isRunning,
  servicePorts
});

export default reducer;