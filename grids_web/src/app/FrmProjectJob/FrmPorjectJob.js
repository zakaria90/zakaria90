import {
    faAngleDoubleDown, faAngleDoubleLeft,
    faAngleRight, faEdit, faMinus, faPlus, faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import react, { Component, useState } from "react";
import { Modal, Button } from 'react-bootstrap'
import * as global from '../Models/global_params';
import './FrmProjectJob.css';
import swal from 'sweetalert';

export class FrmProjectJob extends Component {
    t;
    node = []
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = { showModal: false, treeData: [], loading: true, isExpanded: false };
        this.t = this.props.config.translation;

    }

    componentDidMount() {
        this.getProjectJobFromDB();

    }
    componentDidUpdate(prevprops) {
        if (this.props.config.showModal !== prevprops.showModal)
            this.openModal();

    }
    ////////////////retrieve project-job from database////////////////
    getProjectJobFromDB = _ => {
        fetch(`${global.baseUrl}/frmprojectjob/sel_projectjob?prj_cmp_id=${global.cmp_id}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    this.fetchingProjectJob(response);
                }
                else {
                    console.log(response.error);
                }
            })
            .catch(error => console.log(error));
    }
    //////////////////add new  project-job////////////////////////////////
    addpr_projectjob = (event, obj) => {
        fetch(`${global.baseUrl}/frmprojectjob/addpr_projectjob?${obj}`)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (!response.error) {
                    if (!response.message) {
                        this.getProjectJobFromDB();
                        event.target.reset();
                        this.closeModal();
                    } else {
                        swal({
                            title: "Error",
                            text: response.message,
                            icon: "error",
                            buttons: true,
                            dangerMode: true
                        });
                    }

                }
                else {
                    console.log(response.error);
                }

            })
            .catch(err => console.log(err));

    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (document.getElementById('prj_newname').value.toLowerCase() !== 'all') {
            var formdata = new FormData(event.target)
            this.queryParams = new URLSearchParams(formdata).toString();
            if (document.getElementById('prj_name').value === '') {
                this.addpr_projectjob(event, this.queryParams)
            } else {
                this.updpr_projectjob(event, this.queryParams);
            }
        } else {
            alert('this name is unavailable')
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
    /////////////////add-update modal form//////////////////////////////////////////
    ProjectJobFormModal() {
        return (
            <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title id="modal-title">Create/Update Currency</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <div className="d-flex">
                            <label>
                                {this.t('up_prj_name')}
                                <input type="text" name="prj_newname" id="prj_newname" className="form-control" />
                            </label>
                            <label className="d-none">
                                <input type="text" name="prj_parent" id="prj_parent" className="form-control" />
                            </label>
                            <label className="d-none">
                                <input type="text" name="prj_cmp_id" id="prj_cmp_id" defaultValue={global.cmp_id} className="form-control" />
                            </label>
                            <label className="d-none">
                                <input type="text" name="prj_name" id="prj_name" className="form-control" />
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
    ////////////////////delete confirmation//////////////////
    OpenDeleteConfirmation = (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this Project-Job!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    this.delpr_projectjob(id)
                }
            });
    }
    ///////////////////update project job//////////////////////////
    delpr_projectjob = (prj_name) => {
        fetch(`${global.baseUrl}/frmprojectjob/delpr_projectjob?prj_name=${prj_name}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    if (!response.message) {
                        this.getProjectJobFromDB();
                        this.closeModal();
                    } else {
                        alert(response.message);
                    }

                }
                else {
                    console.log(response.error);
                }
            })
            .catch(error => console.log(error));
    }
    handleClickEvent = (e) => {
        console.log(['handleClickEvent', e]);
    }
    ////////////////////////////Recrusion function////////////////////////////
    fetchingProjectJobRecrusion(data, prj_parent) {
        const res = [];
        data.map(prj => {

            if (prj.prj_parent === prj_parent) {
                const haveChildren = data.find(x => x.prj_parent === prj.prj_name);
                if (typeof haveChildren === 'undefined') {
                    res.push(<li key={prj.prj_name} >
                        <div className="nodeTitle">
                            <span className="icon"><FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>  {prj.prj_newname}</span>
                            <div className="d-flex gap-10">
                                <FontAwesomeIcon className="icon deleteIcon" icon={faTrash} onClick={() => { this.OpenDeleteConfirmation(prj.prj_name) }}></FontAwesomeIcon>
                                <FontAwesomeIcon className="icon updateIcon" icon={faEdit} onClick={() => this.OpenEditProjectModal(prj)}></FontAwesomeIcon>
                                <FontAwesomeIcon className="icon" icon={faPlus} onClick={() => this.openAddProjectModal(prj.prj_name)}></FontAwesomeIcon>
                            </div>
                        </div>
                    </li>)
                } else {

                    res.push(<li key={prj.prj_name}>
                        <div className="nodeTitle parentNode" onClick={(e) => { this.collapseExpandNode(e) }}>
                            <span className="icon"><FontAwesomeIcon className="rightAngle" icon={faAngleRight}></FontAwesomeIcon>  {prj.prj_newname}</span>
                            <div className="d-flex gap-10">
                                <FontAwesomeIcon className="icon deleteIcon" icon={faTrash} onClick={() => { this.OpenDeleteConfirmation(prj.prj_name) }}></FontAwesomeIcon>
                                <FontAwesomeIcon className="icon updateIcon" icon={faEdit} onClick={() => this.OpenEditProjectModal(prj)}></FontAwesomeIcon>
                                <FontAwesomeIcon className="icon" icon={faPlus} onClick={() => this.openAddProjectModal(prj.prj_name)}></FontAwesomeIcon>
                            </div>
                        </div>
                        <ul className="nested">{this.fetchingProjectJobRecrusion(data, prj.prj_name)}</ul>
                    </li>)
                }
            }
        });
        return res;
    }
    //////////////////////calling recrusion function and store result in array to fetch it in dom/////////
    fetchingProjectJob = (data) => {

        this.setState({ treeData: this.fetchingProjectJobRecrusion(data, null), loading: false });
    }
    collapseExpandNode(e) {
        e.stopPropagation();
        e.preventDefault();
        console.log(e);
        try {
            e.target.parentElement.querySelector(".nested").classList.toggle("expanded");
            e.target.querySelector('.rightAngle').classList.toggle("rotate");

        } catch (e) {

        }


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
    OpenEditProjectModal(prj) {
        this.openModal();
        setTimeout(() => {
            document.getElementById('prj_newname').value = prj.prj_newname;
            document.getElementById('prj_parent').value = prj.prj_parent;
            document.getElementById('prj_name').value = prj.prj_name;
        }, 500);
    }
    ///////////////////update project job//////////////////////////
    updpr_projectjob = (event, obj) => {
        fetch(`${global.baseUrl}/frmprojectjob/updpr_projectjob?${obj}`)
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    if (!response.message) {
                        this.getProjectJobFromDB();
                        event.target.reset();
                        this.closeModal();
                    } else {
                        alert(response.message);
                    }

                }
                else {
                    console.log(response.error);
                }

            })
            .catch(error => console.log(error));
    }
    /////////////////add child project to selected project////////////////
    openAddProjectModal(prj_parent) {
        this.openModal();
        setTimeout(() => {
            document.getElementById('prj_parent').value = prj_parent;
        }, 500);
    }

    render() {
        const node = this.state.treeData;
        const icon = this.state.isExpanded ? faAngleDoubleDown : faAngleDoubleLeft;
        return (<div>

            {this.ProjectJobFormModal()}
            <ul id="treeUrl">
                <li>
                    <div className="nodeTitle">
                        <span onClick={() => this.openModal()}>All</span>
                        <FontAwesomeIcon className="icon" icon={icon} onClick={() => { this.toggleExpandCollapse() }}></FontAwesomeIcon>

                    </div>
                </li>
                {this.state.treeData}</ul>

        </div>);

    }
}