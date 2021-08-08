export default function GroceryListCard(props: {
  name: string,
  href: string | null,
}) {
  return (
    props.href ?
      <a className='text-center text-black font-bold text-lg p-4 rounded-xl shadow-lg bg-orange my-4 mx-2' href={props.href}>
        {props.name}
      </a>
      :
      <span className='text-center text-black font-bold text-lg p-4 rounded-xl shadow-lg bg-orange my-4 mx-2'>
        {props.name}
      </span>
  );
}
