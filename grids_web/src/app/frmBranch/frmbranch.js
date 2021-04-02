import { React, Component } from 'react';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import "react-table-6/react-table.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Frmbranch.css';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { Modal, Button } from 'react-bootstrap'
import * as global from '../Models/global_params';
import swal from 'sweetalert';
export class FrmBranch extends Component {
    queryParams = '';
    bra_default_var;
    global = { isFetching: true };
    IsUpdate = false;
    constructor(props) {
        super(props);
        console.log(props.language)
        this.state = {
            branch: []

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
    }

    componentDidMount() {
        this.getBranch();
    }

    componentWillUnmount() {
    }

    ///////////delete method that call the delete method from backend//////
    deleteBranch = (id) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to delete this branch.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        fetch(`${global.baseUrl}frmbranch/del_branch?bra_name=${id}`)
                            .then(response => response)
                            .then(response => {
                                if (!response.error)
                                    this.getBranch()
                                else {
                                    alert(response.error.originalError.message);
                                }
                            })
                            .catch(err => console.log(err));
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    ///////////update method that call the update method from backend//////
    updateBranch = _ => {
        fetch(`${global.baseUrl}frmbranch/upd_branch?${this.queryParams}`)
            .then(response => response)
            .then(response => {
                if (!response.error)
                    this.getBranch()
                else {
                    alert(response.error.originalError.message);
                }
            })
            .catch(err => console.log(err))
    }

    ///////////get method that call the select method from backend//////  
    getBranch = _ => {
        
        fetch(`${global.baseUrl}frmbranch/sel_branch?bra_cmp_id=${global.cmp_id}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    console.log(response);
                    this.setState({ branch: response });

                }
                else {
                    swal("error", response.error.originalError.message, "error");
                }
                this.global.isFetching = false;

            })
            .catch(err => console.log(err));
    }

    ///////////submit method that check if update or add branch and call which is correspond///////
    handleSubmit(event) {
        event.preventDefault();
        var formdata = new FormData(event.target)
        this.queryParams = new URLSearchParams(formdata).toString();
        if (this.IsUpdate) {
            this.updateBranch();
            this.closeModal();
        }
        else {
            this.addProduct();
            this.closeModal();
            this.IsUpdate = false;
        }
    }
    ///////////show the main table data///////
    renderEditable = data => {
        let result = [];
        data.map((row, index) => {
            var checkbox_id = "bra_default" + index;

            if (row.bra_default == '0') {
                console.log(1111);
                this.bra_default_var = false;
            }
            else {
                console.log(22222);

                this.bra_default_var = true;

            }
            result.push(<tr key={index}>
                {/* <td>{row.wa_name}</td> */}
                {/* <td>{row.wa_cmp_id}</td> */}
                <td>{row.bra_newname}</td>
                <td>{row.bra_address}</td>
                <td>{row.bra_contact}</td>
                <td>{row.bra_phone}</td>
                <td> <input
                    type="checkbox"
                    id="checkbox_id"
                    name="bra_default"
                    value={"clicked"}
                    defaultChecked={this.bra_default_var ? "checked=checked" : ""}
                    onChange={this.handleCheck}
                />
                </td>
                <td><div className='actions'>
                    <FontAwesomeIcon icon={faTrash} onClick={() => this.deleteBranch(row.bra_name)}></FontAwesomeIcon>
                    <FontAwesomeIcon icon={faPencilAlt} onClick={() => this.editBranch(row)}></FontAwesomeIcon>
                </div>
                </td>

            </tr>
            );
        });
        return (result);

    };
    /////////////popup after click on edit button/////////
    editBranch = row => {
        try {
            var bra_default_popup;
            this.openModal();
            setTimeout(_ => {

                document.getElementById("bra_newname").value = row.bra_newname;
                document.getElementById("bra_address").value = row.bra_address;
                document.getElementById("bra_contact").value = row.bra_contact;
                document.getElementById("bra_phone").value = row.bra_phone;
                if (row.bra_default == "0") {
                    document.getElementById("bra_default_popup").checked = false;
                    document.getElementById("bra_default_popup").value = 0;
                }
                else {
                    document.getElementById("bra_default_popup").checked = true;
                    document.getElementById("bra_default_popup").value = 1;

                }
                /*
                if( row.bra_default == "0" ){
                    document.getElementById("checkbox_id").checked = false; 
                    document.getElementById("checkbox_id").value = 0; 
                    }
                   else{
                    document.getElementById("checkbox_id").checked = true; 
                    document.getElementById("checkbox_id").value = 1; 
      
                  }
                  */
                //  document.getElementById("bra_default2").checked = false; 
                document.getElementById("bra_name").value = row.bra_name;
                document.getElementById("bra_cmp_id").value = row.bra_cmp_id;

                this.IsUpdate = true;
            }, 200);

        } catch (exception) {
            console.log(exception)
        }

    }
    /////////////////add branch that call the add branch from bacjend//////////////
    addProduct = _ => {
        const { branch } = this.state.branch;
        fetch(global.baseUrl + `frmbranch/add_branch?${this.queryParams}`)
            .then(response => {
                if (response.status === 200) {
                    this.getBranch();
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
    /////on change method for checkbox///////////////
    handleCheck(event) {
        this.setState({ checkbox_id: !document.getElementById("checkbox_id").checked });
        this.setState({ bra_default_popup: !document.getElementById("bra_default_popup").checked });
    }

    render() {
        const branch = this.state.branch;
        const name = "name"//this.props.config.language.length > 0 ? this.props.config.language.find(x => x.fl_paramname==='bra_name').fl_english : 'name';
        const address = "address" //this.props.config.language.length > 0 ? this.props.config.language.find(x => x.fl_paramname==='bra_address') ||'address' : 'address';

        return (
            <div className='container-fluid'>
                <button onClick={this.openModal.bind(this)} className="btn btn-xs btn-info create-new-branch">Create new branch</button>
                <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title id="modal-title">Create/Update branch</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="modal-body">
                            <label className='d-none'>
                                Id
              <input type="text" value={this.state.branch.bra_name} name="bra_name" id="bra_name" className="form-control" />
                            </label>
                            <label className='check'>
                                default:
                                    <input
                                    type="checkbox"
                                    id="bra_default_popup"
                                    name="bra_default"
                                    value={"clicked"}
                                    defaultChecked={this.state.branch.bra_default}
                                    onChange={this.handleCheck}
                                    text-align="right"
                                />

                            </label>
                            <label >
                                {name}
                                <input type="text" value={this.state.branch.bra_newname} name="bra_newname" id="bra_newname" className="form-control" />
                            </label>
                            <label className='d-none'>
                                company id:
              <input type="text" value={this.state.branch.bra_cmp_id} name="bra_cmp_id" id="bra_cmp_id" className="form-control" />
                            </label>
                            <label>
                                contact:
                <input type="text" value={this.state.branch.bra_contact} name="bra_contact" id="bra_contact" className="form-control" />
                            </label>
                            <label>
                                phone:
                <input type="text" value={this.state.branch.bra_phone} name="bra_phone" id="bra_phone" className="form-control" />
                            </label>
                            <label>
                                {address}
                                <input type="text" value={this.state.branch.bra_address} name="bra_address" id="bra_address" className="form-control" />
                            </label>
                        </Modal.Body>
                        <Modal.Footer>
                            <input type="submit" value="Submit" className="btn-success btn" />&nbsp;
                            <Button onClick={this.closeModal.bind(this)} >Close</Button>
                        </Modal.Footer>
                    </form>
                </Modal>


                <table className="table table-bordered table-striped table-hover">
                    <caption>List of branch</caption>
                    <thead>
                        <tr>
                            {/* <th>ID</th> */}
                            {/* <th>Company id</th> */}
                            <th>{name}</th>
                            <th>{address}</th>
                            <th>contact</th>
                            <th>phone</th>
                            <th>default</th>

                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderEditable(branch)}

                    </tbody>
                </table>

            </div>);
    }
}