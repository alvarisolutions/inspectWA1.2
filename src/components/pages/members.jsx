// Members.js

import React, { Component } from 'react';
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import { Route, Link } from 'react-router-dom';
import { database } from '../../Firebase'; // Updated import
import { ref, onValue, set, get } from 'firebase/database'; // Import necessary functions

import NavBar from '../core/navBar';
import NavBarMobile from '../core/navBarMobile';

import FooterBar from '../core/footerBar';
import FooterBarMobile from '../core/footerBarMobile';

import Loading from '../../components/loading.js';

import './members.css';

// Importing documents
import paper1 from '../../assets/files/private/Position Paper 1 2019 Delignification of Roof Tile Battens Approved.pdf';
import paper2 from '../../assets/files/private/Position Paper 2 2019 Elevated Moisture Levels in Masonay Walls Approve.._.pdf';
import paper3 from '../../assets/files/private/Position Paper 3 2019 Pre Purchase Builing Insepction Report.._.pdf';
import paper6 from '../../assets/files/private/Position Paper 6 2019 Sagging ceilings.pdf';
import paper7 from '../../assets/files/private/Position Paper 7 Party and Firewalls Final.pdf';
import paper8 from '../../assets/files/private/Position Paper 8 DownLighting & Insulation.pdf';
import paper9 from '../../assets/files/private/Position Paper 9 Texture Rendered Finishes as an Alternative to Weep holes.pdf';
import paper11 from '../../assets/files/private/11 Pre Purchase Inspection Report.pdf';
import paper12 from '../../assets/files/private/12 Structural Defects Notices.pdf';
import paper13 from '../../assets/files/private/13 Defining Residential Buildings.pdf';
import paper14 from '../../assets/files/private/14 RCDs Smoke Alarms Electrical Testing.pdf';
import paper15 from '../../assets/files/private/15 InspectWA Responds to CRIS Reforms.pdf';
import paper16 from '../../assets/files/private/16 Wet Area Waterproofing CPD Presentation.pdf';
import paper17 from '../../assets/files/private/17 Roof Leaks and Structural Damage.pdf';
import paper18 from '../../assets/files/private/18 InspectWA Position Paper.pdf';
import paper19 from '../../assets/files/private/19 Pre purchase structural inspections.pdf';
import paper20 from '../../assets/files/private/20 Tie Downs Part 1.pdf';
import paper21 from '../../assets/files/private/21 Tie Downs Part 2.pdf';
import paper22 from '../../assets/files/private/22 Tile Presentation.pdf';
import paper23 from '../../assets/files/private/23 Logo Policy.pdf';
import paper24 from '../../assets/files/private/24 Pre Purchase Building Inspection Annexures.pdf';
import paper25 from '../../assets/files/private/25 Restricted access.pdf';
import paper26 from '../../assets/files/private/26 Inspector engagement with builders on site.pdf';
import paper27 from '../../assets/files/private/27 Residential Property Purchase Contract - Observations.pdf';
import paper28 from '../../assets/files/private/28 Access for Pre Purcahse Building Inspections.pdf';

