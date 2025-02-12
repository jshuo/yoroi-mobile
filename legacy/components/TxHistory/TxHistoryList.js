// @flow

import {useNavigation} from '@react-navigation/native'
import _ from 'lodash'
import React from 'react'
import {useIntl} from 'react-intl'
import {SectionList, View} from 'react-native'

import type {TransactionInfo} from '../../types/HistoryTransaction'
import {formatDateRelative} from '../../utils/format'
import {Text} from '../UiKit'
import styles from './styles/TxHistoryList.style'
import TxHistoryListItem from './TxHistoryListItem'

type DayHeaderProps = {
  ts: any,
}

const DayHeader = ({ts}: DayHeaderProps) => {
  const intl = useIntl()

  return (
    <View style={styles.dayHeader}>
      <Text>{formatDateRelative(ts, intl)}</Text>
    </View>
  )
}

const getTransactionsByDate = (transactions: Dict<TransactionInfo>) =>
  _(transactions)
    .filter((t) => t.submittedAt != null)
    .sortBy((t) => t.submittedAt)
    .reverse()
    .groupBy((t) => t.submittedAt.substring(0, '2001-01-01'.length))
    .values()
    .map((data) => ({data}))
    .value()

type Props = {
  transactions: Dict<TransactionInfo>,
  refreshing: boolean,
  onRefresh: () => any,
}

const TxHistoryList = ({transactions, refreshing, onRefresh}: Props) => {
  const intl = useIntl()
  const navigation = useNavigation()
  // TODO(ppershing): add proper memoization here
  const groupedTransactions = getTransactionsByDate(transactions)

  return (
    <View style={styles.container}>
      <SectionList
        onRefresh={onRefresh}
        refreshing={refreshing}
        renderItem={({item}) => <TxHistoryListItem navigation={navigation} id={item.id} />}
        renderSectionHeader={({section: {data}}) => <DayHeader ts={data[0].submittedAt} intl={intl} />}
        sections={groupedTransactions}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
      />
    </View>
  )
}

export default TxHistoryList
