// @flow

import React, {memo, useState} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'

import {COLORS} from '../../../styles/config'

// NOTE: layout is following inVision spec
// https://projects.invisionapp.com/d/main?origin=v7#/console/21500065/456867605/inspect?scrollOffset=2856#project_console
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  centralized: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  tabPanel: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 43,
    minWidth: 137,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: COLORS.LIGHT_POSITIVE_GREEN,
  },
  tabTextInactive: {
    color: COLORS.TEXT_INPUT,
  },
  indicator: {
    height: 3,
    width: '100%',
    maxWidth: 137,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  indicatorActive: {
    backgroundColor: COLORS.LIGHT_POSITIVE_GREEN,
  },
  indicatorInactive: {
    backgroundColor: 'transparent',
  },
})

type TabNavigatorProps = {|
  +tabs: Array<string>,
  +render: <T>(T & {|+active: number|}) => React$Node,
|}

const TabNavigator = ({tabs, render}: TabNavigatorProps) => {
  const [active, setActive] = useState<number>(0)

  return (
    <View style={styles.root}>
      <View style={styles.grid}>
        <View style={styles.row}>
          {tabs.map((label, i) => {
            const indicatorStyle = [styles.indicator, active === i ? styles.indicatorActive : styles.indicatorInactive]
            const textStyle = [styles.tabText, active === i ? styles.tabTextActive : styles.tabTextInactive]
            return (
              <TouchableOpacity key={`tab-navigator-${i}`} style={styles.tabPanel} onPress={() => setActive(i)}>
                <View style={styles.centralized}>
                  <Text style={textStyle}>{label}</Text>
                </View>
                <View style={indicatorStyle} />
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
      {render({active})}
    </View>
  )
}

export default memo<TabNavigatorProps>(TabNavigator)
