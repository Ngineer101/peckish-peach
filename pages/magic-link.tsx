import { useState } from 'react';
import { supabaseClient } from '../utils/supabaseClient';
import Head from 'next/head';
import Footer from '../components/footer';
import Mascot from '../components/mascot';

export default function MagicLink() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabaseClient.auth.signIn({ email })
      if (error) {
        setError(error.message);
      } else {
        setLinkSent(true);
      }
    } catch (error) {
      setError(error.error_description || error.message)
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Magic Link</title>
      </Head>
      <div className="container mt-6">
        <div className='flex items-center justify-center flex-col p-4 w-full'>
          <div className='speech-bubble sm:w-full md:w-full lg:w-2/3 xl:w-2/3 2xl:w-2/3'>
            {
              !linkSent ?
                <>
                  <h1 className='text-center text-2xl my-4'>
                    I will generate a delicious recipe,{' '}
                    <strong className='text-white bg-black px-1 mr-1 text-3xl'>
                      using AI
                    </strong>
                    , with the ingredients you already have at home.
                  </h1>
                  <h2 className='text-center my-2'>Please enter your email to get started.</h2>
                  <form className='w-full flex flex-col items-center'
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleLogin(email)
                    }}>
                    <div className='w-full px-4 pt-4'>
                      <input
                        className="w-full p-4 text-lg border-2 border-black border-solid rounded-lg outline-none"
                        autoFocus={true}
                        type="email"
                        autoComplete='email'
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <button
                      type='submit'
                      className="speech-bubble-button"
                      style={{ minWidth: '40%' }}
                      disabled={loading}>
                      <>
                        {
                          loading ?
                            'Going...'
                            :
                            'Go!'
                        }
                      </>
                    </button>
                  </form>
                  <span>OR</span>
                  <>
                    <h1 className='text-center text-2xl mt-8 mb-4'>Sign in with one of these providers.</h1>
                    <div className='flex flex-col justify-center items-center'>
                      <button className='mb-4'
                        onClick={async (evt) => {
                          const { user, session, error } = await supabaseClient.auth.signIn({
                            provider: 'apple'
                          });
                        }}>
                        <img src='/assets/appleid_button.png' className='h-10' />
                      </button>
                      <button className='mb-4'
                        onClick={async (evt) => {
                          const { user, session, error } = await supabaseClient.auth.signIn({
                            provider: 'google'
                          })
                        }}>
                        <img src='/assets/btn_google_signin.png' className='h-12' />
                      </button>
                    </div>
                  </>
                </>
                :
                <>
                  <h1 className='text-center text-2xl my-4'>
                    I just sent you a special link.
                  </h1>
                  <h1 className='text-center my-2'>
                    Check your inbox, click the link, and let the magic begin <strong>🌟</strong>
                  </h1>
                </>
            }

          </div>
          <Mascot />
        </div>
      </div>
      <Footer />
    </>
  );
}