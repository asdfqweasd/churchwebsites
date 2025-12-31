export default function Footer() {
  return (
    <footer className="bg-[#F6F5F4] text-gray-900">
      {/* Location and Service Times Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold uppercase tracking-wide">
            LOCATION AND SERVICE TIMES
          </h2>
          <div className="w-full h-px bg-gray-300 mt-4"></div>
        </div>

        <div className="flex justify-center">
          {/* Location & Service Times */}
          <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 text-left shadow-sm">
            <div className="max-w-xl mx-auto space-y-6 md:pl-24">
              <div className="space-y-1">
                <h3 className="font-bold text-lg">Address</h3>
                <p className="text-sm text-gray-700">2/39-41 Fourth Avenue Blacktown NSW, 2148</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg">Service Times</h3>
                <div className="space-y-4 flex flex-col items-stretch text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                    <span className="px-3 py-1 rounded-full bg-gray-200 text-xs font-semibold text-gray-900 self-start whitespace-nowrap">
                      Wednesday
                    </span>
                    <div className="text-sm leading-6">
                      <p className="font-semibold">Bible Studies</p>
                      <p className="text-gray-700">7:00 - 8:15 PM</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                    <span className="px-3 py-1 rounded-full bg-gray-200 text-xs font-semibold text-gray-900 self-start whitespace-nowrap">
                      Friday
                    </span>
                    <div className="text-sm leading-6">
                      <p className="font-semibold">Evening Service</p>
                      <p className="text-gray-700">7:00 - 8:30 PM</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                    <span className="px-3 py-1 rounded-full bg-gray-200 text-xs font-semibold text-gray-900 self-start whitespace-nowrap">
                      Sunday
                    </span>
                    <div className="text-sm leading-6 space-y-1">
                      <p>
                        <span className="font-semibold">English:</span> 9:00 - 10:45 AM
                      </p>
                      <p>
                        <span className="font-semibold">Akan:</span> 11:00 - 1:00 PM
                      </p>
                      <p>
                        <span className="font-semibold">Swahili:</span> 1:15 - 2:30 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 space-y-2">
                <h3 className="font-bold text-lg">Mailing Address</h3>
                <p className="text-sm text-gray-700">sydwestdistrict@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gray-300"></div>

      {/* Social Media and Copyright Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6 mb-6">
            <a 
              href="mailto:sydwestdistrict@gmail.com" 
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
            
            <a 
              href="https://www.instagram.com/psywest.aus?igsh=NHdmd2w1MWo0MnBs&utm_source=qr" 
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="currentColor" />
                <rect x="5.2" y="5.2" width="13.6" height="13.6" rx="3.3" ry="3.3" fill="none" stroke="white" strokeWidth="1.7" />
                <circle cx="12" cy="12" r="3.6" fill="none" stroke="white" strokeWidth="1.7" />
                <circle cx="16.8" cy="7.2" r="0.9" fill="white" />
              </svg>
            </a>
            
            <a 
              href="https://www.facebook.com/share/1P8YjARrXC/?mibextid=wwXIfr" 
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm uppercase tracking-wide">
            COPYRIGHT (C) The Church Of Pentecost Sydney West District 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
