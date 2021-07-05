import { shallow } from 'enzyme'

import LoginForm from './LoginForm'

let wrapper

describe('Component > LoginForm', function () {
  before(function () {
    wrapper = shallow(<LoginForm />)
  })

  it('should render without crashing', function () {
    expect(wrapper).to.be.ok()
  })
})
