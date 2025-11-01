// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
    return (
        <div className="footer">
            <div className="container">
                <div className="row">
                    {/* --- Column 1 --- */}
                    <div className="footer-col-1">
                        <h3>Download Our App</h3>
                        <p>Download App for Android and iOS mobile phones</p>
                        <div className="app-logo">
                            <img src="/images/playstore.png" alt="Play Store" />
                            <img src="/images/appstore.png" alt="App Store" />
                        </div>
                    </div>

                    {/* --- Column 2 --- */}
                    <div className="footer-col-2">
                        <img src="/images/logo 1.png" width="20px" height="20px" alt="logo" />
                        <p>
                            Our purpose is to sustainably make the pleasure and benefits of shopping accessible to many.
                        </p>
                    </div>

                    {/* --- Column 3 --- */}
                    <div className="footer-col-3">
                        <h3>Useful Links</h3>
                        <ul>
                            <li>Coupons</li>
                            <li>Blog Post</li>
                            <li>Return Policy</li>
                            <li>Join Affiliate</li>
                        </ul>
                    </div>

                    {/* --- Column 4 --- */}
                    <div className="footer-col-4">
                        <h3>Follow Us</h3>
                        <ul>
                            <li>Facebook</li>
                            <li>Twitter</li>
                            <li>Instagram</li>
                            <li>YouTube</li>
                        </ul>
                    </div>
                </div>

                <hr />
                <p className="copyright">Copyright 2025 - MarcoStore</p>
            </div>
        </div>
    );
};

export default Footer;
