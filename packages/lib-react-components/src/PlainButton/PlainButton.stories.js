import { storiesOf } from '@storybook/react'
import { withActions } from '@storybook/addon-actions'
import { withKnobs, text } from '@storybook/addon-knobs'
import zooTheme from '@zooniverse/grommet-theme'
import { Grommet } from 'grommet'
import { Add } from 'grommet-icons'
import React from 'react'

import PlainButton from './PlainButton'
import readme from './README.md'

const config = {
  notes: {
    markdown: readme
  }
}

storiesOf('PlainButton', module)
  .addDecorator(withActions('click button'))
  .addDecorator(withKnobs)
  .
  add('Light theme (default)', () => (
    <Grommet theme={zooTheme}>
      <PlainButton text={text('Text', 'Click me')} />
    </Grommet>
  ), config)

  .add('Dark theme', () => (
    <Grommet theme={zooTheme}>
      <PlainButton text={text('Text', 'Click me')} theme='dark' />
    </Grommet>
  ), config)

  .add('With icon', () => (
    <Grommet theme={zooTheme}>
      <PlainButton icon={<Add />} text={text('Text', 'Click me')} />
    </Grommet>
  ), config)
