
import * as React from 'react';
import Board from '@sabaki/go-board';
import { BoundedGoban } from '@sabaki/shudan';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { Outlet, Link, useNavigate } from "react-router-dom";
import { maxWidth, maxHeight } from '@mui/system';
import GameLogic from '../logic/game'
import MessageBox from "../components/MessageBox.jsx"

import AIPlay from '../logic/AIPlay.js'

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

class Bang extends React.Component {
  constructor(props) {
    super(props)
    let signMap = new Array();
    for (var k = 0; k < 15; k++) {
      signMap.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }

    this.state = {
      board: new Board(signMap),
      maxWidth: 500,
      maxHeight: 500,
      maxVertexSize: 23,
      showCoordinates: true,
      alternateCoordinates: false,
      fuzzyStonePlacement: false,
      animateStonePlacement: true,
      showLines: false,
      showSelection: false,
      isBusy: false,
      selectedVertices: [],
      sign: 1
    }

    if (GameLogic.gameMode == 1) {
      let intervalID = setInterval(async () => {
        if (window.location.href.indexOf("game") == -1)
          clearInterval(intervalID);
        let ret = await GameLogic.pullData(this.state);

        if (ret.status == 1) {
          console.log(ret);
          this.setState(ret.state);
        }
      }, 500);
      GameLogic.gameInfo.interval = intervalID;
    }

    if (GameLogic.gameMode == 2) {

      let intervalID = setInterval(async () => {
        if (window.location.href.indexOf("game") == -1)
          clearInterval(intervalID);


        if (GameLogic.watchLoded == false) {
          await GameLogic.syncData(this.state);
        }
        let ret = await GameLogic.pullData(this.state);
        if (ret.status == 1) {
          console.log(ret);
          this.setState(ret.state);
        }
      }, 500);
      GameLogic.gameInfo.interval = intervalID;
    }

    if (GameLogic.gameMode == 3) {
      GameLogic.pveInit();
    }

  }


  render() {
    let {
      maxWidth,
      maxHeight,
      maxVertexSize,
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

      h(
        'div', {},
        h(BoundedGoban, {
          innerProps: {
            onContextMenu: evt => evt.preventDefault()
          },
          maxWidth,
          maxHeight,
          maxVertexSize,
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
            //游戏逻辑交付game.js进行处理
            //提交坐标和当前棋盘给game.js，然后点击事件
            let res = { status: 0 };
            if (GameLogic.gameMode == 0)
              res = GameLogic.gameHandle(this.state, [x, y]);
            else if (GameLogic.gameMode == 1)
              res = GameLogic.onlineHandle(this.state, [x, y]);
            else if (GameLogic.gameMode == 2)
              res = { status: 0 }; //观战模式不执行任何操作


            if (res.status == 1)
              this.setState(res.data);

            if (GameLogic.gameMode == 3) {
              //人机模式，先人下，后机器下
              res = GameLogic.aiHandle(this.state, [x, y], 1);


              if (res.status == 1)
                this.setState(res.data);


              if (res.data.isBusy != true) {
                let cords = AIPlay(res.data.board.signMap);
                setTimeout(() => {
                  res = GameLogic.aiHandle(this.state, cords, -1);
                  if (res.status == 1)
                    this.setState(res.data);
                }, 1000);

              }
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


export default function Game() {


  let navigate = useNavigate();
  const [msgBox, setMsgBox] = React.useState({ title: "", content: "" });
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState({ type: "info", title: "游戏进行中", content: "当前回合，黑棋行" });
  const handleClose = () => {
    setOpen(false);
  }
  const setError = () => {
    navigate('/');
  }

  GameLogic.setInterface(setOpen, setMsgBox, setTitle, setError);

  return (
    <Box
      sx={{
        marginTop: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <MessageBox title={msgBox.title} content={msgBox.content} open={open} onClick={handleClose} />
      <Stack sx={{ width: '100%' }} spacing={2}>

        <Alert severity={title.type}>
          <AlertTitle>{title.title}</AlertTitle>
          {title.content}
        </Alert>
      </Stack>

      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          alignItems: 'center',
        }}
      >




      </Box>

      <Bang />

      <Box
        sx={{
          marginTop: 6,
          display: 'flex',
          alignItems: 'center',
        }}
      >

        {GameLogic.gameMode != 0 &&
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
        }
      </Box>

    </Box>

  )

}