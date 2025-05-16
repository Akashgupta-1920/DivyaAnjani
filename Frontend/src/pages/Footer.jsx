import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLeaf } from 'react-icons/fa';
import logo from '../assets/ressearch/logo1.png';


function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Link to="/" className="flex justify-center">
                          <img src={logo} alt="Suwasthi Logo" className="w-32 mx-auto" />
              </Link>
              {/* <FaLeaf className="text-secondary text-2xl" />
              <span className="text-xl font-semibold">AyurVaid</span> */}
            </div>
            <p className="text-sm">Bringing ancient wisdom to modern wellness through authentic Ayurvedic solutions.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-secondary transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-secondary transition-colors">Products</Link></li>
              <li><Link to="/research" className="hover:text-secondary transition-colors">Research</Link></li>
              <li><Link to="/contact" className="hover:text-secondary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: info@ayurvaid.com</li>
              <li>Phone: +1 234 567 890</li>
              <li>Address: 123 Ayurveda Street, Wellness City</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-secondary transition-colors"><FaFacebook size={24} /></a>
              <a href="#" className="hover:text-secondary transition-colors"><FaTwitter size={24} /></a>
              <a href="#" className="hover:text-secondary transition-colors"><FaInstagram size={24} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} AyurVaid. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
