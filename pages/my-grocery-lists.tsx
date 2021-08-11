import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Footer from '../components/footer';
import GroceryListCard from '../components/grocery-list-card';
import Header from '../components/header';
import { IGroceryList } from '../interfaces/IGroceryList';
import { supabaseClient } from '../utils/supabaseClient';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import PlusIcon from '@heroicons/react/outline/PlusIcon';
import axios from 'axios';
import { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function MyGroceryLists(props: {
  groceryLists: IGroceryList[],
}) {
  const router = useRouter();
  const session = supabaseClient.auth.session();
  const [groceryLists, setGroceryLists] = useState(props.groceryLists || []);
  return (
    <>
      <Head>
        <title>My Grocery Lists</title>
      </Head>
      <Header />
      <div className='container'>
        <h1 className='text-center text-3xl font-bold mt-8 mb-2 underline'>My Grocery Lists</h1>
        <div className='flex justify-center items-center'>
          <Link href='/grocery-list/new'>
            <a className='new-grocery-list-button'>
              <PlusIcon className='h-5 w-5 mr-2' />
              New grocery list
            </a>
          </Link>
        </div>
        <div className='flex flex-col items-center'>
          {
            groceryLists && groceryLists.length > 0 &&
            groceryLists.map((groceryList, i) =>
              <GroceryListCard
                key={i}
                name={groceryList.name}
                href={`/grocery-list/${groceryList.id}`}
                onEditClick={(evt) => router.push(`/grocery-list/${groceryList.id}/edit`)}
                onDeleteClick={(evt) => {
                  confirmAlert({
                    customUI: ({ onClose }) => {
                      return (
                        <div className='custom-ui'>
                          <h1 className='text-center my-4'>Are you sure you want to delete this grocery list?</h1>
                          <div className='flex justify-between px-4'>
                            <button className='flex-1 py-2 border border-red-500 border-solid text-red-500 rounded-lg mr-2'
                              onClick={onClose}>No</button>
                            <button className='flex-1 py-2 rounded-lg border border-solid border-black'
                              onClick={() => {
                                axios.delete(`/api/save-grocery-list?id=${groceryList.id}`, {
                                  headers: {
                                    'token': `${session?.access_token}`
                                  }
                                })
                                  .then(() => {
                                    groceryLists.splice(i, 1);
                                    setGroceryLists([...groceryLists]);
                                  })
                                  .catch(error => {
                                    // TODO: Handle error
                                    // TODO: remove temp fix
                                    groceryLists.splice(i, 1);
                                    setGroceryLists([...groceryLists]);
                                  });
                                onClose();
                              }}>Yes, delete it!</button>
                          </div>
                        </div>
                      );
                    }
                  });
                }} />
            )
          }
          {
            (!groceryLists || groceryLists.length == 0) &&
            <span className='text-center text-black font-bold text-lg p-4 rounded-xl shadow-lg bg-orange my-4 mx-2'>
              You don't have any grocery lists yet.
            </span>
          }
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
    const { data, error } = await supabaseClient
      .from('grocery_lists')
      .select()
      .eq('user_id', user!.id);

    if (data) {
      return {
        props: {
          groceryLists: data,
        }
      };
    }
  }

  return {
    props: {
      groceryLists: [],
    }
  };
}
