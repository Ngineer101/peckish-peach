import axios from 'axios';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { useState } from 'react';
import Footer from '../../../components/footer';
import Header from '../../../components/header';
import { IGroceryList } from '../../../interfaces/IGroceryList';
import { supabaseClient } from '../../../utils/supabaseClient';

export default function GroceryList(props: {
  groceryList: IGroceryList,
}) {
  const session = supabaseClient.auth.session();
  if (!session) {
    const router = useRouter();
    router.replace('/');
    return null;
  }

  const [groceryListItems, setGroceryListItems] = useState(props.groceryList.items ? props.groceryList.items : []);
  return (
    <>
      <Head>
        <title>{props.groceryList.name ? props.groceryList.name : 'Grocery List'}</title>
      </Head>
      <Header />
      <div className='container'>
        <h1 className='text-center text-5xl font-bold my-8 underline'
          style={{ transform: "rotate(-1deg)" }}>
          {props.groceryList && props.groceryList.name ? props.groceryList.name : 'Grocery list not found'}
        </h1>
        {
          props.groceryList &&
          <div className='flex flex-col items-center'>
            <div className='flex flex-col bg-gray-200 rounded-xl shadow-2xl my-8 p-4 w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 2xl:w-1/2'
              style={{ transform: 'rotate(1deg)' }}>
              {
                groceryListItems.length > 0 &&
                groceryListItems.map((item, i) =>
                  <label key={i} className={`text-2xl my-1 flex items-center ${item.is_checked ? 'line-through' : ''}`}>
                    <input
                      className='mr-2 h-6 w-6 p-2 text-black checked:bg-black'
                      onChange={(evt) => {
                        const val = evt.target.checked;
                        axios.post('/api/check-item', {
                          id: item.id,
                          checked: val,
                        }, {
                          headers: {
                            'token': `${session.access_token}`
                          }
                        })
                          .then(() => {
                            groceryListItems[i].is_checked = val;
                            setGroceryListItems([...groceryListItems]);
                          })
                          .catch(error => {
                            // TODO: Handle error
                            // TODO: remove temp fix
                            groceryListItems[i].is_checked = val;
                            setGroceryListItems([...groceryListItems]);
                          });
                      }}
                      type='checkbox'
                      checked={item.is_checked} />
                    {item.description}
                  </label>
                )
              }
            </div>
          </div>
        }
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

    const groceryListItemResponse = await supabaseClient
      .from('grocery_list_items')
      .select()
      .eq('user_id', user!.id)
      .eq('grocery_list_id', context.query.id)
      .order('description', { ascending: true });

    if (groceryListResponse.data) {
      return {
        props: {
          groceryList: {
            ...groceryListResponse.data,
            items: (groceryListItemResponse.data || []),
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
