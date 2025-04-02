import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import "../assets/vendor/fontawesome/css/font-awesome.css";
import "../assets/vendor/animate.css/animate.css";
import "../assets/vendor/bootstrap/css/bootstrap.css";
import "../assets/fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css";
import "../assets/fonts/pe-icon-7-stroke/css/helper.css";
import "../assets/vendor/datatables.net-bs/css/dataTables.bootstrap.min.css";
import "../assets/styles/style.css";
import logo from '../assets/rc.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faChartBar, faSignOutAlt, faUsers, faUser, faPowerOff} from '@fortawesome/free-solid-svg-icons';


const Header = (props) => {
    const navigate = useNavigate();
    //console.log(parentToChild);
    //console.log(props.loggedInUserdata.id);
    const logout = async () => {
        await localStorage.removeItem("chat-token-info");
        await localStorage.removeItem("loggedInUserName");
        await localStorage.removeItem("encryptdatatoken");
        //navigate('/login')
        window.location.href = "/login";
    };
    //console.log(props);

    if (props.loggedInUserdata.userType == 'EMPLOYEE') {
        //navigate('/chatconsole/spaces')
        window.location.href = "/chatconsole/spaces";
    }

    if (props.loggedInUserdata.status == 'Inactive') {
        logout()
    }

    return (
        <div>
            <div id="header">
                {/* <div className="color-line">
                </div> */}
                <div id="logo" className="light-version">
                    <Link to="/">
                        {/* <h3>
                    Chat APP <i className='fa fa-comments'></i>
                </h3> */}
                        <div className='logoimg'>
                            <img src={logo} alt="Logo" /> </div>
                    </Link>

                </div>
                <div className='justify-content-end py-3 px-5 d-flex navtop'>
                    <ul class="d-flex">
                        <li><FontAwesomeIcon icon={faUser} size="1x" /> Welcome {props.loggedInUserdata.name}</li>
                        <li><FontAwesomeIcon icon={faPowerOff} size="1x" /> <a onClick={logout}>Logout</a></li>
                    </ul></div>
            </div>


            <aside id="menu">
                <div id="navigation" className='mt-3 sidebar'>
                    <ul className="nav" id="side-menu">
                        {props.loggedInUserdata.userType != 'EMPLOYEE' ? (
                            <li class="w-100">
                                <ul className="nav nav-second-level">
                                    <li class="w-100"><Link to="/chatconsole/spaces" target="_blank"><FontAwesomeIcon icon={faComment} size="1x" /> Chat Console</Link></li>
                                </ul>
                            </li>
                        ) : null
                        }
                        <li class="w-100">
                            <ul className="nav nav-second-level">
                                <li class="w-100"><Link to="/"><i class="fa fa-table-columns"></i><FontAwesomeIcon icon={faChartBar} size="1x" /> Dashboard</Link></li>
                            </ul>
                        </li>
                        <li class="w-100">
                            <ul className="nav nav-second-level">
                                <li class="w-100"><Link to="/manageuser"><FontAwesomeIcon icon={faUsers} size="1x" /> Manage User</Link></li>
                            </ul>
                        </li>
                        <li class="w-100">
                            <ul className="nav nav-second-level">
                                <li class="w-100"><a onClick={logout}><FontAwesomeIcon icon={faSignOutAlt} size="1x" /> Logout</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    )
}

export default Header