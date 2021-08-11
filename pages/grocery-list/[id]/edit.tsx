import axios from 'axios';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { useState } from 'react';
import Footer from '../../../components/footer';
import GroceryListForm from '../../../components/grocery-list-form';
import Header from '../../../components/header';
import { IGroceryList } from '../../../interfaces/IGroceryList';
import { supabaseClient } from '../../../utils/supabaseClient';

export default function EditGroceryList(props: {
  groceryList?: IGroceryList,
}) {
  const session = supabaseClient.auth.session();
  const router = useRouter();
  if (!session) {
    router.replace('/');
    return null;
  }

  const [groceryListName, setGroceryListName] = useState(props.groceryList ? props.groceryList.name : '');
  const [groceryListItemText, setGroceryListItemText] = useState(props.groceryList ?
    (props.groceryList.items || []).reduce((arr: string[], item) => (item && arr.push(item.description), arr), []).join('\n')
    :
    '');
  const [loading, setLoading] = useState(false);
  const [groceryListNameError, setGroceryListNameError] = useState('');
  const [groceryListItemsError, setGroceryListItemsError] = useState('');
  return (
    <>
      <Head>
        <title>Edit grocery list</title>
      </Head>
      <Header />
      <div className='container'>
        <h1 className='text-center text-3xl font-bold mt-8 mb-4 underline'>Edit grocery list</h1>
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
                axios.put(`/api/save-grocery-list?id=${props.groceryList!.id}`, {
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

export const getServerSideProps: GetServerSideProps = async (context: any): Promise<GetServerSidePropsResult<{}>> => {
  supabaseClient.auth.setAuth(context.req.cookies["sb:token"]);
  const { user } = await supabaseClient.auth.api.getUserByCookie(context.req)
  if (user) {
    const groceryListResponse = await supabaseClient
      .from('grocery_lists')
      .select()
      .eq('user_id', user!.id)
      .eq('id', context.query.id)
      .single();

    if (groceryListResponse.data) {

      const itemResponse = await supabaseClient
        .from('grocery_list_items')
        .select()
        .eq('user_id', user!.id)
        .eq('grocery_list_id', context.query.id);

      return {
        props: {
          groceryList: {
            ...groceryListResponse.data,
            items: itemResponse.data,
          },
        }
      };
    }
  }

  return {
    props: {
      groceryList: {},
    }
  };
}
