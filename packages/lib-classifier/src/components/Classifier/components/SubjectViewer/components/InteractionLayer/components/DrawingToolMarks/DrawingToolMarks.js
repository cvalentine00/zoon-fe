import React, { useContext } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { DeleteButton, DrawingToolRoot } from '@plugins/drawingTools/components'
import SVGContext from '@plugins/drawingTools/shared/SVGContext'

function DrawingToolMarks ({ activeMarkId, onDelete, onDeselectMark, onSelectMark, scale, tool }) {
  const marksArray = Array.from(tool.marks.values())
  const { svg } = useContext(SVGContext)

  return marksArray.map((mark, index) => {
    const MarkingComponent = observer(mark.toolComponent)
    const ObservedDeleteButton = observer(DeleteButton)
    const isActive = mark.id === activeMarkId

    function isInBounds (markElement) {
      const object = markElement.getBoundingClientRect()
      const bounds = svg.getBoundingClientRect()
      const notBeyondLeft = (object.left + object.width) > bounds.left
      const notBeyondRight = object.left < (bounds.left + bounds.width)
      const notBeyondTop = (object.top + object.height) > bounds.top
      const notBeyondBottom = object.top < (bounds.top + bounds.height)
      return notBeyondLeft && notBeyondRight && notBeyondTop && notBeyondBottom
    }

    function deleteMark () {
      tool.deleteMark(mark)
      onDelete(mark)
    }

    function moveMark (event, difference) {
      mark.move(difference)
    }

    function deselectMark (event) {
      onDeselectMark(mark)
      if (!isInBounds(event.currentTarget)) {
        deleteMark()
      }
    }

    function selectMark () {
      onSelectMark(mark)
    }

    return (
      <DrawingToolRoot
        key={mark.id}
        isActive={isActive}
        coords={mark.coords}
        dragStart={selectMark}
        dragMove={moveMark}
        dragEnd={deselectMark}
        label={`Mark ${index}`}
        mark={mark}
        onDelete={deleteMark}
        onDeselect={onDeselectMark}
        onSelect={onSelectMark}
        tool={tool}
      >
        <MarkingComponent
          active={isActive}
          mark={mark}
          scale={scale}
          tool={tool}
        />
        {isActive && <ObservedDeleteButton
          label={`Delete ${tool.type}`}
          mark={mark}
          scale={scale}
          onDelete={deleteMark}
        />}
      </DrawingToolRoot>
    )
  })
}

DrawingToolMarks.propTypes = {
  activeMarkId: PropTypes.string,
  onDelete: PropTypes.func,
  onDeselectMark: PropTypes.func,
  onSelectMark: PropTypes.func,
  scale: PropTypes.number,
  tool: PropTypes.object.isRequired
}

DrawingToolMarks.defaultProps = {
  activeMarkId: '',
  onDelete: () => true,
  onDeselectMark: () => true,
  onSelectMark: () => true,
  scale: 1
}

export default DrawingToolMarks