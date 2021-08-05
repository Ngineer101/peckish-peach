export default function RecipeCard(props: {
  title: string,
  href: string | null,
}) {
  const title = props.title?.replace(':', '');
  return (
    props.href ?
      <a className='text-center text-black font-bold text-lg p-4 rounded-xl shadow-lg bg-orange my-4 mx-2' href={props.href}>
        {title}
      </a>
      :
      <span className='text-center text-black font-bold text-lg p-4 rounded-xl shadow-lg bg-orange my-4 mx-2'>
        {title}
      </span>
  );
}
