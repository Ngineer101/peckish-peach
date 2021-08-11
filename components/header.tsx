import Link from 'next/link';
import { supabaseClient } from '../utils/supabaseClient';
import SignOutButton from './sign-out-button';
import MobileNav from './mobile-nav';

export default function Header() {
  const session = supabaseClient.auth.session();
  return (
    <header>
      <img className='h-16 w-16 rounded-lg' src='/icon.png' />
      {
        session &&
        <div className="flex items-center text-base leading-5">
          <div className="hidden sm:block">
            <Link href='/'>
              <a className='default-button mr-4'>Home</a>
            </Link>
            <Link href='/my-recipes'>
              <a className='default-button mr-4'>My recipes</a>
            </Link>
            <Link href='/my-grocery-lists'>
              <a className='default-button mr-4'>My grocery lists</a>
            </Link>
            <SignOutButton />
          </div>
          <MobileNav />
        </div>
      }
    </header>
  );
}
