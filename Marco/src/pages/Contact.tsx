// src/pages/ContactPage.tsx
import React, { useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can integrate with backend contact endpoint
    setSubmitted(true);
  };

  return (
    <div className="container">
      <Navbar />

      <div className="contact-page">
        <div className="row">
          <div className="col-2">
            <h2>Contact Us</h2>
            <p>
              We'd love to hear from you! Whether you have questions, feedback, or need support,
              fill out the form below and our team will reach out soon.
            </p>

            {submitted ? (
              <p className="success">Thank you! Your message has been sent successfully.</p>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="message"
                  rows={10}
                  cols={35}
                  placeholder="Your Message"
                  value={form.message}
                  onChange={handleChange}
                  required
                ></textarea>
                <button type="submit" className="btn">Send Message</button>
              </form>
            )}
          </div>

          {/* <div className="col-2">
            <img src="/images/contact.png" alt="Contact" width="100%" />
          </div> */}
        </div>
      </div>
      

      <Footer />
    </div>
  );
};

export default ContactPage;
