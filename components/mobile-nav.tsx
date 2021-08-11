import { useState } from 'react';
import Link from 'next/link';
import SignOutButton from './sign-out-button';

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)
  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = 'auto'
      } else {
        // Prevent scrolling
        document.body.style.overflow = 'hidden'
      }
      return !status
    })
  }

  return (
    <div className="sm:hidden">
      <button
        type="button"
        className="w-8 h-8 ml-1 mr-1 rounded"
        aria-label="Toggle Menu"
        onClick={onToggleNav}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="text-gray-900" >
          {navShow ?
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd" />
            :
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd" />
          }
        </svg>
      </button>
      <div className={`fixed w-full h-full top-20 right-0 bg-lightGreen z-10 transform ease-in-out duration-300 ${navShow ? 'translate-x-0' : 'translate-x-full'}`}>
        <button
          type="button"
          aria-label="toggle modal"
          className="fixed w-full h-full cursor-auto focus:outline-none"
          onClick={onToggleNav}></button>
        <nav className="fixed flex flex-col h-full w-full mt-2 px-6">
          <Link href='/'>
            <a className='default-button mb-4 text-center' onClick={onToggleNav}>Home</a>
          </Link>
          <Link href='/my-recipes'>
            <a className='default-button mb-4 text-center' onClick={onToggleNav}>My recipes</a>
          </Link>
          <Link href='/my-grocery-lists'>
            <a className='default-button mb-4 text-center' onClick={onToggleNav}>My grocery lists</a>
          </Link>
          <SignOutButton />
        </nav>
      </div>
    </div>
  )
}

export default MobileNav
