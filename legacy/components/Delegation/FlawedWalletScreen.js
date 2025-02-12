// @flow

import React from 'react'
import {type IntlShape, defineMessages, injectIntl} from 'react-intl'
import {Image, ScrollView, View} from 'react-native'

import image from '../../assets/img/mnemonic_explanation.png'
import {confirmationMessages} from '../../i18n/global-messages'
import {Button, Text} from '../UiKit'
import styles from './styles/FlawedWalletScreen.style'

const messages = defineMessages({
  title: {
    id: 'components.txhistory.flawedwalletmodal.title',
    defaultMessage: '!!!WARNING',
  },
  explanation1: {
    id: 'components.txhistory.flawedwalletmodal.explanation1',
    defaultMessage:
      '!!!It looks like you have accidentally created or restored a wallet ' +
      'that is only included in special versions for development. ' +
      'As a security mesure, we have disabled this wallet.',
  },
  explanation2: {
    id: 'components.txhistory.flawedwalletmodal.explanation2',
    defaultMessage:
      '!!!You still can create a new wallet or restore one without restrictions. ' +
      'If you were affected in some way by this issue, please contact Emurgo.',
  },
})

type Props = {|
  intl: IntlShape,
  onPress: () => any,
  disableButtons: boolean,
|}

const FlawedWalletScreen = ({intl, onPress, disableButtons}: Props) => {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.title}>{intl.formatMessage(messages.title)}</Text>
          <Image source={image} />
        </View>
        <Text style={styles.paragraph}>{intl.formatMessage(messages.explanation1)}</Text>
        <Text style={styles.paragraph}>{intl.formatMessage(messages.explanation2)}</Text>
      </View>
      <View style={styles.buttons}>
        <Button
          block
          outlineShelley
          onPress={onPress}
          title={intl.formatMessage(confirmationMessages.commonButtons.iUnderstandButton)}
          style={styles.button}
          disabled={disableButtons}
        />
      </View>
    </ScrollView>
  )
}

export default injectIntl(FlawedWalletScreen)
