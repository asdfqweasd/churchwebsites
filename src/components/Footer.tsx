export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Location and Service Times Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold uppercase tracking-wide">
            LOCATION AND SERVICE TIMES
          </h2>
          <div className="w-full h-px bg-white mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-lg mb-2">Address</h3>
              <p className="text-sm mb-1">XXXXXX</p>
              <p className="text-sm">Service Times: Mon-SUN at 9 am & 11 am</p>
            </div>
            
          </div>

          {/* Right Column */}
          <div className="space-y-8">            
            <div>
              <h3 className="font-bold text-lg mb-2">Mailing Address</h3>
              <p className="text-sm">xxxxxxxxxxx</p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-white"></div>

      {/* Social Media and Copyright Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6 mb-6">
            <a 
              href="mailto:info@church.com" 
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
            
            <a 
              href="https://instagram.com" 
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281H7.721v1.5h8.558v-1.5zm-5.03 2.25H7.721v1.5h3.528v-1.5z"/>
              </svg>
            </a>
            
            <a 
              href="https://facebook.com" 
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm uppercase tracking-wide">
            COPYRIGHT © The Church Of Pentecost Sydney West District 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
