/* eslint-disable no-use-before-define */
/* eslint-disable react-native/no-inline-styles */
// @flow

import React from 'react'
import {View, Keyboard} from 'react-native'
import {injectIntl, defineMessages, type IntlShape} from 'react-intl'
import {validateMnemonic, wordlists} from 'bip39'

import {Menu, TextInput} from '../../../UiKit'

const messages = defineMessages({
  mnemonicInputLabel: {
    id: 'components.walletinit.restorewallet.restorewalletscreen.mnemonicInputLabel',
    defaultMessage: '!!!Recovery phrase',
  },
  restoreButton: {
    id: 'components.walletinit.restorewallet.restorewalletscreen.restoreButton',
    defaultMessage: '!!!Restore wallet',
  },
  instructions: {
    id: 'components.walletinit.restorewallet.restorewalletscreen.instructions',
    defaultMessage:
      '!!!To restore your wallet please provide the {mnemonicLength}-word ' +
      'recovery phrase you received when you created your wallet for the ' +
      'first time.',
  },
  noMatchingWords: {
    id: 'components.walletinit.restorewallet.restorewalletscreen.noMatchingWords',
    defaultMessage: '!!!No Matching Words',
  },
  invalidChecksum: {
    id: 'components.walletinit.restorewallet.restorewalletscreen.invalidchecksum',
    defaultMessage: '!!!Please enter valid mnemonic.',
  },
})

export const MnemonicInput = injectIntl(
  ({intl, length, onDone}: {intl: IntlShape, length: number, onDone: (phrase: string) => mixed}) => {
    const [mnemonicWords, setMnemonicWords] = React.useState<Array<string>>((Array.from({length}).map(() => ''): any))

    const mnemonicWordsComplete = mnemonicWords.every(Boolean)
    const isValid: boolean = mnemonicWordsComplete ? validateMnemonic(mnemonicWords.join(' ')) : false
    const errorText = !isValid && mnemonicWordsComplete ? intl.formatMessage(messages.invalidChecksum) : ''

    const onSelect = (index: number, word: string) =>
      setMnemonicWords((words) => {
        const newWords = [...words]
        newWords[index] = word

        return newWords
      })

    React.useEffect(() => {
      if (mnemonicWordsComplete && isValid) {
        Keyboard.dismiss()
        onDone(mnemonicWords.join(' '))
      }
    }, [mnemonicWordsComplete, isValid, mnemonicWords, onDone])

    return (
      <TextInput
        value={mnemonicWords.join(' ')}
        errorText={errorText}
        render={({ref: _ref, ...inputProps}: any) => (
          <MnemonicWordsInput onSelect={onSelect} words={mnemonicWords} {...inputProps} />
        )}
      />
    )
  },
)

type MnemonicWordsInputProps = {
  words: Array<string>,
  onSelect: (index: number, word: string) => mixed,
}
const MnemonicWordsInput = ({onSelect, words}: MnemonicWordsInputProps) => {
  const refs = React.useRef(words.map(() => React.createRef<any>())).current

  useAutoFocus(refs[0]) // RNP.TextInput has a buggy autoFocus

  return (
    <View style={{padding: 4, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around'}}>
      {words.map((word, index) => (
        <View key={index} style={{width: '33%', padding: 4}}>
          <MnemonicWordInput
            ref={refs[index]}
            onSelect={(word: string) => {
              onSelect(index, word)
              if (!refs[index + 1]) return
              refs[index + 1].current?.focus()
            }}
            id={index + 1}
            word={word}
          />
        </View>
      ))}
    </View>
  )
}

type MnemonicWordInputProps = {
  id: number,
  onSelect: (word: string) => mixed,
}
const MnemonicWordInput = React.forwardRef(({id, onSelect}: MnemonicWordInputProps, ref) => {
  const [word, setWord] = React.useState('')
  const matchingWords = React.useMemo(() => (word ? getMatchingWords(word) : []), [word])
  const [menuEnabled, setMenuEnabled] = React.useState(false)

  const selectWord = (word: string) => {
    setWord(normalizeText(word))
    setMenuEnabled(false)
    onSelect(normalizeText(word))
  }

  return (
    <Menu
      anchor={
        <TextInput
          ref={ref}
          value={word}
          placeholder={String(id)}
          onChange={() => setMenuEnabled(true)}
          onChangeText={(word) => setWord(normalizeText(word))}
          enablesReturnKeyAutomatically
          blurOnSubmit={false}
          onSubmitEditing={() => matchingWords[0] && selectWord(matchingWords[0])}
          dense
          textAlign={'center'}
          noErrors
          errorDelay={0}
          errorText={matchingWords.length <= 0 ? 'No matching words' : ''}
        />
      }
      visible={menuEnabled && matchingWords.length <= 3 && !!word}
      onDismiss={() => {
        setMenuEnabled(false)
        setWord('')
      }}
    >
      {matchingWords.map((word) => (
        <Menu.Item key={word} title={word} onPress={() => selectWord(word)} />
      ))}
    </Menu>
  )
})

const normalizeText = (text: string) => {
  const NON_LOWERCASE_LETTERS = /[^a-z]+/g

  return text.trim().toLowerCase().replace(NON_LOWERCASE_LETTERS, '')
}
const getMatchingWords = (targetWord: string) =>
  (wordlists.EN: Array<string>).filter((word) => word.startsWith(normalizeText(targetWord)))

const useAutoFocus = (ref) =>
  React.useEffect(() => {
    const timeout = setTimeout(() => ref.current?.focus(), 100)

    return () => clearTimeout(timeout)
  }, [ref])