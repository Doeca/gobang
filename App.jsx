import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Board from '@sabaki/go-board';
import { Goban } from '@sabaki/shudan';
const h = React.createElement;


const chineseCoord = [
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五',
  '十六',
  '十七',
  '十八',
  '十九'
]
const signMap = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

const createTwoWayCheckBox = component => ({ stateKey, text }) =>
  h(
    'label', {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  },

    h('input', {
      style: { marginRight: '.5em' },
      type: 'checkbox',
      checked: component.state[stateKey],
      onClick: () => component.setState(s => ({
        [stateKey]: !s[stateKey]
      }))
    }),

    h('span', { style: { userSelect: 'none' } }, text)
  )

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      board: new Board(signMap),
      vertexSize: 20,
      showCoordinates: true,
      alternateCoordinates: false,
      fuzzyStonePlacement: true,
      animateStonePlacement: true,
      showLines: false,
      showSelection: false,
      isBusy: false,
      sign: 1
    }

    //this.state.board.fromDimensions(15)
    //console.log(this.state.board.signMap)
    this.CheckBox = createTwoWayCheckBox(this)
  }

  render() {
    let {
      vertexSize,
      showCoordinates,
      alternateCoordinates,
      fuzzyStonePlacement,
      animateStonePlacement,
      showPaintMap,
      showHeatMap,
      showMarkerMap,
      showGhostStones,
      showLines,
      showSelection
    } = this.state

    return h(
      'section', {
      style: {
        display: 'grid',
        gridTemplateColumns: '15em auto',
        gridColumnGap: '1em'
      }
    },

      h(
        'form', {
        style: {
          display: 'flex',
          flexDirection: 'column'
        }
      },


      ),

      h(
        'div', {},
        h(Goban, {
          innerProps: {
            onContextMenu: evt => evt.preventDefault()
          },

          vertexSize,
          animate: true,
          busy: this.state.isBusy,
          coordX: alternateCoordinates ? i => chineseCoord[i] : undefined,
          coordY: alternateCoordinates ? i => i + 1 : undefined,

          signMap: this.state.board.signMap,
          showCoordinates,
          fuzzyStonePlacement,
          animateStonePlacement,
          paintMap: showPaintMap && paintMap,
          heatMap: showHeatMap && heatMap,
          markerMap: showMarkerMap && markerMap,
          ghostStoneMap: showGhostStones && ghostStoneMap,

          lines: showLines ?
            [
              { type: 'line', v1: [15, 6], v2: [12, 15] },
              { type: 'arrow', v1: [10, 4], v2: [5, 7] }
            ] :
            [],

          dimmedVertices: [],

          selectedVertices: [],

          onVertexMouseUp: (evt, [x, y]) => {
            //let sign = evt.button === 0 ? 1 : -1
            let newBoard
            try {
              newBoard = this.state.board.makeMove(this.state.sign, [x, y], { preventOverwrite: true })
            } catch (e) {
              this.setState({isBusy:true})
              newBoard = this.state.board.clone();
            }
            this.setState({ sign: this.state.sign * -1 })
            this.setState({ board: newBoard })
          }
        }),

        alternateCoordinates &&
        h(
          'style', {},
          `.shudan-coordx span {
          font-size: .45em;
        }`
        )
      )
    )
  }
}

ReactDOM.render(h(App), document.getElementById('root'))
