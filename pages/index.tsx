import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../utils/supabaseClient';
import axios from 'axios';
import Welcome from '../components/welcome';
import RecipeGenerator from '../components/recipe-generator';
import Footer from '../components/footer';

export default function Home() {
  const [session, setSession] = useState<Session | null>(null)
  useEffect(() => {
    setSession(supabaseClient.auth.session())
    supabaseClient.auth.onAuthStateChange((event, session) => {
      setSession(session)
      axios.post('/api/auth', { event, session }, {
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });
    })
  }, []);

  return (
    <>
      <div className="container mt-12">
        {
          !session ?
            <Welcome />
            :
            <RecipeGenerator />
        }
      </div>
      <Footer />
    </>
  )
}
