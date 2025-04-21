import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-inner py-2">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <div className="mb-2 md:mb-0">
            © {new Date().getFullYear()} PaletteDrop. All rights reserved.
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-600 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;