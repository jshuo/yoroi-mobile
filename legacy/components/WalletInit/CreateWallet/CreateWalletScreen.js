// @flow

import React from 'react'

import {generateAdaMnemonic} from '../../../crypto/commonUtils'
import {WALLET_INIT_ROUTES} from '../../../RoutesList'
import Screen from '../../Screen'
import WalletForm from '../WalletForm'
import MnemonicExplanationModal from './MnemonicExplanationModal'

type Props = {|
  navigation: any,
  route: any,
|}

const CreateWalletScreen = ({navigation, route}: Props) => {
  const [visibleMnemonicExplanation, setVisibleMnemonicExplanation] = React.useState(false)
  const [formData, _setFormData] = React.useState(null)

  const setFormData = (formData: any) => {
    _setFormData(formData)
    setVisibleMnemonicExplanation(true)
  }

  const hideMnemonicExplanation = () => setVisibleMnemonicExplanation(false)

  const clear = () => {
    setVisibleMnemonicExplanation(false)
    _setFormData(null)
  }

  const navigateToMnemonicScreen = () => {
    clear()
    // TODO(v-almonacid): we need to generate mnemonics according to the
    // target network.
    const mnemonic = generateAdaMnemonic()
    const {networkId, walletImplementationId, provider} = route.params
    navigation.navigate(WALLET_INIT_ROUTES.MNEMONIC_SHOW, {
      mnemonic,
      networkId,
      walletImplementationId,
      provider,
      ...formData,
    })
  }

  return (
    <Screen>
      <WalletForm onSubmit={setFormData} navigation={navigation} />
      <MnemonicExplanationModal
        visible={visibleMnemonicExplanation}
        onRequestClose={hideMnemonicExplanation}
        onConfirm={navigateToMnemonicScreen}
      />
    </Screen>
  )
}

export default CreateWalletScreen
