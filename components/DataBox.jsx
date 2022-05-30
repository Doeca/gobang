import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default class DataBox extends React.Component {

    constructor(props) {
        super(props)
    }
    render() {
        return (

            <Dialog open={this.props.open} onClose={this.props.onCancel}>
                <DialogTitle>{this.props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.props.content}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        label={this.props.textlabel}
                        type={this.props.texttype}
                        name="roomID"
                        fullWidth
                        variant="standard"
                        autoComplete="given-name"
                        id="roomID"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onCancel} variant="contained">取消</Button>
                    <Button onClick={this.props.onConfirm} variant="contained">确认</Button>
                </DialogActions>
            </Dialog>
          
        ) 
    }
}