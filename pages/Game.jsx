import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Board from '@sabaki/go-board';
import { Goban } from '@sabaki/shudan';
import signMap from './signMap';
const h = React.createElement;

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Outlet, Link } from "react-router-dom";
import Appbar from '../components/Appbar.jsx';

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

class Title extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return h('h1', {}, this.props.title)
  }
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      board: new Board(signMap),
      vertexSize: 27,
      showCoordinates: true,
      alternateCoordinates: false,
      fuzzyStonePlacement: true,
      animateStonePlacement: true,
      showLines: false,
      showSelection: false,
      isBusy: false,
      selectedVertices: [],
      sign: 1
    }

    //this.state.board.fromDimensions(15)
    //console.log(this.state.board.signMap)
    this.CheckBox = createTwoWayCheckBox(this)
  }

  isVictory(sign, map, vertex) {

    let count = 0
    let x = vertex[0]
    let y = vertex[1]

    while (--x > 0)
      if (map[y][x] == sign)
        count++
      else break


    x = vertex[0]
    while (++x < 15)
      if (map[y][x] == sign)
        count++
      else break
    if (count >= 4) return true;



    count = 0
    x = vertex[0]
    y = vertex[1]
    while (--y > 0)

      if (map[y][x] === sign)
        count++
      else break
    y = vertex[1]
    while (++y < 15)
      if (map[y][x] === sign)
        count++
      else break
    if (count >= 4) return true;


    count = 0
    x = vertex[0]
    y = vertex[1]
    while (--x > 0 && --y > 0)
      if (map[y][x] === sign)
        count++
      else break
    x = vertex[0]
    y = vertex[1]
    while (++x < 15 && ++y < 15)
      if (map[y][x] === sign)
        count++
      else break
    if (count >= 4) return true;

    count = 0
    x = vertex[0]
    y = vertex[1]
    while (--x > 0 && ++y < 15)
      if (map[y][x] === sign)
        count++
      else break
    x = vertex[0]
    y = vertex[1]
    while (++x < 15 && --y > 0)
      if (map[y][x] === sign)
        count++
      else break
    if (count >= 4) return true;

    return false;
  }

  render() {
    let {
      vertexSize,
      showCoordinates,
      alternateCoordinates,
      fuzzyStonePlacement,
      animateStonePlacement,
      selectedVertices
    } = this.state

    return h(
      'section', {
      style: {
        display: 'grid',
        gridTemplateColumns: 'auto',
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
      h(Title, { title: this.state.title }),
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
          selectedVertices: selectedVertices,
          onVertexMouseUp: (evt, [x, y]) => {
            let newBoard, victory, title
            try {
              if (this.state.board.get([x, y]) != 0)
                throw 101;
              newBoard = this.state.board.set([x, y], this.state.sign)
              victory = this.isVictory(this.state.sign, newBoard.signMap, [x, y])

              title = this.state.title
              if (victory)
                title += " , " + (this.state.sign === 1 ? "黑棋胜" : "白棋胜")

              this.setState({ board: newBoard, sign: this.state.sign * -1, selectedVertices: [[x, y]], isBusy: victory, title: title })

            } catch (e) {

            }

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

function Bang()
{
  return h(App);
}

export default function Game()
{
  return(
    <Box
      sx={{
        marginTop: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
       <CssBaseline  />
         <Appbar />
          <Outlet />
      </Container>

      
      <Box
      sx={{
        marginTop: 4,
        display: 'flex',
        alignItems: 'center',
      }}
      >
        <Typography component="h1" variant="h4">
        游戏中
        </Typography>
        

      </Box>
      
      <Bang />

      <Box
      sx={{
        marginTop: 6,
        display: 'flex',
        alignItems: 'center',
      }}
      >
        <Grid container spacing={7}>
          <Grid item>
            <Button 
            variant="contained" 
            color="warning"
            size="large"
            >
             投降
            </Button>
          </Grid>
          <Grid item>
            <Button 
            variant="contained" 
            color="primary"
            size="large"
            >
              退出游戏
            </Button>
          </Grid>
          <Grid item>
            <Button 
            variant="contained" 
            color="success"
            size="large"
            >
              和棋
            </Button>
          </Grid>
        </Grid>
          
      </Box>
      
  </Box>
  
  )
  
}