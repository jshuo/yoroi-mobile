// @flow

import {storiesOf} from '@storybook/react-native'
import React from 'react'

import MaintenanceScreen from './MaintenanceScreen'

storiesOf('Maintenance Screen', module).add('default', ({route, navigation}) => (
  <MaintenanceScreen route={route} navigation={navigation} />
))
