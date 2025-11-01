// src/pages/AboutPage.tsx
import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const AboutPage: React.FC = () => {
  return (
    <div className="container">
      <Navbar />

      <div className="account-page">
        <div className="container">
          <div className="row">
            <div className="col-2">
              <img src="/images/logo.png" width="100%" alt="" />
            </div>
            <div className="col-2">
              <div className="form-container">
                <div className="form-btn">
                  <h3>ABOUT US</h3>
                  <hr id="Indi" />
                </div>
                <p>Woo is the company behind WooCommerce, the flexible, open-source commerce solution
                  built on WordPress. Beginning in 2008 as WooThemes,
                  we decided to focus exclusively on ecommerce in 2017.
                  Today, Woo empowers small and medium businesses to
                  sell online by building exactly the store they
                  want. Our legacy as an all-remote company endures, growing
                  from three founders in Norway, the United Kingdom, and South
                  Africa to 400+ team members around the world.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-2">
              <div className="form-container">
                <div className="form-btn">
                  <h3>OUR MISSION</h3>
                  <hr id="Indi" />
                </div>
                <p>
                  Woo is committed to democratizing commerce and
                  putting you in control of your livelihood.

                  Our core platform, WooCommerce, is free and open
                  source, empowering anyone to sell anything, anywhere.
                </p>
              </div>


            </div>
          </div>
          <div className="row">
            <div className="col-2">
              <div className="form-container">
                <div className="form-btn">
                  <h3>Then origin story</h3>
                  <hr id="Indi" />
                </div>
                <p>
                  In November 2007, Mark Forrester, Magnus Jepson, and Adii Pienaar teamed up online to
                  build a new theme for WordPress. After a few months of selling themes together,
                  they decided to make their working relationship official and jointly launch WooThemes.

                  Our first plugin, WooCommerce, saw the light of day in 2011,
                  enabling users to transform their WordPress site into a professional ecommerce storefront. Woo-hoo!
                </p>
              </div>


            </div>
          </div>
          <div className="row">
            <div className="col-2">
              <img src="images/logo.png" width="100%" alt="" />
            </div>
            <div className="col-2">
              <div className="form-container">
                <div className="form-btn">
                  <h3>jOINING MojicTech</h3>
                  <hr id="Indi" />
                </div>
                <p>In 2015, WooThemes was acquired by MojicTech,
                  the company best-known for WordPress.com, Tumblr, Pocket Casts, Jetpack, and more.

                  Rebranded as Woo and bolstered by a passionate community of partners, developers,
                  and business leaders, we’ve continued our efforts to develop and democratize commerce.
                </p>
              </div>


            </div>
          </div>
        </div>
      </div>

      {/* <footer className="footer">
        <div className="container">
          <hr />
          <p className="copyright">© 2025 - MarcoStore</p>
        </div>
      </footer> */}
      <Footer />
    </div>
  );
};

export default AboutPage;