class Members extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isAuthenticated: false,
            loadingVisible: false,
            email: '', 
            password: '',
            changePasswordVisible: false,
            passwordNew1: '',
            passwordNew2: ''
        };
    } 
  
  
    // Handler functions
    onEmailChange = (event) => {
        this.setState({ email: event.target.value });
    }
    
    onPasswordChange = (event) => {
        this.setState({ password: event.target.value });
    }

    onPasswordNew1Change = (event) => {
        this.setState({ passwordNew1: event.target.value });
    }
    
    onPasswordNew2Change = (event) => {
        this.setState({ passwordNew2: event.target.value });
    }
    
    changePasswordShow = () => {
        this.setState({ changePasswordVisible: true });
    }

    changePasswordHide = () => {
        this.setState({ changePasswordVisible: false });
    }

    handleClick = (msg) => {
        console.log("clicked");
        alert('clicked');        
        alert(msg);
    }

    renderLoader = () => {
        if(this.state.loadingVisible) {
            return <Loading />;
        } else {
            return null;
        }
    }

    // Method to submit login
    submitLogin = () => {
        this.setState({ loadingVisible: true });

        // Reference to '/users' node
        const usersRef = ref(database, '/users');
        
        // Fetch data once
        get(usersRef)
            .then((snapshot) => {
                const dataObj = snapshot.val();
                let isAuthenticated = false;

                if (dataObj && dataObj.users) {
                    for(let i = 0; i < dataObj.users.length; i++) {
                        const user = dataObj.users[i];
                        if(user.email === this.state.email && user.password === this.state.password) {
                            isAuthenticated = true;
                            break;
                        }
                    }
                }

                // Simulate loading delay
                setTimeout(() => { 
                    this.setState({
                        loadingVisible: false,
                        isAuthenticated: isAuthenticated
                    }, () => {
                        if(!isAuthenticated) {
                            alert('Credentials are incorrect, please try again.');
                        }
                    });
                }, 2000);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                this.setState({ loadingVisible: false });
                alert('An error occurred while trying to authenticate. Please try again.');
            });
    }
    
    // Method to submit password change
    submitChangePassword = () => {
        const { email, password, passwordNew1, passwordNew2 } = this.state;
        if(passwordNew1 !== passwordNew2 || passwordNew1 === '') {
            alert('Your new password fields do not match, please ensure they are the same and resubmit.');
            return;
        }

        this.setState({ loadingVisible: true });

        // Reference to '/users' node
        const usersRef = ref(database, '/users');
        
        // Fetch data once
        get(usersRef)
            .then((snapshot) => {
                const dataObj = snapshot.val();
                let isAuthenticated = false;
                let updatedUsers = [];

                if(dataObj && dataObj.users) {
                    updatedUsers = dataObj.users.map(user => {
                        if(user.email === email && user.password === password) {
                            isAuthenticated = true;
                            return { ...user, password: passwordNew1 };
                        }
                        return user;
                    });
                }

                if(isAuthenticated) {
                    // Update '/users' node with new passwords
                    set(usersRef, updatedUsers)
                        .then(() => {
                            alert('Password has successfully been changed');
                            this.setState({
                                loadingVisible: false,
                                isAuthenticated: true,
                                changePasswordVisible: false,
                                password: '',
                                passwordNew1: '',
                                passwordNew2: ''
                            });
                        })
                        .catch((error) => {
                            console.error("Error updating password:", error);
                            this.setState({ loadingVisible: false });
                            alert('An error occurred while updating the password. Please try again.');
                        });
                } else {
                    // Simulate loading delay for unsuccessful attempt
                    setTimeout(() => { 
                        this.setState({
                            loadingVisible: false
                        });
                        alert('Existing email and password is incorrect, please try again.');
                    }, 2000);
                }
            })
            .catch((error) => {
                console.error("Error fetching users for password change:", error);
                this.setState({ loadingVisible: false });
                alert('An error occurred while trying to change the password. Please try again.');
            });
    }
    
    // Render content based on authentication and device type
    renderContent = () => {
        if(!isMobile) {
            if(!this.state.isAuthenticated) {
                if(this.state.changePasswordVisible) {
                    return (
                        <div>                        
                            <div style={styles.overlay}>
                                <div style={styles.formContainer}> 
                                
                                    <img src={require("../../assets/images/logoActual.png")} style={{width:'100%'}} alt="Logo" />
                                                                        
                                    <span style={styles.formTitle}>
                                        Complete the form below to change your password
                                    </span>
                                    <br /><br />

                                    <span style={styles.label}>
                                        Email:
                                    </span>
                                    <br />
                                    <input 
                                        onChange={this.onEmailChange}
                                        style={styles.input} 
                                        type="text"
                                        placeholder="Your email.." />
                                    <br /><br />  
                                    
                                    <span style={styles.label}>
                                        Old password:
                                    </span>
                                    <br />
                                    <input 
                                        onChange={this.onPasswordChange}
                                        style={styles.input} 
                                        type="password"
                                        placeholder="Your password.." />
                                    <br /><br />  
                                    
                                    <span style={styles.label}>
                                        New password:
                                    </span>
                                    <br />
                                    <input 
                                        onChange={this.onPasswordNew1Change}
                                        style={styles.input} 
                                        type="password"
                                        placeholder="New password.." />
                                    <br /><br />  
                                    
                                    <span style={styles.label}>
                                        Retype new password:
                                    </span>
                                    <br />
                                    <input 
                                        onChange={this.onPasswordNew2Change}
                                        style={styles.input} 
                                        type="password"
                                        placeholder="Retype new password.." />
                                    <br /><br />
                                    
                                    <div style={styles.buttonContainer}>
                                        <div 
                                            style={styles.confirmButton} 
                                            onClick={this.submitChangePassword} >                         
                                            <span style={styles.buttonText}>
                                                Confirm
                                            </span>
                                        </div>
                                        <div 
                                            style={styles.cancelButton} 
                                            onClick={this.changePasswordHide} >                         
                                            <span style={styles.buttonText}>
                                                Cancel
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>                
                            <div className="App" style={styles.appContainer}>
                                <div id="background" style={styles.background}>
                                    <NavBar />
                                    <FooterBar />
                                </div>    
                            </div>
                        </div>                
                    );
                } else {
                    return (
                        <div>                        
                            <div style={styles.overlay}>
                                <div style={styles.formContainer}> 
                                
                                    <img src={require("../../assets/images/logoActual.png")} style={{width:'100%'}} alt="Logo" />
                                                                        
                                    <span style={styles.formTitle}>
                                        Please login to access the members section
                                    </span>
                                    <br /><br />

                                    <span style={styles.label}>
                                        Email:
                                    </span>
                                    <br />
                                    <input 
                                        onChange={this.onEmailChange}
                                        style={styles.input} 
                                        type="text"
                                        placeholder="Your email.." />
                                    <br /><br />  
                                    
                                    <span style={styles.label}>
                                        Password:
                                    </span>
                                    <br />
                                    <input 
                                        onChange={this.onPasswordChange}
                                        style={styles.input} 
                                        type="password"
                                        placeholder="Your password.." />
                                    <br /><br />
                                    
                                    <div style={styles.loginButtonContainer}>
                                        <div 
                                            style={styles.submitButton} 
                                            onClick={this.submitLogin} >                         
                                            <span style={styles.buttonText}>
                                                Submit
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>                
                            <div className="App" style={styles.appContainer}>
                                <div id="background" style={styles.background}>
                                    <NavBar />
                                    <FooterBar />
                                </div>    
                            </div>
                        </div>                
                    );
                }
            } else {            
                return (                
                    <div className="App" style={styles.appContainer}>
                        <div id="background" style={styles.background}>
                            <NavBar isAuthenticated={this.state.isAuthenticated} authHandler={this.authHandler}/>

                            <div>    
                                <div style={styles.BodySection}>
                                    <h1 style={styles.BodySectionHeaderText}>
                                        InspectWA members area
                                    </h1>
                                    <div style={styles.BodySectionTextDiv}>
                                        
                                        <div style={styles.membersContainer}>
                                            <div style={styles.calendarContainer}>
                                                <h3>
                                                    Events Calendar
                                                </h3>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Event</th>
                                                            <th>Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr><td>Committee Meeting</td><td>Tuesday December 12th 2023</td></tr>
                                                        <tr><td>AGM & Christmas wind-up</td><td>Tuesday November 28th 2023</td></tr>
                                                        <tr><td>Committee Meeting</td><td>Tuesday November 14th 2023</td></tr>
                                                        <tr><td>General members meeting – TBA</td><td>Tuesday October 24th 2023</td></tr>
                                                        <tr><td>Committee Meeting</td><td>Tuesday October 10th 2023</td></tr>
                                                        <tr><td>Collate renewals, issue renewal invoices</td><td>Tuesday October 3rd 2023</td></tr>
                                                        <tr><td>Committee Meeting</td><td>Tuesday September 12th 2023</td></tr>
                                                        <tr><td>Issue renewal declarations</td><td>Friday September 1st  2023</td></tr>
                                                        <tr><td>General members meeting – TBA</td><td>Tuesday August 22nd 2023</td></tr>
                                                        <tr><td>Committee Meeting</td><td>Tuesday August 8th 2023</td></tr>
                                                        <tr><td>Committee Meeting</td><td>Tuesday July 11th 2023</td></tr>
                                                        <tr><td>General members meeting – TBA</td><td>Tuesday June 27th 2023</td></tr>
                                                        <tr><td>Committee Meeting</td><td>Tuesday June 13th 2023</td></tr>
                                                        <tr><td>Committee Meeting</td><td>Tuesday May 10th 2023</td></tr>
                                                        <tr><td>General members meeting – Building Commission Inspectorate</td><td>Tuesday May 3rd 2023</td></tr>
                                                        <tr><td>Committee Meeting</td><td>Tuesday April 11th 2023</td></tr>
                                                        <tr><td>Committee Meeting</td><td>Tuesday March 14th\ 2023</td></tr>
                                                        <tr><td>General members meeting – Rapid Solutions confirmed</td><td>Tuesday February 28th 2023</td></tr>
                                                        <tr><td>Committee Meeting</td><td>Tuesday February 14th 2023</td></tr>
                                                        <tr><td>Committee Meeting</td><td>Tuesday January 18th 2023</td></tr>

                                                        <tr>
                                                            <td>Members Forum - Tiling</td>
                                                            <td>23 February 2021</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Members Forum - Cavity Walls and Water Ingress</td>
                                                            <td>22 September 2020</td>
                                                        </tr>
                                                        <tr>
                                                            <td>AGM</td>
                                                            <td>July 2020</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Members Forum - Waterproofing and various</td>
                                                            <td>26 May 2020</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Structerre Framing World</td>
                                                            <td>25 February 2020</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Members Forum - Windows and various</td>
                                                            <td>27 November 2019</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Members Forum - REIWA and various</td>
                                                            <td>24 September 2019</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Inaugural AGM</td>
                                                            <td>28 May 2019</td>
                                                        </tr>
                                                    </tbody>
                                                    
                                                </table>

                                            </div>
                                            <div style={styles.docLibraryContainer}>
                                                <h3>
                                                    Document library
                                                </h3>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Document</th>
                                                            <th>Date modified</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper28} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        Access for Pre Purchase Building Inspections
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>1st September 2023</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper27} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        Residential Property Purchase Contract - Observations
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>7th July 2023</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper26} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        Inspector engagement with builders on site
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>19th November 2022</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper25} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                    Restricted access
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>8th May 2022</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper24} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                    Pre Purchase Building Inspection Annexures
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>1st May 2021</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper23} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                    Logo policy
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>23rd April 2021</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper21} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                    Tie Downs - Part 2
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>8th March 2021</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper22} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                    Tile presentation
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>1st March 2021</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper14} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        RCDs Smoke Alarms Electrical Testing
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>19th November 2020</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper20} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                    Tie Downs - Part 1
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>25th October 2020</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper19} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        Pre purchase structural inspections
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>16th August 2020</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper18} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        Restricted Access
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>15th July 2020</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper17} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        Roof Leaks and Structural Damage
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>15th July 2020</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper16} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        Wet Area Waterproofing CPD Presentation
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>26th May 2020</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper15} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        InspectWA Responds to CRIS Reforms
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>26th May 2020</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper13} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        Defining Residential Buildings
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>20th April 2020</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper12} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        Structural Defects Notices
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>20th April 2020</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper11} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        Pre Purchase Inspection Report
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>20th April 2020</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper8} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        Downlighting & Insulation
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>23rd March 2020</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper9} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        Rendered Finishes as an Alternative to Weep holes
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>23rd March 2020</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper6} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        Sagging ceilings
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>30th November 2019</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper7} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        Party and Firewalls
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>30th November 2019</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper1} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        Dilignification of Tile Battens
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>10th October 2019</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper2} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        Moisture in masonary walls
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>10th October 2019</td>
                                                            <td>Final</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a rel="noopener noreferrer" target='_blank' href={paper3} style={{textDecoration:'none'}}>
                                                                    <span style={{textDecorationColor:'rgba(0,0,0,0)', color:'white'}}>
                                                                        Pre Purchase inspection clarity
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td>10th October 2019</td>
                                                            <td>Final</td>
                                                        </tr>
                                                    </tbody>
                                                    
                                                </table>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <FooterBar />
                        </div>    
                    </div>
                    
                    
                );
                
            }
        } else {
            return (
                <div className="App" style={styles.appContainer}>
                    <div id="background" style={styles.background}>
                        <NavBarMobile isAuthenticated={this.state.isAuthenticated} authHandler={this.authHandler}/>
                        <div style={styles.mobileContent}>   
                            <img src={require("../../assets/images/logoActual.png")} style={styles.mobileLogo} alt="Logo" />
                            <br /><br />
                            <div style={styles.mobileMessageContainer}>
                                <p style={styles.mobileMessage}>
                                    The members section is not available on mobile devices. Please use a desktop computer to access this section.    
                                </p>
                                
                            </div>
                        </div>
                        <FooterBarMobile />
                    </div>
                </div>
                
            );
        
        }
        
    }
     
    render() {
        return (
            <div>
                {this.renderLoader()}
                {this.renderContent()}
            </div>
        );
    }

}

