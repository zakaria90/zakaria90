import { React, Component } from 'react';
import { Modal, Button } from 'react-bootstrap'
import './FrmCurrency.css'
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { FrmCurRate } from '../FrmCurRate/FrmCurRate';
import * as global from '../Models/global_params';
import swal from 'sweetalert';

export class FrmCurrency extends Component {
    currency = { cur_code: String, cur_name: String, cur_order: String, cur_decimal: String, cur_round: String, cur_roundupdown: String, cur_newcode: String, cur_cmp_id: String };
    t;
    constructor(props) {
        super(props);
        this.t = this.props.config.translation;
        this.state = { currencies: {}, cur_code: '', cur_newcode: '' };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        this.getData();
    }
    getData = _ => {
        fetch(`${global.baseUrl}/frmcurrency/sel_curreny?cmp_id=${global.cmp_id}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    if (response.length > 0) {
                        this.setState({ cur_code: response[0].cur_code, cur_newcode: response[0].cur_newcode })
                    }
                    this.setState({ currencies: response });
                }
                else {
                    swal('error retrieving data', response.error.originalError.message);
                }

            })
            .catch(err => console.log(err));
    }
    handleSubmit(event) {
        event.preventDefault();
        var formdata = new FormData(event.target)

        this.queryParams = new URLSearchParams(formdata).toString();

        this.addcurrency();
        this.closeModal();
        this.getData();
    }
    addcurrency = (currency) => {
        fetch(`${global.baseUrl}/frmcurrency/addcurrency?${this.queryParams}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    this.getData();
                    this.setState({ currencies: response });
                }
                else {
                    swal('error retrieving data', response.error.originalError.message);
                }

            })
            .catch(err => console.log(err));
    }
    getRate = (e, cur_code, cur_newcode) => {
        const trs = document.getElementsByClassName('cur-tr')
        for (var i = 0; i < trs.length; i++) {
            trs[i].classList.remove('active')
        }
        e.target.parentElement.classList.add('active');

        this.setState({ cur_code: cur_code, cur_newcode: cur_newcode });
    }
    fetchData = (data) => {
        const res = [];
        if (data.length > 0) {
            data.map((curr, index) => {
                let active = "";
                if (index === 0) {
                    active = 'active';
                }

                res.push(<tr className={"cur-tr " + active} key={curr.cur_code} onClick={(e) => { this.getRate(e, curr.cur_code, curr.cur_newcode) }}>
                    <td>{curr.cur_newcode}</td>
                    <td>{curr.cur_name}</td>
                    <td>{curr.cur_order}</td>
                    <td>{curr.cur_decimal}</td>
                    <td>{curr.cur_round}</td>
                    <td>{curr.cur_roundupdown}</td>
                    <td> <div className='actions'>
                        <FontAwesomeIcon className="delete-icon" icon={faTrash} onClick={() => this.deleteCurrencyConfirmation(curr.cur_code)}></FontAwesomeIcon>
                        <FontAwesomeIcon icon={faPencilAlt} onClick={() => this.editCurrency(curr)}></FontAwesomeIcon>
                    </div>  </td>
                </tr>);
            });
        }
        return res;
    }
    editCurrency = row => {
        try {
            this.openModal();
            setTimeout(_ => {
                document.getElementById("cur_code").value = row.cur_code;
                document.getElementById("cur_name").value = row.cur_name;
                document.getElementById("cur_newcode").value = row.cur_newcode;
                document.getElementById("cur_order").value = row.cur_order;
                document.getElementById("cur_decimal").value = row.cur_decimal;
                document.getElementById('cur_round').value = row.cur_round;
                document.getElementById("cur_roundupdown").value = row.cur_roundupdown;
            }, 200);

        } catch (exception) {
            console.log(exception)
        }

    }
    closeModal() {
        this.setState({
            showModal: false,
        });
    }
    openModal() {
        this.setState({
            showModal: true,
        });

    }
    newCurrencyModal = _ => {
        return (
            <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>
                <form onSubmit={this.handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title id="modal-title">Create/Update Currency</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <div className="d-flex">
                            <label className="d-none">
                                <input type="text" name="cur_code" id="cur_code" readOnly />
                            </label>
                            <label>
                                {this.t('cur_name')}
                                <input type="text" name="cur_name" id="cur_name" className="form-control" />
                            </label>
                            <label>
                                {this.t('cur_newcode')}
                                <input type="text" name="cur_newcode" id="cur_newcode" className="form-control" />
                            </label>
                        </div>
                        <div className="d-flex">
                            <label>
                                {this.t('cur_order')}
                                <input type="text" name="cur_order" id="cur_order" className="form-control" />
                            </label>
                            <label>
                                {this.t('cur_Decimal')}
                                <select name="cur_decimal" id="cur_decimal" className="form-control">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                </select>
                            </label>
                        </div>
                        <div className="d-flex">
                            <label>
                                {this.t('cur_round')}
                                <input type="text" name="cur_round" id="cur_round" className="form-control" />
                            </label>
                            <label>
                                {this.t('cur_roundupdown')}
                                <select name="cur_roundupdown" id="cur_roundupdown" className="form-control" defaultValue="nearset">
                                    <option value="nearset">Nearset</option>
                                    <option value="up">up</option>
                                    <option value="down">Down</option>
                                </select>

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
    deleteCurrencyConfirmation = (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this currency!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    this.deleteCurrency(id)
                }
            });
    }
    deleteCurrency = (id) => {
        fetch(`${global.baseUrl}/frmcurrency/del_currency?cur_code=${id}`)
            .then(response => response)
            .then(response => {
                if (!response.error) {
                    alert(response);
                    this.getData();
                }
                else {
                    alert(response.error.originalError.message);
                }
            })
            .catch(err => console.log(err));
    }
    render() {
        const data = this.state.currencies;
        const translate = this.props.config.translation;
        const CurRateProps = { translation: this.t, cur_code: this.state.cur_code, cur_newcode: this.state.cur_newcode }

        return (
            
            <div className="curreny-grid" >
                <div>
                    <h4 className="table-header">Curreny table <button onClick={this.openModal.bind(this)} className="btn btn-sm btn-info">{translate('add new Curreny')}</button></h4>
                    <div className="table-container">
                        <table className="table table-bordered table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>{this.t('cur_newcode')}</th>
                                    <th> {this.t('cur_name')}</th>
                                    <th>{this.t('cur_order')}</th>
                                    <th>{this.t('cur_Decimal')}</th>
                                    <th>{this.t('cur_order')}</th>
                                    <th> {this.t('cur_roundupdown')}</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.fetchData(data)}
                            </tbody>
                        </table>

                    </div>

                </div>

                <FrmCurRate config={CurRateProps} />


                { this.newCurrencyModal()}
            </div >
           
        )
    }
}