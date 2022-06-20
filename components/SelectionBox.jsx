import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default class SelectionBox extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (

            <Dialog
                open={this.props.open}
                onClose={this.props.onClick}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {this.props.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.props.content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.se1} autoFocus>
                        {this.props.se1title}
                    </Button>
                    <Button onClick={this.props.se2} autoFocus>
                        {this.props.se2title}
                    </Button>
                </DialogActions>
            </Dialog>

        );
    }
}