import zooTheme from '@zooniverse/grommet-theme'
import { Grommet } from 'grommet'
import React from 'react'
import { Provider } from 'mobx-react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import mockStore from '@test/mockStore'
import { QuickTalkContainer } from './QuickTalkContainer'
import { Tabs } from '@zooniverse/react-components'

/*
Workaround: prevent "infinite rendering Tabs" in Grommet 2.25
If a Grommet <Tab> is defined in a separate function than the parent Grommet
<Tabs>, it may cause an "infinite rendering loop" with the error message:
"Warning: Maximum update depth exceeded". One solution is to wrap the child
<Tab> in a React.memo.
*/
const QuickTalkContainerForTesting = React.memo(QuickTalkContainer)

const subject = {
  id: '100001',
  talkURL: 'https://www.zooniverse.org/projects/zootester/test-project/talk/subjects/100001',
}

const authClient = {}

describe.only('Component > QuickTalkContainer', function () {
  function withStore(store) {
    return function Wrapper({ children }) {
      return (
        <Grommet theme={zooTheme}>
          <Provider classifierStore={store}>
            <Tabs>
              {children}
            </Tabs>
          </Provider>
        </Grommet>
      )
    }
  }

  describe('when collapsed', function () {
    beforeEach(function () {
      const store = mockStore()
      render(
        <QuickTalkContainerForTesting
          authClient={authClient}
          enabled={true}
          subject={subject}
        />,
        {
          wrapper: withStore(store)
        }
      )
    })

    it('should render without crashing', function () {
      expect(screen.queryByRole('tab')).to.have.text('QuickTalk.tabTitle')
      expect(screen.queryByRole('link')).to.have.text('QuickTalk.goToTalk')
    })
  })
})
