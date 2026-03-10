import { Link } from 'react-router-dom';
import { Github, Twitter, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Argon Design System</h3>
            <p className="text-secondary-600 text-sm">
              A beautiful design system for Bootstrap 4 and React.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/components" className="text-secondary-600 hover:text-primary transition">
                  Components
                </Link>
              </li>
              <li>
                <a href="https://appseed.us" target="_blank" rel="noopener noreferrer" className="text-secondary-600 hover:text-primary transition">
                  AppSeed
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Getting Started</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-secondary-600 hover:text-primary transition">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-secondary-600 hover:text-primary transition">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary-600 hover:text-primary transition">
                <Github size={20} />
              </a>
              <a href="#" className="text-secondary-600 hover:text-primary transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-secondary-600 hover:text-primary transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-secondary-600 hover:text-primary transition">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-secondary-300 mt-8 pt-8 text-center text-secondary-600 text-sm">
          <p>© {new Date().getFullYear()} Argon Design System. All rights reserved.</p>
          <p className="mt-2">
            Created with ❤️ by{' '}
            <a
              href="https://appseed.us"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              AppSeed
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}