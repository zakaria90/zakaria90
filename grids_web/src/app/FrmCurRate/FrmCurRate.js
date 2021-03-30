import { React, Component } from 'react';
import { Modal, Button } from 'react-bootstrap'
import { confirmAlert } from 'react-confirm-alert'; // Import
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as global from '../Models/global_params';

export class FrmCurRate extends Component {
    t;
    constructor(props) {
        super(props)
        this.t = this.props.config.translation;
        this.state = { cur_rate: [] };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
    }
    componentDidUpdate(prevProps) {
        if (this.props.config.cur_code != prevProps.cur_code) {
            this.getCurRate();
            this.getCurrency();

        }
    }
    getCurRate = _ => {
        fetch(`${global.baseUrl}/frmCurrency/sel_cur_rate?cur_code=${this.props.config.cur_code}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    this.fetchData(response)
                    this.setState({ cur_rate: response });
                }
                else {
                    alert(response.error.originalError.message);
                }

            })
            .catch(err => console.log(err));
    }
    fetchData = data => {
        const res = [];
        if (data.length > 0) {
            data.map(row => {
                res.push(<tr key={row.rate_seq}>
                    <td>{row.rate_rate}</td>
                    <td>{this.props.config.cur_newcode}</td>
                    <td>{row.cur_newcode}</td>
                    <td>{row.rate_date}</td>
                    <td>{row.rate_minrate}</td>
                    <td>{row.rate_maxrate}</td>
                    <td><FontAwesomeIcon icon={faPencilAlt} onClick={() => this.editCurRate(row)}></FontAwesomeIcon></td>
                </tr>)
            });
        }

        return res;
    }

    editCurRate = row => {
        try {
            this.openModal();
            setTimeout(_ => {
                document.getElementById("rate_rate").value = row.rate_rate;
                document.getElementById("rate_cur_code1").value = row.rate_cur_code1;
                document.getElementById('rate_cur_code2').value = row.rate_cur_code2;
                document.getElementById("rate_date").value = row.rate_date.substr(0, 19);
                document.getElementById("rate_minrate").value = row.rate_minrate;
                document.getElementById("rate_maxrate").value = row.rate_maxrate;
                document.getElementById('rate_seq').value = row.rate_seq;
            }, 200);

        } catch (exception) {
            console.log(exception)
        }

    }
    handleSubmit(event) {
        event.preventDefault();
        var formdata = new FormData(event.target)

        this.queryParams = new URLSearchParams(formdata).toString();
        this.addUpdateCurRate();
        this.closeModal();

    }
    addUpdateCurRate = _ => {
        fetch(`${global.baseUrl}/frmCurrency/addcrate?${this.queryParams}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    this.getCurRate();
                }
                else {
                    alert(response.error.originalError.message);
                }
            })
            .catch(err => console.log(err));
    }
    closeModal() {
        this.setState({
            showModal: false,
        });
    }
    openModal() {
        if (this.props.config.cur_code === '') {
            alert('please select currency before add rate');
        } else {
            this.setState({
                showModal: true,
            });
        }
    }
    getCurrency = _ => {
        const curr = [];
        fetch(`${global.baseUrl}/frmcurrency/sel_curreny?cmp_id=${global.cmp_id}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    console.log(response);
                    response.map(res => {
                        const disabled = res.cur_code === this.props.config.cur_code
                        curr.push(<option key={res.cur_code} value={res.cur_code} disabled={disabled} >{res.cur_newcode}</option>)
                    });
                    this.setState({ currencies: curr });
                }
                else {
                    alert(response.error.originalError.message);
                }

            })
            .catch(err => console.log(err));
        return curr;
    }
    RateModal = (rate) => {
        return (
            <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>
                <form onSubmit={this.handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title id="modal-title">Create/Update Rate</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <div className="d-flex">
                            <label>
                                {this.t('rate_rate')}
                                <input type="text" name="rate_rate" id="rate_rate" defaultValue={rate.rate_rate} className="form-control" />
                            </label>
                            <label>
                                {this.t('rate_cur_code2')}
                                <select className="form-control" id="rate_cur_code2" name="rate_cur_code2">
                                    {this.state.currencies}
                                </select>
                            </label>
                            <label className="d-none">
                                <input type="text" name="rate_cur_code1" defaultValue={this.props.config.cur_code} id="rate_cur_code1"></input>
                            </label>
                        </div>
                        <div className="d-flex">

                            <label>
                                {this.t('rate_minrate')}
                                <input type="text" name="rate_minrate" id="rate_minrate" defaultValue={rate.rate_minrate} className="form-control" />
                            </label>
                            <label>
                                {this.t('rate_maxrate')}
                                <input type="text" name="rate_maxrate" id="rate_maxrate" defaultValue={rate.rate_maxrate} className="form-control" />
                            </label>
                        </div>
                        <div className="d-flex">
                            <label>
                                {this.t('rate_date')}
                                <input type="datetime-local" name="rate_date" id="rate_date" defaultValue={this.getCurrentDate(rate.rate_date)} className="form-control" />
                            </label>
                            <label className="d-none">
                                rate_seq
                            <input type="text" name="rate_seq" id="rate_seq" defaultValue={rate.rate_seq} readOnly className="form-control"></input>
                            </label>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <input type="submit" value="Submit" className="btn-success btn" />&nbsp;
                    <Button onClick={this.closeModal.bind(this)} >Close</Button>
                    </Modal.Footer>
                </form>
            </Modal>)

    }
    getCurrentDate = (_date) => {
        var today = new Date();
        if (_date === '' || _date === null) {
            var dd = today.getDate();

            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }

            if (mm < 10) {
                mm = '0' + mm;
            }
            today = yyyy + '-' + mm + "-" + dd + "T12:00";
        } else {
            today = _date;
        }
        return today;
    }
    render() {
        const data = this.state.cur_rate;
        const rate = { rate_seq: "", rate_cur_code1: "", rate_rate: "", rate_cur_code2: "", rate_date: "", rate_minrate: "", rate_maxrate: "" };
        return (
            <div>
                <h4 className="table-header">Rate table <button onClick={this.openModal.bind(this)} className="btn btn-sm btn-info">add new rate</button></h4>
                <div className="table-container">
                    <table className="table table-bordered table-striped table-hover">
                        <thead>
                            <tr key="1">
                                <th>Rate</th>
                                <th>Curreny From </th>
                                <th>Currency To</th>
                                <th> {this.t('rate_date')}</th>
                                <th>{this.t('rate_minrate')}</th>
                                <th>{this.t('rate_maxrate')}</th>
                                <th>action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.fetchData(data)}
                        </tbody>
                    </table>
                    {this.RateModal(rate)}
                </div>
            </div>

        )
    }
}