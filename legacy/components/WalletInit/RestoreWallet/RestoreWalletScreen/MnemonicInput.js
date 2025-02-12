// @flow

import {validateMnemonic, wordlists} from 'bip39'
import React from 'react'
import {defineMessages, useIntl} from 'react-intl'
import {Keyboard, ScrollView, StyleSheet, View} from 'react-native'

import {COLORS} from '../../../../styles/config'
import {Menu, TextInput, useScrollView} from '../../../UiKit'

export const MnemonicInput = ({length, onDone}: {length: number, onDone: (phrase: string) => mixed}) => {
  const strings = useStrings()
  const [mnemonicWords, setMnemonicWords] = React.useState<Array<string>>((Array.from({length}).map(() => ''): any))

  const mnemonicWordsComplete = mnemonicWords.every(Boolean)
  const isValid: boolean = mnemonicWordsComplete ? validateMnemonic(mnemonicWords.join(' ')) : false
  const errorText = !isValid && mnemonicWordsComplete ? strings.invalidChecksum : ''

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
}

type MnemonicWordsInputProps = {
  words: Array<string>,
  onSelect: (index: number, word: string) => mixed,
}
const MnemonicWordsInput = ({onSelect, words}: MnemonicWordsInputProps) => {
  const refs = React.useRef(words.map(() => React.createRef<any>())).current
  const scrollView = useScrollView()
  const rowHeightRef = React.useRef<number | void>()

  useAutoFocus(refs[0]) // RNP.TextInput has a buggy autoFocus

  return (
    <View style={{padding: 4, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around'}}>
      {words.map((word, index) => (
        <View
          key={index}
          style={{width: '33%', padding: 4}}
          onLayout={({nativeEvent}) => (rowHeightRef.current = nativeEvent.layout.height)}
        >
          <MnemonicWordInput
            ref={refs[index]}
            onSelect={(word: string) => {
              onSelect(index, word)
              if (!refs[index + 1]) return
              refs[index + 1].current?.focus()
            }}
            id={index + 1}
            word={word}
            onFocus={() => {
              if (rowHeightRef.current == null) return
              const columnNumber = index % 3
              const rowNumber = (index - columnNumber) / 3
              scrollView?.scrollTo({y: rowNumber * rowHeightRef.current})
            }}
          />
        </View>
      ))}
    </View>
  )
}

type MnemonicWordInputProps = {
  id: number,
  onSelect: (word: string) => mixed,
  onFocus: () => void,
}
const MnemonicWordInput = React.forwardRef(({id, onSelect, onFocus}: MnemonicWordInputProps, ref) => {
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
      style={styles.menu}
      contentStyle={styles.menuContent}
      anchor={
        <TextInput
          ref={ref}
          value={word}
          placeholder={String(id)}
          onFocus={onFocus}
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
      visible={menuEnabled && word.length >= 3 && !!word}
      onDismiss={() => {
        setMenuEnabled(false)
        setWord('')
      }}
    >
      <ScrollView style={styles.menuScrollView} keyboardShouldPersistTaps={'always'}>
        {matchingWords.map((word) => (
          <Menu.Item titleStyle={styles.menuItemText} key={word} title={word} onPress={() => selectWord(word)} />
        ))}
      </ScrollView>
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

const messages = defineMessages({
  invalidChecksum: {
    id: 'components.walletinit.restorewallet.restorewalletscreen.invalidchecksum',
    defaultMessage: '!!!Please enter valid mnemonic.',
  },
})

const useStrings = () => {
  const intl = useIntl()

  return {
    invalidChecksum: intl.formatMessage(messages.invalidChecksum),
  }
}

const ROW_HEIGHT = 48
const styles = StyleSheet.create({
  menu: {
    marginTop: ROW_HEIGHT,
  },
  menuContent: {
    backgroundColor: COLORS.BACKGROUND,
  },
  menuScrollView: {
    maxHeight: ROW_HEIGHT * 3.5,
  },
  menuItemText: {
    color: COLORS.TEXT_GRAY,
  },
})
