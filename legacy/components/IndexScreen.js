// @flow

import {useNavigation} from '@react-navigation/native'
import React from 'react'
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity} from 'react-native'

import {ROOT_ROUTES} from '../RoutesList'
import storage from '../utils/storage'
import {Button, StatusBar, Text} from './UiKit'

const routes = [
  {label: 'Storybook', path: ROOT_ROUTES.STORYBOOK},
  {label: 'Skip to wallet list', path: ROOT_ROUTES.WALLET},
]

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  button: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  link: {
    height: 32,
    fontSize: 16,
    textAlign: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
})

const crash = () => {
  return Promise.reject(new Error('Forced crash'))
}

const IndexScreen = () => {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar type="light" />

      <ScrollView style={styles.container}>
        {routes.map((route) => (
          <Button
            key={route.path}
            style={styles.button}
            onPress={() => navigation.navigate(route.path)}
            title={route.label}
          />
        ))}
        <TouchableOpacity onPress={() => storage.clearAll()}>
          <Text style={styles.link}>Clear storage</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={crash}>
          <Text style={styles.link}>Crash</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default IndexScreen
