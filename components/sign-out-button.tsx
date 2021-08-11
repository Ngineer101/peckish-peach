import { useRouter } from 'next/dist/client/router';
import { supabaseClient } from '../utils/supabaseClient';

export default function SignOutButton() {
  const router = useRouter();
  return (
    <button className='default-button' onClick={() => {
      supabaseClient.auth.signOut();
      router.replace('/');
    }}>
      Sign out
    </button>
  );
}
