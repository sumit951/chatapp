import React from 'react'
import {Link, useNavigate } from 'react-router-dom';

import "@../assets/vendor/fontawesome/css/font-awesome.css";
import "@../assets/vendor/animate.css/animate.css";
import "@../assets/vendor/bootstrap/dist/css/bootstrap.css";
import "@../assets/fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css";
import "@../assets/fonts/pe-icon-7-stroke/css/helper.css";
import "@../assets/vendor/datatables.net-bs/css/dataTables.bootstrap.min.css";
import "@../assets/styles/style.css";

const Header = (props) => {
    const navigate = useNavigate();
    //console.log(userdataname);
    
    const logout = async () => {
        await localStorage.removeItem("chat-token-info");
        //navigate('/login')
        window.location.href = "/login";
    };
  return (
    <div>
        <div id="header">
            <div className="color-line">
            </div>
            <div id="logo" className="light-version">
            <Link to="/"> 
                <h3>
                    Chat APP <i className='fa fa-comments'></i>
                </h3>
            </Link>
            
            </div>
            <div className='float-end m-4'>Welcome {props.name}, <a onClick={logout}>Logout</a></div>
        </div>
        

        <aside id="menu">
            <div id="navigation">
                <ul className="nav" id="side-menu">
                    <li class="w-100">
                        <ul className="nav nav-second-level">
                            <li><Link to="/"> Dashboard</Link></li>
                        </ul>
                    </li>
                    <li class="w-100">
                        <ul className="nav nav-second-level">
                            <li><Link to="/manageuser"> Manage User</Link></li>
                        </ul>
                    </li>
                    <li class="w-100">
                        <ul className="nav nav-second-level">
                            <li><a onClick={logout}>Logout</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </aside>
    </div>
  )
}

export default Header