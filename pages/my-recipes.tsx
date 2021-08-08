import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { supabaseClient } from '../utils/supabaseClient';
import RecipeCard from '../components/recipe-card';
import Footer from '../components/footer';
import Head from 'next/head';
import { IRecipe } from '../interfaces/IRecipe';
import Header from '../components/header';

export default function MyRecipes(props: {
  recipes: IRecipe[]
}) {
  return (
    <>
      <Head>
        <title>My Recipes</title>
      </Head>
      <div className='container'>
        <Header />
        <h1 className='text-center text-3xl font-bold mt-8 mb-4 underline'>My Recipes</h1>
        <div className='flex flex-col items-center'>
          {
            props.recipes && props.recipes.length > 0 &&
            props.recipes.map((recipe, i) =>
              <RecipeCard key={i} title={recipe.title} href={`/recipe/${recipe.id}`} />
            )
          }
          {
            (!props.recipes || props.recipes.length == 0) &&
            <RecipeCard title={`You don't have any recipes yet.`} href={null} />
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
      .from('recipes')
      .select()
      .eq('user_id', user!.id);

    if (data) {
      return {
        props: {
          recipes: data,
        }
      };
    }
  }

  return {
    props: {
      recipes: [],
    }
  };
}
