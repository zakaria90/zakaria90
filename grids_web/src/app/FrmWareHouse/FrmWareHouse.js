import React, { Component } from 'react';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import "react-table-6/react-table.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Frmwarehouse.css';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { Modal, Button } from 'react-bootstrap'
import * as global from '../Models/global_params';
import swal from 'sweetalert';

export class FrmWarehouse extends Component {
    queryParams = '';
    IsUpdate = false;
    constructor(props) {
        super(props);
        this.state = { warehouse: {}, isFetching: true };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getWareHouse();
    }

    deleteWarehouseConfirmation = (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this warehouse!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    this.deleteWarehouse(id)
                }
            });


    }
    deleteWarehouse = (id) => {
        fetch(`${global.baseUrl}/frmwarehouse/del_warehouse?wa_name=${id}`)
            .then(response => response)
            .then(response => {
                if (!response.error)
                    this.getWareHouse();
                else {
                    alert(response.error.originalError.message);
                }
            })
            .catch(err => console.log(err));
    }
    updateWareHouse = _ => {
        fetch(`${global.baseUrl}/frmwarehouse/upd_warehouse?${this.queryParams}`)
            .then(response => response)
            .then(response => {
                if (!response.error)
                    this.getWareHouse();
                else {
                    alert(response.error.originalError.message);
                }
            })
            .catch(err => console.log(err))
    }
    getWareHouse = _ => {
        fetch(`${global.baseUrl}/frmwarehouse/sel_warehouse?cmp_id=${global.cmp_id}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    this.setState({ wareHouse: response });
                    this.setState({ isFetching: false });
                }
                else {
                    alert(response.error.originalError.message);
                }

            })
            .catch(err => console.log(err));
    }
    handleInputChange = (cellInfo, event) => {
        this.setState({ selectedWareHouse: cellInfo.row._original });
        this.updateWareHouse(cellInfo.row._original)
        let data = [...this.state.wareHouse];
        data[cellInfo.index][cellInfo.column.id] = event.target.value;

        this.setState({ data });
    };
    handleSubmit(event) {
        event.preventDefault();
        var formdata = new FormData(event.target)
        this.queryParams = new URLSearchParams(formdata).toString();
        if (this.IsUpdate)
            this.updateWareHouse();
        else
            this.addProduct();
        this.IsUpdate = false;
        this.closeModal();
    }
    renderEditable = data => {
        let result = [];
        data.map((row, index) => {

            result.push(<tr key={index}>
                {/* <td>{row.wa_name}</td> */}
                {/* <td>{row.wa_cmp_id}</td> */}
                <td>{row.wa_newname}</td>
                <td>{row.wa_address}</td>
                <td>{row.wa_order}</td>
                <td><div className='actions'>
                    <FontAwesomeIcon icon={faTrash} onClick={() => this.deleteWarehouseConfirmation(row.wa_name)}></FontAwesomeIcon>
                    <FontAwesomeIcon icon={faPencilAlt} onClick={() => this.editWareHouse(row)}></FontAwesomeIcon>
                </div>
                </td>
            </tr>);

        });
        return (result);
    };
    editWareHouse = row => {
        try {
            this.openModal();
            setTimeout(_ => {
                document.getElementById("wa_name").value = row.wa_name;
                document.getElementById("wa_address").value = row.wa_address;
                document.getElementById("wa_order").value = row.wa_order;
                document.getElementById("wa_newname").value = row.wa_newname;
                this.IsUpdate = true;
            }, 200);

        } catch (exception) {
            console.log(exception)
        }

    }
    addProduct = _ => {
        const { warehouse } = this.state.warehouse;
        fetch(`${global.baseUrl}/frmwarehouse/add_warehouse?${this.queryParams}`)
            .then(response => {
                if (response.status === 200) {
                    this.getWareHouse();
                }
            })
            .then(response => { })
            .catch(err => console.log(err))
    }

    closeModal() {
        this.IsUpdate = false;
        this.setState({
            showModal: false,
        });
    }

    openModal() {
        this.setState({
            showModal: true,
        });

    }
    render() {
        const wareHouse = this.state.wareHouse;
        const t = this.props.config.translation;
        if (this.state.isFetching) {
            return <h1>Loading</h1>;
        }
        return (
            <div>
                <button onClick={this.openModal.bind(this)} className="btn btn-xs btn-info create-new-warehouse">Create new Warehouse</button>
                <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title id="modal-title">Create/Update warehouse</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="modal-body">
                            <label className="d-none">
                                wa_name
                                <input type="text" value={this.state.warehouse.wa_name} name="wa_name" id="wa_name" className="form-control" />
                            </label>
                            <label className="d-none">
                                wa_cmp_id
                                <input type="text" defaultValue={global.cmp_id} name="wa_cmp_id" id="wa_cmp_id" className="form-control" />
                            </label>
                            <label>
                                {t('wa_name')}
                                <input type="text" value={this.state.warehouse.wa_newname} name="wa_newname" id="wa_newname" className="form-control" />
                            </label>

                            <label>
                                {t('cmp_address')}
                                <input type="text" value={this.state.warehouse.wa_address} name="wa_address" id="wa_address" className="form-control" />
                            </label>
                            <label>
                                {t('cur_order')}
                                <input type="text" value={this.state.warehouse.wa_order} name="wa_order" id="wa_order" className="form-control" />
                            </label>


                        </Modal.Body>
                        <Modal.Footer>
                            <input type="submit" value="Submit" className="btn-success btn" />&nbsp;
                            <Button onClick={this.closeModal.bind(this)} >Close</Button>
                        </Modal.Footer>
                    </form>
                </Modal>


                <table className="table table-bordered table-striped table-hover">
                    <caption>{t('pu_wa_name')}</caption>
                    <thead>
                        <tr>
                            {/* <th>ID</th> */}
                            {/* <th>Company id</th> */}
                            <th>{t('wa_name')}</th>
                            <th> {t('cmp_address')}</th>
                            <th>{t('cur_order')}</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderEditable(wareHouse)}

                    </tbody>
                </table>

            </div>);
    }
}