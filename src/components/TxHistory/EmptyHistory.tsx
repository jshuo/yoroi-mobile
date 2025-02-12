import React from 'react'
import {defineMessages, useIntl} from 'react-intl'
import {Image, StyleSheet, Text, View} from 'react-native'

import image from '../../assets/img/no_transactions.png'
import {Spacer} from '../Spacer'

export const EmptyHistory = () => {
  const intl = useIntl()

  return (
    <View style={styles.empty}>
      <Image style={styles.image} source={image} />
      <Spacer height={20} />
      <Text style={styles.emptyText}>{intl.formatMessage(messages.noTransactions)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 122,
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
    color: '#242838',
    width: '55%',
    textAlign: 'center',
  },
  image: {
    height: 100,
    width: 131,
  },
})

const messages = defineMessages({
  noTransactions: {
    id: 'components.txhistory.txhistory.noTransactions',
    defaultMessage: '!!!No transactions to show yet',
  },
})
