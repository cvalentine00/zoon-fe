import { expect } from 'chai'
import { render } from 'enzyme'
import React from 'react'
import en from './locales/en'

import Introduction from './Introduction'

const DESCRIPTION = 'Project Title!'
const LINK_PROPS = {
  href: '/projects/foo/bar/about'
}
const TITLE = 'baz'

describe('Component > Hero > Introduction', function () {
  let wrapper

  before(function () {
    wrapper = render(<Introduction
      description={DESCRIPTION}
      linkProps={LINK_PROPS}
      title={TITLE}
    />)
  })

  it('should render without crashing', function () {
    expect(wrapper).to.be.ok()
  })

  it('should render the title', function () {
    expect(wrapper.text().includes(TITLE)).to.be.true()
  })

  it('should render the description', function () {
    expect(wrapper.text().includes(DESCRIPTION)).to.be.true()
  })

  it('should render a link to the about page', function () {
    const link = wrapper.find(`a[href="${LINK_PROPS.href}"]`)
    expect(link).to.have.lengthOf(1)
    expect(link.text()).to.contain(en.Introduction.link)
  })
})
