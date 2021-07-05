import { shallow } from 'enzyme'

import RecentSubjects from './RecentSubjects'

let wrapper

describe('Component > RecentSubjects', function () {
  before(function () {
    wrapper = shallow(<RecentSubjects />)
  })

  it('should render without crashing', function () {
    expect(wrapper).to.be.ok()
  })
})
