// @flow

import React from 'react'
import {View} from 'react-native'
import {useIntl, defineMessages} from 'react-intl'

import YoroiWalletIcon from '../../assets/YoroiWalletIcon'
import {Text} from '../UiKit'

import {COLORS} from '../../styles/config'
import styles from './styles/WalletInitScreen.style'

const messages = defineMessages({
  slogan: {
    id: 'components.walletinit.walletdescription.slogan',
    defaultMessage: '!!!Your gateway to the financial world',
  },
})

const WalletDescription = () => {
  const intl = useIntl()

  return (
    <View style={styles.description}>
      <YoroiWalletIcon color={COLORS.WHITE} width={208} height={60} />
      <View style={styles.emurgoCreditsContainer}>
        <Text light>{intl.formatMessage(messages.slogan)}</Text>
      </View>
    </View>
  )
}

export default WalletDescription
