// @flow

import React from 'react'
import {defineMessages, useIntl} from 'react-intl'
import {ScrollView, View} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useSelector} from 'react-redux'

import {CONFIG} from '../../config/config'
import globalMessages from '../../i18n/global-messages'
import {walletNamesSelector} from '../../selectors'
import {
  getWalletNameError,
  REQUIRED_PASSWORD_LENGTH,
  validatePassword,
  validateWalletName,
} from '../../utils/validators'
import {Button, Spacer, TextInput} from '../UiKit'
import {Checkmark} from '../UiKit/TextInput'
import styles from './styles/WalletForm.style'

const messages = defineMessages({
  walletNameInputLabel: {
    id: 'components.walletinit.walletform.walletNameInputLabel',
    defaultMessage: '!!!Wallet name',
  },
  newPasswordInput: {
    id: 'components.walletinit.walletform.newPasswordInput',
    defaultMessage: '!!!Spending password',
  },
  continueButton: {
    id: 'components.walletinit.walletform.continueButton',
    defaultMessage: '!!!Continue',
  },
  passwordStrengthRequirement: {
    id: 'components.walletinit.createwallet.createwalletscreen.passwordLengthRequirement',
    defaultMessage: '!!!Minimum characters',
  },
  repeatPasswordInputLabel: {
    id: 'components.walletinit.walletform.repeatPasswordInputLabel',
    defaultMessage: '!!!Repeat password',
  },
  repeatPasswordInputError: {
    id: 'components.walletinit.walletform.repeatPasswordInputError',
    defaultMessage: '!!!Passwords do not match',
  },
})

type Props = {
  onSubmit: ({name: string, password: string}) => mixed,
}

const WalletForm = ({onSubmit}: Props) => {
  const intl = useIntl()
  const walletNames = useSelector(walletNamesSelector)
  const [name, setName] = React.useState(CONFIG.DEBUG.PREFILL_FORMS ? CONFIG.DEBUG.WALLET_NAME : '')
  const nameErrors = validateWalletName(name, null, walletNames)
  const walletNameErrorText =
    getWalletNameError(
      {
        tooLong: intl.formatMessage(globalMessages.walletNameErrorTooLong),
        nameAlreadyTaken: intl.formatMessage(globalMessages.walletNameErrorNameAlreadyTaken),
        mustBeFilled: intl.formatMessage(globalMessages.walletNameErrorMustBeFilled),
      },
      nameErrors,
    ) || undefined

  const passwordRef = React.useRef<{focus: () => void} | null>(null)
  const [password, setPassword] = React.useState(CONFIG.DEBUG.PREFILL_FORMS ? CONFIG.DEBUG.PASSWORD : '')

  const passwordConfirmationRef = React.useRef<{focus: () => void} | null>(null)
  const [passwordConfirmation, setPasswordConfirmation] = React.useState(
    CONFIG.DEBUG.PREFILL_FORMS ? CONFIG.DEBUG.PASSWORD : '',
  )
  const passwordErrors = validatePassword(password, passwordConfirmation)
  const passwordErrorText = passwordErrors.passwordIsWeak
    ? intl.formatMessage(messages.passwordStrengthRequirement, {requiredPasswordLength: REQUIRED_PASSWORD_LENGTH})
    : undefined
  const passwordConfirmationErrorText = passwordErrors.matchesConfirmation
    ? intl.formatMessage(messages.repeatPasswordInputError)
    : undefined

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeAreaView}>
      <ScrollView keyboardShouldPersistTaps={'always'} contentContainerStyle={styles.scrollContentContainer}>
        <WalletNameInput
          enablesReturnKeyAutomatically
          autoFocus
          label={intl.formatMessage(messages.walletNameInputLabel)}
          value={name}
          onChangeText={setName}
          errorText={walletNameErrorText}
          errorDelay={0}
          returnKeyType={'next'}
          onSubmitEditing={() => passwordRef.current?.focus()}
          testID="walletNameInput"
        />

        <Spacer />

        <PasswordInput
          enablesReturnKeyAutomatically
          ref={passwordRef}
          secureTextEntry
          label={intl.formatMessage(messages.newPasswordInput)}
          value={password}
          onChangeText={setPassword}
          errorText={passwordErrorText}
          returnKeyType={'next'}
          helperText={intl.formatMessage(messages.passwordStrengthRequirement, {
            requiredPasswordLength: REQUIRED_PASSWORD_LENGTH,
          })}
          right={!passwordErrors.passwordIsWeak ? <Checkmark /> : undefined}
          onSubmitEditing={() => passwordConfirmationRef.current?.focus()}
          testID="walletPasswordInput"
        />

        <Spacer />

        <PasswordConfirmationInput
          enablesReturnKeyAutomatically
          ref={passwordConfirmationRef}
          secureTextEntry
          returnKeyType={'done'}
          label={intl.formatMessage(messages.repeatPasswordInputLabel)}
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          errorText={passwordConfirmationErrorText}
          right={
            !passwordErrors.matchesConfirmation && !passwordErrors.passwordConfirmationReq ? <Checkmark /> : undefined
          }
          testID="walletRepeatPasswordInput"
        />
      </ScrollView>

      <Actions>
        <Button
          onPress={() => onSubmit({name, password})}
          disabled={Object.keys(passwordErrors).length > 0 || Object.keys(nameErrors).length > 0}
          title={intl.formatMessage(messages.continueButton)}
          testID="walletFormContinueButton"
        />
      </Actions>
    </SafeAreaView>
  )
}

export default WalletForm

const WalletNameInput = TextInput
const PasswordInput = TextInput
const PasswordConfirmationInput = TextInput
const Actions = (props) => <View {...props} style={styles.actions} />
