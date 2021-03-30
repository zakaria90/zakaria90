import { Component } from "react";
import { Link } from 'react-router-dom';
import './NotFound.css';
export class NotFound extends Component {
    render() {
        return (<div className="page-not-found-container">
            <h1>Page not found </h1>
            <Link to="/">Go to home page</Link>
        </div>)
    }
}