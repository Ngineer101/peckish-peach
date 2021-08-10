import axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { useState } from 'react';
import Footer from '../../components/footer';
import GroceryListForm from '../../components/grocery-list-form';
import Header from '../../components/header';
import { supabaseClient } from '../../utils/supabaseClient'

export default function CreateNewGroceryList() {
  const session = supabaseClient.auth.session();
  const router = useRouter();
  if (!session) {
    router.replace('/');
    return null;
  }

  const [groceryListName, setGroceryListName] = useState('');
  const [groceryListItemText, setGroceryListItemText] = useState('');
  const [loading, setLoading] = useState(false);
  const [groceryListNameError, setGroceryListNameError] = useState('');
  const [groceryListItemsError, setGroceryListItemsError] = useState('');
  return (
    <>
      <Head>
        <title>Create new grocery list</title>
      </Head>
      <div className='container'>
        <Header />
        <h1 className='text-center text-3xl font-bold mt-8 mb-4 underline'>Create new grocery list</h1>
        <div className='flex justify-center'>
          <div className='w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 2xl:w-1/2 p-2 mt-4'>
            <GroceryListForm
              groceryListName={groceryListName}
              setGroceryListName={setGroceryListName}
              groceryListItemText={groceryListItemText}
              setGroceryListItemText={setGroceryListItemText}
              loading={loading}
              nameErrorMessage={groceryListNameError}
              itemsErrorMessage={groceryListItemsError}
              onSubmit={(evt) => {
                evt.preventDefault();
                setGroceryListNameError('');
                setGroceryListItemsError('');

                if (!groceryListName) {
                  setGroceryListNameError('Name is required');
                }

                if (!groceryListItemText) {
                  setGroceryListItemsError('At least one item is required');
                }

                if (!groceryListName || !groceryListItemText) {
                  return;
                }

                setLoading(true);
                axios.post('/api/save-grocery-list', {
                  name: groceryListName,
                  items: groceryListItemText.split('\n').map(i => {
                    return {
                      description: i,
                    };
                  }),
                }, {
                  headers: {
                    'token': `${session.access_token}`
                  }
                })
                  .then(response => {
                    router.push(`/grocery-list/${response.data.id}`);
                    setLoading(false);
                  })
                  .catch(error => {
                    setLoading(false);
                    // TODO: Display error message
                  });
              }} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
