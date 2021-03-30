import react, { Component } from 'react';
import swal from 'sweetalert';
import * as global from '../Models/global_params';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faEdit, faAngleRight, faPlus, faAngleDoubleDown, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';
export class FrmFamily extends Component {

    constructor(props) {
        super(props);
        this.state = { isExpanded: false, showModal: false, treeData: [] };
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentDidMount() {
        this.getFamilyData();
    }
    getFamilyData() {
        fetch(`${global.baseUrl}/frmFamily/sel_family?fa_cmp_id=${global.cmp_id}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {

                    this.fetchingFamilies(response.recordset);
                } else {
                    swal('Error', response.error);
                }
            })
    }
    selectFamily(family) {
        this.props.config.detectFamilyClick(family);
    }
    ////////////////////////////Recrusion function////////////////////////////
    fetchingFamiliesRecrusion(data, family_parent) {
        const res = [];
        data.map(fmly => {

            if (fmly.fa_parent === family_parent) {
                const haveChildren = data.find(x => x.fa_parent === fmly.fa_name);
                if (typeof haveChildren === 'undefined') {
                    res.push(<li key={fmly.fa_name} >
                        <div className="nodeTitle" onClick={() => this.selectFamily(fmly)}>
                            <span className="icon"><FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>  {fmly.fa_newname}</span>
                            <div className="d-flex gap-10">
                                <FontAwesomeIcon className="icon deleteIcon" icon={faTrash} onClick={() => { this.OpenDeleteConfirmation(fmly.fa_name) }}></FontAwesomeIcon>
                                <FontAwesomeIcon className="icon updateIcon" icon={faEdit} onClick={() => this.OpenEditFamilyModal(fmly)}></FontAwesomeIcon>
                                <FontAwesomeIcon className="icon" icon={faPlus} onClick={() => this.openAddFamilyModal(fmly.fa_name)}></FontAwesomeIcon>
                            </div>
                        </div>
                    </li>)
                } else {

                    res.push(<li key={fmly.fa_name}>
                        <div className="nodeTitle parentNode"
                            data-target={"#" + fmly.fa_name}
                            onClick={(e) => { this.collapseExpandNode(e, fmly) }}>
                            <span className="icon"><FontAwesomeIcon className="rightAngle" icon={faAngleRight}></FontAwesomeIcon>  {fmly.fa_newname}</span>
                            <div className="d-flex gap-10">
                                <FontAwesomeIcon className="icon deleteIcon" icon={faTrash} onClick={() => { this.OpenDeleteConfirmation(fmly.fa_name) }}></FontAwesomeIcon>
                                <FontAwesomeIcon className="icon updateIcon" icon={faEdit} onClick={() => this.OpenEditFamilyModal(fmly)}></FontAwesomeIcon>
                                <FontAwesomeIcon className="icon" icon={faPlus} onClick={() => this.openAddFamilyModal(fmly.fa_name)}></FontAwesomeIcon>

                            </div>
                        </div>
                        <ul className="nested" id={fmly.fa_name}>{this.fetchingFamiliesRecrusion(data, fmly.fa_name)}</ul>
                    </li>)
                }
            }
        });
        return res;
    }
    //////////////////////calling recrusion function and store result in array to fetch it in dom/////////
    fetchingFamilies = (data) => {

        this.setState({ treeData: this.fetchingFamiliesRecrusion(data, null), loading: false });
    }
    handleSubmit = (event) => {
        event.preventDefault();
        if (document.getElementById('fa_newname').value.toLowerCase() !== 'all') {
            var formdata = new FormData(event.target)
            this.queryParams = new URLSearchParams(formdata).toString();
            if (document.getElementById('fa_name').value === '') {
                this.addst_family(event, this.queryParams)
            } else {
                this.updst_family(event, this.queryParams);
            }
        } else {
            swal('this name is unavailable')
        }
    }
    addst_family = (event, params) => {
        fetch(`${global.baseUrl}frmfamily/addst_family?${params}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    this.getFamilyData();
                    event.target.reset();
                    this.closeModal();
                } else {
                    swal('error', response.error);
                }
            })
    }
    /////////////////add-update modal form//////////////////////////////////////////
    FamilyFormModal() {
        return (
            <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title id="modal-title">Create/Update Family</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <div className="d-flex">
                            <label className="d-none">
                                <input type='text' name="fa_name" id="fa_name" className="form-control" />
                            </label>
                            <label className="d-none">
                                <input type="text" name="fa_parent" id="fa_parent" className="form-control" />
                            </label>
                            <label>
                                <input type="text" name="fa_newname" id="fa_newname" className="form-control" />
                            </label>
                            <label className="d-none">
                                <input type="text" name="fa_group" id="fa_group" className="form-control" />
                            </label>
                            <label className="d-none">
                                <input type="text" name="fa_numberofyears" id="fa_numberofyears" className="form-control" />
                            </label>
                            <label className="d-none">
                                <input type="text" name="fa_codelen" id="fa_codelen" className="form-control" />
                            </label>
                            <label className="d-none">
                                <input type="text" name="fa_purchacc" id="fa_purchacc" className="form-control" />
                            </label>
                            <label className="d-none">
                                <input type="text" name="fa_depacc" id="fa_depacc" className="form-control" />
                            </label>
                            <label className="d-none">
                                <input type="text" name="fa_depchargeacc" id="fa_depchargeacc" className="form-control" />
                            </label>
                            <label className="d-none">
                                <input type="text" name="fa_salesacc" id="fa_salesacc" className="form-control" />
                            </label>
                            <label className="d-none">
                                <input type="text" name="fa_costoffasoldacc" id="fa_costoffasoldacc" className="form-control" />
                            </label>
                            <label className="d-none">
                                <input type="text" name="fa_periodicityofprovision" id="fa_periodicityofprovision" className="form-control" />
                            </label>
                            <label className="d-none">
                                <input type="text" name="fa_cmp_id" id="fa_cmp_id" defaultValue={global.cmp_id} className="form-control" />
                            </label>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <input type="submit" value="Submit" className="btn-success btn" />&nbsp;
                    <Button onClick={this.closeModal.bind(this)} >Close</Button>
                    </Modal.Footer>
                </form>
            </Modal>
            );
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
    collapseExpandNode(e, family) {
        e.stopPropagation();
        e.preventDefault();
        console.log(e);
        try {
            this.selectFamily(family);
            document.getElementById(family.fa_name).classList.toggle("expanded");
            e.target.querySelector('.rightAngle').classList.toggle("rotate");

        }
        catch (e) { }



    }
    expandAllNode(e) {
        const nestedElt = document.getElementsByClassName('nested')
        for (let i = 0; i < nestedElt.length; i++) {
            nestedElt.item(i).classList.add('expanded')
        }
    }
    collapseAllNode() {
        const nestedElt = document.getElementsByClassName('nested')
        for (let i = 0; i < nestedElt.length; i++) {
            nestedElt.item(i).classList.remove('expanded')
        }
    }
    toggleExpandCollapse() {

        if (this.state.isExpanded) {
            this.collapseAllNode();
        } else {
            this.expandAllNode();
        }
        this.setState({ isExpanded: !this.state.isExpanded })
    }
    ///////////edit  project////////////////
    OpenEditFamilyModal(family) {
        this.openModal();
        setTimeout(() => {
            document.getElementById('fa_newname').value = family.fa_newname;
            document.getElementById('fa_parent').value = family.fa_parent;
            document.getElementById('fa_name').value = family.fa_name;
        }, 500);
    }
    ///////////////////update project job//////////////////////////
    updst_family = (event, obj) => {
        fetch(`${global.baseUrl}frmfamily/updst_family?${obj}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    if (!response.message) {
                        this.getFamilyData();
                        event.target.reset();
                        this.closeModal();
                    } else {
                        swal(response.message);
                    }

                }
                else {
                    console.log(response.error);
                }

            })
            .catch(error => console.log(error));
    }
    /////////////////add child project to selected project////////////////
    openAddFamilyModal(fa_parent) {
        this.openModal();
        setTimeout(() => {
            document.getElementById('fa_parent').value = fa_parent;
        }, 500);
    }
    ///////////////////delete family confirmation dialog
    OpenDeleteConfirmation(fa_name) {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this Family!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    this.delst_family(fa_name)
                }
            });
    }

    delst_family = fa_name => {
        fetch(`${global.baseUrl}frmfamily/delst_family?fa_name='${fa_name}'`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    this.getFamilyData();
                } else {
                    swal("Error", this.response);
                }
            })
    }
    render() {
        const icon = this.state.isExpanded ? faAngleDoubleDown : faAngleDoubleLeft;

        return (
            <div>
                <ul id="treeUrl">
                    <li>
                        <div className="nodeTitle">
                            <span onClick={() => this.openModal()}>All</span>
                            <FontAwesomeIcon className="icon" icon={icon} onClick={() => { this.toggleExpandCollapse() }}></FontAwesomeIcon>

                        </div>
                    </li>
                    {this.state.treeData}
                </ul>
                {this.FamilyFormModal()}
            </div>
        );
    }

}