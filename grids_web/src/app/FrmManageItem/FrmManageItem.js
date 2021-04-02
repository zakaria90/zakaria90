import react, { Component } from 'react';
import swal from 'sweetalert';
import { FrmFamily } from '../FrmFamily/FrmFamily';
import { Modal, Button } from 'react-bootstrap';
import * as global from '../Models/global_params';
import './FrmManageItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
export class FrmManageItem extends Component {
    t;
    constructor(props) {
        super(props);
        this.t = this.props.config.translation;
        this.state = {
            itemsData: [], selected_family: {},
            selected_item: {},
            warehouse: [],
            branch: [],
            division: [],
            POSDisplay: [],
            Brand: [],
            Currency: [],
            Families: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {

    }
    handleSubmit = (event) => {
        event.preventDefault();
        var formdata = new FormData(event.target);
        this.queryParams = new URLSearchParams(formdata).toString();

        if (document.getElementById('it_id').value === '') {
            this.addst_item(event, this.queryParams)
        } else {
            this.updst_item(event, this.queryParams);
        }

    }

    addst_item = (e, params) => {
        fetch(`${global.baseUrl}frmmanageitem/addst_item?${params}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    this.getManageItemData(this.state.selected_family.fa_name);
                    this.closeModal();
                } else {
                    swal('error', response.error.originalError.info.message, "error")
                }
            })
    }
    updst_item = (e, params) => {
        fetch(`${global.baseUrl}frmmanageitem/addst_item?${params}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    this.getManageItemData(this.state.selected_family.fa_name)
                } else {
                    swal('error', response.error.originalError.info.message, "error")
                }
            })
    }
    detectFamilyClick = (e) => {
        this.setState({ selected_family: e });

        this.getManageItemData(e.fa_name);
    }
    getManageItemData(it_fa_name) {
        fetch(`${global.baseUrl}frmManageItem/sel_st_item?it_cmp_id=${global.cmp_id}&it_fa_name=${it_fa_name}`)
            .then(response => response.json())
            .then(response => {
                if (!response.errr) {
                    this.fetchData(response)
                } else {
                    swal("error", response.error.originalError.info.message, "error");
                }
            })
    }
    setSelectedItem = (e, item) => {
        const items = document.getElementsByClassName('item-row');
        for (let i = 0; i < items.length; i++) {

            if (items.item(i).getAttribute('id') === e) {
                console.log(items.item(i).getAttribute('id'), e)
                items.item(i).classList.toggle('selected');
            } else {
                items.item(i).classList.remove('selected');
            }
        }
        if ((typeof this.state.selected_item.it_id === 'undefined') || this.state.selected_item.it_id !== item.it_id) {
            this.setState({ selected_item: item });

        } else if (this.state.selected_item.it_id === item.it_id) {
            this.setState({ selected_item: {} });
        }

    }
    /////////////////////////load item data table//////////////////
    fetchData = data => {
        const res = [];
        data.map(item => {
            res.push(
                <tr key={item.it_id} id={item.it_id} className="item-row" onClick={(e) => this.setSelectedItem(item.it_id, item)}>
                    {/* <td>{item.it_id}</td> */}
                    {/* <td>{item.it_cmp_id}</td> */}
                    <td>{item.it_name}</td>
                    {/* <td>{item.fa_newname}</td> */}
                    <td>{item.it_group}</td>
                    <td>{item.bra_newname}</td>
                    <td>{item.br_newname}</td>
                    <td>{item.it_unit}</td>
                    <td>{item.cur_name}</td>
                    <td>{item.it_unitprice}</td>
                    <td>{item.it_vat}</td>
                    <td>{item.it_barcode}</td>
                    <td>{item.it_alertqty}</td>
                    <td>{item.di_newname}</td>
                    <td>{item.it_inactive}</td>
                    <td>{item.it_size}</td>
                    <td>{item.it_color}</td>
                    <td>{item.it_code}</td>
                    <td>{item.it_points}</td>
                    <td>{item.div_newname}</td>
                    <td>{item.it_image}</td>
                    <td>{item.it_profit}</td>
                    <td>{item.it_profrule}</td>
                    <td>{item.it_altname}</td>
                    <td>{item.wa_newname}</td>
                    <td>{item.it_specialcode}</td>
                    <td>{item.it_userstamp}</td>
                    <td>{item.it_timestamp}</td>
                    <td>{item.it_commission}</td>
                    <td>{item.it_minprice}</td>
                    <td>{item.it_remqty}</td>
                    <td>{item.it_cost}</td>
                    <td>{item.it_lastsuppliername}</td>
                    <td>{item.it_lastsupplierprice}</td>
                    <td>{item.it_cashback}</td>
                    <td>{item.it_maxqty}</td>
                    <td>{item.it_order}</td>
                </tr>);
        });
        this.setState({ itemsData: res });
    }
    ///////////////get warehouse/////////////////////////////////
    getWareHouse = _ => {
        fetch(`${global.baseUrl}/frmwarehouse/sel_warehouse?cmp_id=${global.cmp_id}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    const result = [];
                    response.map((row, index) => {
                        result.push(
                            <option key={row.wa_name} value={row.wa_name}>{row.wa_newname}</option>
                        );
                        if (response.length === index + 1) {
                            this.setState({ warehouse: result });
                        }
                    });
                }
                else {
                    swal("error fetching warehouse", response.error.originalError.message, "error");
                }

            })
            .catch(err => console.log(err));

    }
    ///////////get method that call the select method from backend//////  
    getBranch = _ => {
        fetch(`${global.baseUrl}frmbranch/sel_branch?bra_cmp_id=${global.cmp_id}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    const result = [];
                    response.map((row, index) => {
                        result.push(
                            <option key={row.bra_name} value={row.bra_name}>{row.bra_newname}</option>
                        );
                        if (response.length === index + 1) {
                            this.setState({ branch: result });
                        }
                    });
                }
                else {
                    swal("error fetching branches", response.error.originalError.message, "error");
                }
            })
            .catch(err => console.log(err));
    }
    /////////////////////////get division list///////////////////
    getDivision = _ => {
        fetch(`${global.baseUrl}frmdivision/sel_division?div_cmp_id=${global.cmp_id}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    const result = [];
                    console.log(response);
                    response.map((row, index) => {
                        result.push(
                            <option key={row.div_name} value={row.div_name}>{row.div_newname}</option>
                        );
                        if (response.length === index + 1) {
                            this.setState({ division: result });
                        }
                    });
                }
                else {
                    swal("error fetching branches", response.error.originalError.message, "error");
                }

            })
            .catch(err => console.log(err));
    }
    /////////////////////////get POS display list///////////////////
    getPOSDisplay = _ => {
        fetch(`${global.baseUrl}frmposdisplay/sel_pos_display?di_cmp_id=${global.cmp_id}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    const result = [];
                    console.log(response);
                    response.map((row, index) => {
                        result.push(
                            <option key={row.di_name} value={row.di_name}>{row.di_newname}</option>
                        );
                        if (response.length === index + 1) {
                            this.setState({ POSDisplay: result });
                        }
                    });
                }
                else {
                    swal("error fetching branches", response.error.originalError.message, "error");
                }

            })
            .catch(err => console.log(err));
    }
    /////////////////////////get Brands list///////////////////
    getBrand = _ => {
        fetch(`${global.baseUrl}frmbrand/sel_brand?br_cmp_id=${global.cmp_id}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    const result = [];
                    console.log(response);
                    response.map((row, index) => {
                        result.push(
                            <option key={row.br_name} value={row.br_name}>{row.br_newname}</option>
                        );
                        if (response.length === index + 1) {
                            this.setState({ Brand: result });
                        }
                    });
                }
                else {
                    swal("error fetching branches", response.error.originalError.message, "error");
                }

            })
            .catch(err => console.log(err));
    }
    //////////////////get currency///////////////////
    getCurr = _ => {
        fetch(`${global.baseUrl}FrmCurrency/sel_curreny?cmp_id=${global.cmp_id}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    const result = [];
                    console.log(response);
                    response.map((row, index) => {
                        result.push(
                            <option key={row.cur_code} value={row.cur_code}>{row.cur_name}</option>
                        );
                        if (response.length === index + 1) {
                            this.setState({ Currency: result });
                        }
                    });
                }
                else {
                    swal("error fetching branches", response.error.originalError.message, "error");
                }

            })
            .catch(err => console.log(err));
    }
    //////////////////get family/////////////////////
    getFamilies() {
        fetch(`${global.baseUrl}/frmFamily/sel_family?fa_cmp_id=${global.cmp_id}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    const result = [];
                    response.recordset.map((row, index) => {
                        result.push(
                            <option key={row.fa_name} value={row.fa_name}>{row.fa_newname}</option>
                        );
                        if (response.recordset.length === index + 1) {
                            this.setState({ Families: result });
                        }
                    });

                } else {
                    swal('Error', response.error);
                }
            })
    }
    ItemFormModal() {
        return (
            <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)} size="lg">
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title id="modal-title">Create/Update item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <div className="form-grid">
                            <label className="d-none">
                                {this.t('it_id')}
                                <input type="text" name="it_id" id="it_id" defaultValue={this.state.selected_item.it_id} className="form-control" />
                            </label>
                            <label className="d-none">
                                {this.t('it_cmp_id')}
                                <input type="text" name="it_cmp_id" id="it_cmp_id" defaultValue={global.cmp_id} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_name')}
                                <input type="text" name="it_name" id="it_name" defaultValue={this.state.selected_item.it_name} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_fa_name')}
                                <select name="it_fa_name" id="it_fa_name" className="form-control">
                                    {this.state.Families}
                                </select>
                            </label>
                            <label>
                                {this.t('it_group')}
                                <select name="it_group" id="it_group" className="form-control">
                                    <option value="stock">Stock</option>
                                    <option value="Mixed Product">Mixed Product</option>
                                    <option value="Finished Product">Finished Product</option>
                                    <option value="Pack">Pack</option>
                                    <option value="Set">Set</option>
                                    <option value="Non Stock">Non Stock</option>
                                </select>
                            </label>
                            <label>
                                {this.t('it_bra_name')}
                                <select name="it_bra_name" id="it_bra_name" className="form-control">
                                    {this.state.branch}
                                </select>
                            </label>
                            <label>
                                {this.t('it_br_name')}
                                <select name="it_br_name" id="it_br_name" className="form-control">
                                    {this.state.Brand}
                                </select>
                            </label>
                            <label>
                                {this.t('it_unit')}
                                <input type="text" name="it_unit" id="it_unit" defaultValue={this.state.selected_item.it_unit} className="form-control" />
                            </label>

                            <label>
                                {this.t('it_cur_code')}
                                <select name="it_cur_code" id="it_cur_code" className="form-control">
                                    {this.state.Currency}
                                </select>
                            </label>
                            <label>
                                {this.t('it_unitprice')}
                                <input type="text" name="it_unitprice" id="it_unitprice" defaultValue={this.state.selected_item.it_unitprice} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_vat')}
                                <input type="text" name="it_vat" id="it_vat" defaultValue={this.state.selected_item.it_vat} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_barcode')}
                                <input type="text" name="it_barcode" id="it_barcode" defaultValue={this.state.selected_item.it_barcode} className="form-control" />
                            </label>

                            <label>
                                {this.t('it_di_name')}
                                <select name="it_di_name" id="it_di_name" className="form-control">
                                    {this.state.POSDisplay}
                                </select>
                            </label>
                            <label>
                                {this.t('it_inactive')}
                                <input type="text" name="it_inactive" id="it_inactive" defaultValue={this.state.selected_item.it_inactive} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_size')}
                                <input type="text" name="it_size" id="it_size" defaultValue={this.state.selected_item.it_size} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_color')}
                                <input type="text" name="it_color" id="it_color" defaultValue={this.state.selected_item.it_color} className="form-control" />
                            </label>

                            <label>
                                {this.t('it_code')}
                                <input type="text" name="it_code" id="it_code" defaultValue={this.state.selected_item.it_code} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_points')}
                                <input type="text" name="it_points" id="it_points" defaultValue={this.state.selected_item.it_points} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_div_name')}
                                <select name="it_div_name" id="it_div_name" className="form-control">
                                    {this.state.division}
                                </select>
                            </label>
                            <label>
                                {this.t('it_image')}
                                <input type="text" name="it_image" id="it_image" defaultValue={this.state.selected_item.it_image} className="form-control" />
                            </label>

                            <label>
                                {this.t('it_profit')}
                                <input type="text" name="it_profit" id="it_profit" defaultValue={this.state.selected_item.it_profit} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_profrule')}
                                <input type="text" name="it_profrule" id="it_profrule" defaultValue={this.state.selected_item.it_profrule} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_altname')}
                                <input type="text" name="it_altname" id="it_altname" defaultValue={this.state.selected_item.it_altname} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_wa_name')}
                                <select name="it_wa_name" id="it_wa_name" className="form-control">
                                    {this.state.warehouse}
                                </select>
                            </label>

                            <label>
                                {this.t('it_specialcode')}
                                <input type="text" name="it_specialcode" id="it_specialcode" defaultValue={this.state.selected_item.it_specialcode} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_userstamp')}
                                <input type="text" name="it_userstamp" id="it_userstamp" defaultValue={this.state.selected_item.it_userstamp} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_timestamp')}
                                <input type="text" name="it_timestamp" id="it_timestamp" defaultValue={this.state.selected_item.it_timestamp} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_commission')}
                                <input type="text" name="it_commission" id="it_commission" defaultValue={this.state.selected_item.it_commission} className="form-control" />
                            </label>

                            <label>
                                {this.t('it_minprice')}
                                <input type="text" name="it_minprice" id="it_minprice" defaultValue={this.state.selected_item.it_minprice} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_remqty')}
                                <input type="text" name="it_remqty" id="it_remqty" defaultValue={this.state.selected_item.it_remqty} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_cost')}
                                <input type="text" name="it_cost" id="it_cost" defaultValue={this.state.selected_item.it_cost} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_lastsuppliername')}
                                <input type="text" name="it_lastsuppliername" id="it_lastsuppliername" defaultValue={this.state.selected_item.it_lastsuppliername} className="form-control" />
                            </label>

                            <label>
                                {this.t('it_lastsupplierprice')}
                                <input type="text" name="it_lastsupplierprice" id="it_lastsupplierprice" defaultValue={this.state.selected_item.it_lastsupplierprice} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_cashback')}
                                <input type="text" name="it_cashback" id="it_cashback" defaultValue={this.state.selected_item.it_cashback} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_order')}
                                <input type="text" name="it_order" id="it_order" defaultValue={this.state.selected_item.it_order} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_maxqty')}
                                <input type="text" name="it_maxqty" id="it_maxqty" defaultValue={this.state.selected_item.it_maxqty} className="form-control" />
                            </label>
                            <label>
                                {this.t('it_alertqty')}
                                <input type="text" name="it_alertqty" id="it_alertqty" defaultValue={this.state.selected_item.it_alertqty} className="form-control" />
                            </label>

                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <input type="submit" value="Submit" className="btn-success btn" />&nbsp;
                <Button onClick={this.closeModal.bind(this)} >Close</Button>
                    </Modal.Footer>
                </form>
            </Modal>

        )
    }
    closeModal() {
        this.setState({
            showModal: false,
        });
    }
    openModal(isEdit) {
        if (isEdit) {
            if (typeof this.state.selected_item.it_id !== 'undefined') {
                this.setState({
                    showModal: true,
                });
                setTimeout(() => {
                    document.getElementById('it_fa_name').value = this.state.selected_family.fa_name;
                    this.getWareHouse();
                    this.getBranch();
                    this.getDivision();
                    this.getPOSDisplay();
                    this.getBrand();
                    this.getCurr();
                    this.getFamilies();
                }, 500);

            } else {
                swal("warning", "Select item first", "warning");
            }
        } else {
            this.setState({
                showModal: true,
            });
            setTimeout(() => {
                document.getElementById('it_fa_name').value = this.state.selected_family.fa_name;
                this.getWareHouse();
                this.getBranch();
                this.getDivision();
                this.getPOSDisplay();
                this.getBrand();
                this.getCurr();
                this.getFamilies();
            }, 500);
        }


    }
    ///////////////////delete Item confirmation dialog
    OpenDeleteConfirmation() {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this item!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    this.delst_item(this.state.selected_item)
                }
            });
    }
    delst_item = (item) => {
        fetch(`${global.baseUrl}frmmanageitem/delst_item?it_id=${item.it_id}&itu_userstamp=${item.it_userstamp}&branchcode=${item.bra_name}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    this.getManageItemData(this.state.selected_family.fa_name);
                } else {
                    console.log(response.error)
                    swal("Error",response.error.originalError.info.message, "error");
                }
            })
    }
    render() {
        const config = { translation: this.t, detectFamilyClick: this.detectFamilyClick };
        return (<div className="container-fluid">
            <div className="row">
                <div className="col-lg-3">
                    <FrmFamily config={config}></FrmFamily>
                </div>
                <div className="col-lg-9">

                    <div className="d-flex gap-10 w-fit-content">
                        <FontAwesomeIcon className="icon deleteIcon" icon={faTrash} onClick={() => { this.OpenDeleteConfirmation() }}></FontAwesomeIcon>
                        <FontAwesomeIcon className="icon updateIcon" icon={faEdit} onClick={() => this.openModal(true)}></FontAwesomeIcon>
                        <FontAwesomeIcon className="icon" icon={faPlus} onClick={() => this.openModal()}></FontAwesomeIcon>
                    </div>
                    <div className="table-container">
                        <table className="table-item">
                            <thead>
                                <tr>
                                    {/* <td>{this.t('it_id')}</td>
                                    <td>{this.t('it_cmp_id')}</td> */}
                                    <td>{this.t('it_name')}</td>
                                    {/* <td>{this.t('it_fa_name')}</td> */}
                                    <td>{this.t('it_group')}</td>
                                    <td>{this.t('it_bra_name')}</td>
                                    <td>{this.t('it_br_name')}</td>
                                    <td>{this.t('it_unit')}</td>
                                    <td>{this.t('it_cur_code')}</td>
                                    <td>{this.t('it_unitprice')}</td>
                                    <td>{this.t('it_vat')}</td>
                                    <td>{this.t('it_barcode')}</td>
                                    <td>{this.t('it_alertqty')}</td>
                                    <td>{this.t('it_di_name')}</td>
                                    <td>{this.t('it_inactive')}</td>
                                    <td>{this.t('it_size')}</td>
                                    <td>{this.t('it_color')}</td>
                                    <td>{this.t('it_code')}</td>
                                    <td>{this.t('it_points')}</td>
                                    <td>{this.t('it_div_name')}</td>
                                    <td>{this.t('it_image')}</td>
                                    <td>{this.t('it_profit')}</td>
                                    <td>{this.t('it_profrule')}</td>
                                    <td>{this.t('it_altname')}</td>
                                    <td>{this.t('it_wa_name')}</td>
                                    <td>{this.t('it_specialcode')}</td>
                                    <td>{this.t('it_userstamp')}</td>
                                    <td>{this.t('it_timestamp')}</td>
                                    <td>{this.t('it_commission')}</td>
                                    <td>{this.t('it_minprice')}</td>
                                    <td>{this.t('it_remqty')}</td>
                                    <td>{this.t('it_cost')}</td>
                                    <td>{this.t('it_lastsuppliername')}</td>
                                    <td>{this.t('it_lastsupplierprice')}</td>
                                    <td>{this.t('it_cashback')}</td>
                                    <td>{this.t('it_maxqty')}</td>
                                    <td>{this.t('it_order')}</td>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.itemsData}
                            </tbody>
                        </table>

                    </div>
                </div>

            </div>
            {this.ItemFormModal()}
        </div>)
    }
}