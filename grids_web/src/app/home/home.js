import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { all_items } from '../Models/menu';
import { Link } from 'react-router-dom';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import './home.css';
export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = { selected_sub_items: [], tab: [], breadCrumb: [] };
    }
    componentDidMount() {
        if (this.props.config.selected_main_item === 0 || typeof this.props.config.selected_main_item === 'undefined') {
            this.fetchMainMenu();
        } else {
            this.fetchSubItem(this.props.config.selected_main_item.id, this.props.config.selected_main_item.name);
            //this.breadCrumb(this.props.config.selected_main_item);
        }
    }
    componentDidUpdate(prevprops) {
        if (this.props.config.selected_main_item !== prevprops.config.selected_main_item) {
            {
                this.fetchSubItem(this.props.config.selected_main_item.id, this.props.config.selected_main_item.name);
                // this.breadCrumb(this.props.config.selected_main_item);
            }
        }
    }

    fetchMainMenu = _ => {
        const res = []
        const t = this.props.config.translation;

        all_items.map((item, index) => {
            if (item.parent_id === null) {
                res.push(<div className="cell-container"
                    key={"ff-" + index}
                    style={{ 'backgroundImage': 'url("/assets/icons/' + item.icon + '")' }}
                    onClick={(e) => { this.props.config.MainItemClick(item); }}>

                    <div className="cell-title text-truncate">{t(item.name)} </div>
                </div>)
            }

        });
        this.setState({ tab: res });
    }

    fetchSubItem = (parentId, parentName) => {

        const t = this.props.config.translation;

        const res = [];
        all_items.map((item, index) => {
            if (item.parent_id === parentId) {
                if (item.haveChildren) {
                    res.push(<div className="cell-container"
                        style={{ 'backgroundImage': 'url("/assets/icons/' + item.icon + '")' }}
                        key={"ee-" + index}
                        onClick={(e) => { this.props.config.MainItemClick(item); }}>

                        <div className="cell-title text-truncate">{t(item.name)} </div></div>)
                } else {
                    res.push(<div className="cell-container"
                        style={{ 'backgroundImage': 'url("/assets/icons/' + item.icon + '")' }}
                        key={"gg-" + index}>
                        <Link to={item.path} target="_blank" >
                            <img className="cell-icon" src={"/assets/icons/" + item.icon} />
                        </Link><div className="cell-title text-truncate">{t(item.name)} </div></div>)
                }

            }
        });
        this.setState({ tab: res });
    }
    breadCrumb = (item) => {
        this.state.breadCrumb.push(<Breadcrumb.Item href="#">{item.name}</Breadcrumb.Item>);
    }
    back = () => {
        this.state.breadCrumb.pop();
        //  this.props.config.MainItemClick(item.id);
    }
    render() {
        return (<div>
            <div className="grid-container" id="grid-container">
                {this.state.tab}
            </div></div>)
    }

}