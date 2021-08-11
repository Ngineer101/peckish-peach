import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Footer from '../../components/footer';
import Header from '../../components/header';
import { IRecipe } from '../../interfaces/IRecipe';
import { supabaseClient } from '../../utils/supabaseClient';

export default function Recipe(props: {
  recipe: IRecipe,
}) {
  return (
    <>
      <Head>
        <title>{props.recipe && props.recipe.title ? props.recipe.title.replace(':', '') : 'Recipe not found'}</title>
      </Head>
      <Header />
      <div className='container'>
        <h1 className='text-center text-5xl font-bold my-8 underline'
          style={{ transform: "rotate(-1deg)" }}>
          {props.recipe && props.recipe.title ? props.recipe.title.replace(':', '') : 'Recipe not found'}
        </h1>
        {
          props.recipe &&
          <div className='flex flex-col items-center'>
            <div className='flex flex-col items-center bg-gray-200 rounded-xl shadow-2xl my-8 p-4 w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 2xl:w-1/2'
              style={{ transform: 'rotate(1deg)' }}>
              <h3 className='text-center text-3xl mb-4 underline'>Ingredients</h3>
              {
                props.recipe && props.recipe.ingredients && props.recipe.ingredients.length > 0 &&
                props.recipe.ingredients.map((ingredient, i) =>
                  <div key={i} className='text-center'>
                    <span className='text-lg my-1 text-center'>{ingredient}</span>
                  </div>
                )
              }
            </div>
            <div className='flex flex-col items-center bg-gray-200 rounded-xl shadow-2xl my-8 p-4 w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 2xl:w-1/2'
              style={{ transform: 'rotate(-1deg)' }}>
              <h3 className='text-center text-3xl mb-4 underline'>Instructions</h3>
              {
                props.recipe && props.recipe.instructions && props.recipe.instructions.length > 0 &&
                props.recipe.instructions.map((instruction, i) =>
                  <div key={i} className='text-center'>
                    <span className='text-lg my-1 text-center'>{instruction}</span>
                  </div>
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
    const { data, error } = await supabaseClient
      .from('recipes')
      .select()
      .eq('user_id', user!.id)
      .eq('id', context.query.id)
      .single();

    return {
      props: {
        recipe: data,
      }
    }
  }

  return {
    props: {
      recipe: null,
    }
  }
}
