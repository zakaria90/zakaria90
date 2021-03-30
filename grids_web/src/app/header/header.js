import React, { Component } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleLeft, faArrowLeft, faTh } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { all_items } from '../Models/menu';
import './header.css';
import { user, getUserSettings } from '../Models/user';
import { FrmProjectJob } from '../FrmProjectJob/FrmPorjectJob';
import * as global from '../Models/global_params';
import { Modal, Button } from 'react-bootstrap'

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: '',
      childrenMenuItem: [],
      menuHeaderBreadCrumb: [],
      tree: [],
      _openProjectJobModal: false,
      showModal: false,
      timer: 750
    }
  }
  componentDidMount() {
    this.fetchLeftMenuItem();
    this.detectMousePosition();
    this.closeLeftMenuWhenClickOutside();
    getUserSettings(global.cmp_id);
  }
  ////////////////////////detect when mouse click and if it's outside the leftmenu close it if open///////////////
  closeLeftMenuWhenClickOutside = _ => {
    document.addEventListener('click', (e) => {
      const parentsArray = e.path;
      const isParent = parentsArray.find(x => (x.id === 'sidebar' || x.id === 'navbarbrand'));
      if (!isParent) {
        this.closeNav();
      }
    })
  }
  ///////////////detect mouse position and if it's on left open leftMenu
  detectMousePosition = _ => {
    document.onmousemove = (event) => {
      clearTimeout(this.state.timer);
      if (!document.getElementById('sidebar').classList.contains('show')) {
        if (event.clientX === 0) {
          this.state.timer = setTimeout(() => {
            this.openNav();
          }, 1000);
        } else {
          this.closeNav();
        }
      }
    }
  }
  closeNav = _ => {
    document.getElementById("main").style.marginLeft = "auto"
    document.getElementById("sidebar").classList.remove('show');
    document.getElementById("header").style.left = "0"

  }
  openNav = _ => {
    //if opened on windows os open left menu 
    if (navigator.platform === 'Win32') {
      document.getElementById("sidebar").classList.add('show');
      document.getElementById("main").style.marginLeft = "25%";
      document.getElementById("header").style.left = "25%"
    }

  }
  /////////////////////**reverse navbar state opened/closed/**//////////////////
  toggleNav = _ => {
    if (document.getElementById('sidebar').classList.contains('show')) {
      this.closeNav();
    } else {
      this.openNav();
    }
  }

  //////////////////////////**fetching main item in top header**///////////////////////////////////////
  fetchMainMenu = _ => {
    const res = [];
    const t = this.props.config.translation;
    res.push(<a href='/home' className="nav-link" key="home" >Home</a>)
    all_items.map((item, index) => {
      if (item.parent_id === null)
        res.push(<Link to=""
          className="nav-link"
          data-id={item.id}
          key={"aa-" + index}
          onClick={(e) => this.props.config.MainItemClick(item)}>{t(item.name)}</Link>)
    });
    return res;
  }

  fetchLeftMenuItem = _ => {
    const res = [];
    res.push(this.fetchLeftMenuItemsٌRecursion(null));
    return res;
  }
  // //////////////////////***fetching items in leftMenu ,
  // first call will pass null params to bring only the main items ,
  //  this function is recalled inside itself to get sub and sub item....***//////////////////////////////
  fetchLeftMenuItemsٌRecursion = (parentId) => {
    const res = [];
    all_items.map((item, index) => {
      if (item.parent_id === parentId) {
        if (item.haveChildren) {
          res.push(<div key={"bb-" + index}>
            <a href={"#" + item.id} className="list-group-item"
              data-toggle="collapse"
              aria-expanded="false"
              data-id={item.id}>
              <img className="item-icon" src={"assets/icons/" + item.icon} />
              {this.props.config.translation(item.name)}
              <FontAwesomeIcon icon={faAngleDown} className="FontAwesomeIcon"></FontAwesomeIcon></a>
            <div id={item.id} className="collapse">{this.fetchLeftMenuItemsٌRecursion(item.id)}</div></div>)

        } else {
          if (item.name === 'up_prj_name') {
            res.push(<div
              className="list-group-item"
              target="_blank"
              data-id={item.id}
              onClick={_ => this.openModal()}
              key={"cc-" + index}  >
              <img className="item-icon" src={"assets/icons/" + item.icon} />
              {this.props.config.translation(item.name)}</div>)

          } else {
            res.push(<div key={"dd-" + index}>
              <Link to={item.path}
                className="list-group-item"
                target="_blank"
                onClick={() => this.closeNav()}
                data-id={item.id}>
                <img className="item-icon" src={"/assets/icons/" + item.icon} />
                {this.props.config.translation(item.name)}</Link></div>)

          }
        }

      }
    });
    return res;
  }
  sendClickEvent = (e) => {
    global.sendClickEvent(e);
  }
  /////////////////Project popup////////////////////
  ProjectJobModal() {
    const config = { translation: this.props.config.translation }
    return (
      <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>
        <Modal.Header>{this.props.config.translation('up_prj_name')}</Modal.Header>
        <Modal.Body className="modal-body">
          <FrmProjectJob config={config}></FrmProjectJob>
        </Modal.Body>
      </Modal>)
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
  render() {
    const t = this.props.config.translation;

    return (
      <div>
        <Navbar bg="light" expand="lg" id="header">
          <Navbar.Brand onClick={() => this.toggleNav()} id="navbarbrand"><FontAwesomeIcon className="brand FontAwesomeIcon" icon={faTh} /> Grids</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {this.fetchMainMenu()}

              <select onChange={(e) => { this.props.config.changeLanguage(e) }}>
                <option value="en">English</option>
                <option value="es">spanish</option>
                <option value="pt">portuguese</option>
                <option value="ar">Arabic</option>
                <option value='fr'>french</option>
              </select>
            </Nav>
          </Navbar.Collapse>
          <div className={"col-md-3 float-left col-1 pl-0 pr-0 collapse"} id="sidebar">
            <div className="list-group border-0 card text-center text-md-left p-relative">
              <div className="sidebarHeader">
                <div> <FontAwesomeIcon className="brand" icon={faTh} onClick={() => this.toggleNav()} /> Grids</div>
                <div onClick={() => this.toggleNav()} className="close-sideMenu-button"><i className="fas fa-times fa-2x py-2 p-1"></i></div>
              </div>
              {this.fetchLeftMenuItem()}
            </div>
          </div>
        </Navbar>
        {this.ProjectJobModal()}
      </div>
    );
  }
};
export default Header;