// Define your styles outside the component for cleaner code
const styles = {
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.6)', 
        zIndex: 20, 
        height: '90vh', 
        marginTop: '10vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    formContainer: {
        width: '30%',
        color: 'white'
    },
    formTitle: {
        color: 'white', 
        fontSize: 18,
    },
    label: {
        color: 'white'
    },
    input: {
        backgroundColor: 'white', 
        borderRadius: 5,
        border: 'none', 
        textIndent: 10, 
        padding: 5, 
        width: '100%'
    },
    buttonContainer: {
        display: 'flex', 
        flexDirection: 'row',
        marginTop: '10px'
    },
    confirmButton: {
        padding: 10, 
        backgroundColor: '#4CAF50', 
        borderRadius: 5, 
        color: 'white', 
        width: '80%', 
        cursor: 'pointer',
        marginRight: '10px'
    },
    cancelButton: {
        padding: 10, 
        backgroundColor: '#e74c3c', 
        borderRadius: 5, 
        color: 'white', 
        width: '80%', 
        cursor: 'pointer'
    },
    buttonText: {
        color: 'white'
    },
    appContainer: {
        width: "100%", 
        margin: 0, 
        padding: 0
    },
    background: {
        width: "100%"
    },
    BodySection: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginTop: '10vh',
        minHeight: '90vh'
    },
    BodySectionHeaderText: {
        color: 'rgb(220,220,220)',
        padding: 20
    },
    BodySectionTextDiv: {
        color: 'rgb(255,255,255)',
        textAlign: 'left',
        fontSize: '1rem',
        lineHeight: '1.2rem',
        width: '90vw',
        marginLeft: '5vw',
    },
    membersContainer: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: 'rgba(100,100,100,0.2)',
        display: 'flex',
    },
    calendarContainer: {
        width: '40%',
        margin: '5%',
        marginTop: 20,
        textAlign: 'center',
    },
    docLibraryContainer: {
        width: '40%',
        margin: '5%',
        marginTop: 20,
        textAlign: 'center'
    },
    loginButtonContainer: {
        width: '100%', 
        textAlign: 'center', 
        display: 'flex', 
        justifyContent: 'center'
    },
    submitButton: {
        padding: 10, 
        backgroundColor: '#4CAF50', 
        borderRadius: 5, 
        color: 'white', 
        width: '40%', 
        cursor: 'pointer'
    },
    mobileContent: {
        width: '100%',
        height: '100vh',
        contentAlign: 'center',
        textAlign: 'center'
    },
    mobileLogo: {
        width: '80vw',
        marginTop: '20vh'
    },
    mobileMessageContainer: {
        display: 'inline-block',
        width: '90vw'
    },
    mobileMessage: {
        fontSize: '2vh',
        color: 'rgb(220,220,220)',
        cursor: 'pointer'
    }
};

export default Members;
