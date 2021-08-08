import Link from 'next/link';
import { supabaseClient } from '../utils/supabaseClient';
import { useRouter } from 'next/dist/client/router';
import SignOutButton from './signoutButton';

export default function Header() {
  const router = useRouter();
  const session = supabaseClient.auth.session();
  return (
    <header>
      {
        session &&
        <>
          {
            router.pathname !== '/' &&
            <Link href='/'>
              <a className='default-button mr-4'>Home</a>
            </Link>
          }
          {
            router.pathname !== '/my-recipes' &&
            <Link href='/my-recipes'>
              <a className='default-button mr-4'>My recipes</a>
            </Link>
          }
          <SignOutButton />
        </>
      }
    </header>
  );
}
