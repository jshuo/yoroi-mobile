// @flow

import {useNavigation, useRoute} from '@react-navigation/native'
import React from 'react'
import {defineMessages, useIntl} from 'react-intl'
import {Dimensions, Image, ScrollView, View} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'

import recoveryPhrase from '../../../assets/img/recovery_phrase.png'
import {WALLET_INIT_ROUTES} from '../../../RoutesList'
import assert from '../../../utils/assert'
import {Button, StatusBar, Text} from '../../UiKit'
import MnemonicBackupImportanceModal from './MnemonicBackupImportanceModal'
import styles from './styles/MnemonicShowScreen.style'

const messages = defineMessages({
  mnemonicNote: {
    id: 'components.walletinit.createwallet.mnemonicshowscreen.mnemonicNote',
    defaultMessage:
      '!!!Please, make sure you have carefully written down your ' +
      'recovery phrase somewhere safe. ' +
      'You will need this phrase to use and restore your wallet. ' +
      'Phrase is case sensitive.',
  },
  confirmationButton: {
    id: 'components.walletinit.createwallet.mnemonicshowscreen.confirmationButton',
    defaultMessage: '!!!Yes, I have written it down',
  },
})

const MnemonicShowScreen = () => {
  const navigation = useNavigation()
  const route = (useRoute(): any)
  const intl = useIntl()
  const mnemonic = route.params.mnemonic
  const provider = route.params.provider
  const [modal, setModal] = React.useState(false)
  const showModal = () => setModal(true)
  const hideModal = () => setModal(false)
  const navigateToMnemonicCheck = () => {
    const {name, password, networkId, walletImplementationId} = route.params
    assert.assert(!!mnemonic, 'navigateToMnemonicCheck:: mnemonic')
    assert.assert(!!password, 'navigateToMnemonicCheck:: password')
    assert.assert(!!name, 'navigateToMnemonicCheck:: name')
    assert.assert(networkId != null, 'navigateToMnemonicCheck:: networkId')
    assert.assert(!!walletImplementationId, 'walletImplementationId')

    navigation.navigate(WALLET_INIT_ROUTES.MNEMONIC_CHECK, {
      mnemonic,
      password,
      name,
      networkId,
      walletImplementationId,
      provider,
    })
    hideModal()
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeAreaView}>
      <StatusBar type="dark" />

      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollViewContentContainer} bounces={false}>
          <View style={styles.mnemonicNote}>
            <Text>{intl.formatMessage(messages.mnemonicNote)}</Text>
          </View>

          <View style={styles.mnemonicWords}>
            {mnemonic.split(' ').map((word, index) => (
              <Text key={index} style={styles.mnemonicText} testID={`mnemonic-${index}`}>
                {word}
              </Text>
            ))}
          </View>

          {/* If screen is small hide image */}
          {Dimensions.get('window').height > 480 && (
            <View style={styles.image}>
              <Image source={recoveryPhrase} />
            </View>
          )}
        </ScrollView>

        <View style={styles.button}>
          <Button
            onPress={showModal}
            title={intl.formatMessage(messages.confirmationButton)}
            testID="mnemonicShowScreen::confirm"
          />
        </View>

        {modal && (
          <MnemonicBackupImportanceModal
            visible={modal}
            onConfirm={navigateToMnemonicCheck}
            onRequestClose={hideModal}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export default MnemonicShowScreen
