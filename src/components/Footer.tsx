import React from 'react'

export default function Footer() {
  return (
    
<footer className="relative w-full pt-16">
  <div className="mx-auto w-full max-w-7xl px-8">
    <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2">
      <h6 className="font-sans antialiased font-bold text-base md:text-lg lg:text-xl text-current mb-4">Mataji sukhi rakhe yaar</h6>
      <div className="grid grid-cols-3 justify-between gap-x-6 gap-y-4">
        <ul>
          <p className="font-sans antialiased text-base text-current mb-2 font-semibold opacity-50">Product</p>
          <li>
            <a href="#" className="font-sans antialiased text-base text-current py-1 hover:text-primary">Overview</a>
          </li>
          <li>
            <a href="#" className="font-sans antialiased text-base text-current py-1 hover:text-primary">Features</a>
          </li>
          <li>
            <a href="#" className="font-sans antialiased text-base text-current py-1 hover:text-primary">Solutions</a>
          </li>
          <li>
            <a href="#" className="font-sans antialiased text-base text-current py-1 hover:text-primary">Tutorials</a>
          </li>
        </ul>
        <ul>
          <p className="font-sans antialiased text-base text-current mb-2 font-semibold opacity-50">Company</p>
          <li>
            <a href="#" className="font-sans antialiased text-base text-current py-1 hover:text-primary">About us</a>
          </li>
          <li>
            <a href="#" className="font-sans antialiased text-base text-current py-1 hover:text-primary">Careers</a>
          </li>
          <li>
            <a href="#" className="font-sans antialiased text-base text-current py-1 hover:text-primary">Press</a>
          </li>
          <li>
            <a href="#" className="font-sans antialiased text-base text-current py-1 hover:text-primary">News</a>
          </li>
        </ul>
        <ul>
          <p className="font-sans antialiased text-base text-current mb-2 font-semibold opacity-50">Resource</p>
          <li>
            <a href="#" className="font-sans antialiased text-base text-current py-1 hover:text-primary">Blog</a>
          </li>
          <li>
            <a href="#" className="font-sans antialiased text-base text-current py-1 hover:text-primary">Newsletter</a>
          </li>
          <li>
            <a href="#" className="font-sans antialiased text-base text-current py-1 hover:text-primary">Events</a>
          </li>
          <li>
            <a href="#" className="font-sans antialiased text-base text-current py-1 hover:text-primary">Help center</a>
          </li>
        </ul>
      </div>
    </div>
    <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 border-t border-stone-200 py-4 md:flex-row md:justify-between">
      <small className="font-sans antialiased text-sm text-current text-center">© 2024
        <a href="https://material-tailwind.com/">Parth Kathrotiya</a>. All Rights Reserved.</small>
      <div className="flex gap-1 sm:justify-center">
        <a href="#" className="inline-grid place-items-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-sm min-w-[34px] min-h-[34px] rounded-md bg-transparent border-transparent text-stone-800 hover:bg-stone-200/10 hover:border-stone-600/10 shadow-none hover:shadow-none"><svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" className="h-4 w-4"><path d="M17 2H14C12.6739 2 11.4021 2.52678 10.4645 3.46447C9.52678 4.40215 9 5.67392 9 7V10H6V14H9V22H13V14H16L17 10H13V7C13 6.73478 13.1054 6.48043 13.2929 6.29289C13.4804 6.10536 13.7348 6 14 6H17V2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </a>
        <a href="#" className="inline-grid place-items-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-sm min-w-[34px] min-h-[34px] rounded-md bg-transparent border-transparent text-stone-800 hover:bg-stone-200/10 hover:border-stone-600/10 shadow-none hover:shadow-none"><svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" className="h-4 w-4"><path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z" stroke="currentColor"></path><path d="M17.5 6.51L17.51 6.49889" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </a>
        <a href="#" className="inline-grid place-items-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-sm min-w-[34px] min-h-[34px] rounded-md bg-transparent border-transparent text-stone-800 hover:bg-stone-200/10 hover:border-stone-600/10 shadow-none hover:shadow-none"><svg width="1.5em" height="1.5em" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" className="h-4 w-4"><path d="M16.8198 20.7684L3.75317 3.96836C3.44664 3.57425 3.72749 3 4.22678 3H6.70655C6.8917 3 7.06649 3.08548 7.18016 3.23164L20.2468 20.0316C20.5534 20.4258 20.2725 21 19.7732 21H17.2935C17.1083 21 16.9335 20.9145 16.8198 20.7684Z" stroke="currentColor"></path><path d="M20 3L4 21" stroke="currentColor" strokeLinecap="round"></path></svg>
        </a>
        <a href="#" className="inline-grid place-items-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-sm min-w-[34px] min-h-[34px] rounded-md bg-transparent border-transparent text-stone-800 hover:bg-stone-200/10 hover:border-stone-600/10 shadow-none hover:shadow-none"><svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" className="h-4 w-4"><path d="M16 22.0268V19.1568C16.0375 18.68 15.9731 18.2006 15.811 17.7506C15.6489 17.3006 15.3929 16.8902 15.06 16.5468C18.2 16.1968 21.5 15.0068 21.5 9.54679C21.4997 8.15062 20.9627 6.80799 20 5.79679C20.4558 4.5753 20.4236 3.22514 19.91 2.02679C19.91 2.02679 18.73 1.67679 16 3.50679C13.708 2.88561 11.292 2.88561 8.99999 3.50679C6.26999 1.67679 5.08999 2.02679 5.08999 2.02679C4.57636 3.22514 4.54413 4.5753 4.99999 5.79679C4.03011 6.81549 3.49251 8.17026 3.49999 9.57679C3.49999 14.9968 6.79998 16.1868 9.93998 16.5768C9.61098 16.9168 9.35725 17.3222 9.19529 17.7667C9.03334 18.2112 8.96679 18.6849 8.99999 19.1568V22.0268" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path><path d="M9 20.0267C6 20.9999 3.5 20.0267 2 17.0267" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </a>
        <a href="#" className="inline-grid place-items-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-sm min-w-[34px] min-h-[34px] rounded-md bg-transparent border-transparent text-stone-800 hover:bg-stone-200/10 hover:border-stone-600/10 shadow-none hover:shadow-none"><svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" className="h-4 w-4"><path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path><path d="M16.6726 20.8435C15.5 14 12.5 8.00003 8.5 2.62964" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path><path d="M2.06653 10.8406C6.00004 11 15.2829 10.5 19.1415 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path><path d="M21.9677 12.81C15.3438 10.8407 7.50002 14.0001 5.23145 19.3613" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </a>
      </div>
    </div>
  </div>
</footer>

  )
}
