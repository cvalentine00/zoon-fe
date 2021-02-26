import { shallow } from 'enzyme'
import React from 'react'
import sinon from 'sinon'
import ScatterPlotViewerConnector from './ScatterPlotViewerConnector'
import ScatterPlotViewerContainer from './ScatterPlotViewerContainer'

const mockStore = {
  classifierStore: {
    subjects: {
      active: { id: '1' }
    },
    subjectViewer: {
      setOnPan: sinon.spy(),
      setOnZoom: sinon.spy()
    }
  }
}

describe('ScatterPlotViewerConnector', function () {
  let wrapper, useContextMock, containerProps
  before(function () {
    useContextMock = sinon.stub(React, 'useContext').callsFake(() => mockStore)
    wrapper = shallow(
      <ScatterPlotViewerConnector />
    )
    containerProps = wrapper.find(ScatterPlotViewerContainer).props()
  })

  after(function () {
    useContextMock.restore()
  })

  it('should render without crashing', function () {
    expect(wrapper).to.be.ok()
  })

  it('should pass the active subject as a prop', function () {
    expect(containerProps.subject).to.deep.equal(mockStore.classifierStore.subjects.active)
  })

  it('should pass the setOnPan function', function () {
    expect(containerProps.setOnPan).to.deep.equal(mockStore.classifierStore.subjectViewer.setOnPan)
  })

  it('should pass the setOnZoom function', function () {
    expect(containerProps.setOnZoom).to.deep.equal(mockStore.classifierStore.subjectViewer.setOnZoom)
  })
})