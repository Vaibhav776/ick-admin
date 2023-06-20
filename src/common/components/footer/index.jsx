import React from 'react';

export default function Footer() {
    return (
        <footer className="footer footer-black  footer-white ">
            <div className="container-fluid">
                <div className="row">
                    <nav className="footer-nav">
                        <ul>
                            <li><a href="http://www.nugeninfo.com/" target="_blank">NUGEN IT SERVICES</a></li>
                        </ul>
                    </nav>
                    <div className="credits ml-auto">
                        <span className="copyright">
                            © Nugen IT Services, made with <i className="fa fa-heart heart"></i> 
              </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}