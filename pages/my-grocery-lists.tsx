import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Footer from '../components/footer';
import GroceryListCard from '../components/grocery-list-card';
import Header from '../components/header';
import { IGroceryList } from '../interfaces/IGroceryList';
import { supabaseClient } from '../utils/supabaseClient';

export default function MyGroceryLists(props: {
  groceryLists: IGroceryList[],
}) {
  return (
    <>
      <Head>
        <title>My Grocery Lists</title>
      </Head>
      <div className='container'>
        <Header />
        <h1 className='text-center text-3xl font-bold mt-8 mb-4 underline'>My Grocery Lists</h1>
        <div className='flex flex-col items-center'>
          {
            props.groceryLists && props.groceryLists.length > 0 &&
            props.groceryLists.map((groceryList, i) =>
              <GroceryListCard key={i} name={groceryList.name} href={`/grocery-list/${groceryList.id}`} />
            )
          }
          {
            (!props.groceryLists || props.groceryLists.length == 0) &&
            <GroceryListCard name={`You don't have any grocery lists yet.`} href={null} />
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
