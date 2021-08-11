import PencilAltIcon from '@heroicons/react/outline/PencilAltIcon';
import TrashIcon from '@heroicons/react/outline/TrashIcon';

export default function GroceryListCard(props: {
  name: string,
  href: string,
  onEditClick: (evt: any) => void,
  onDeleteClick: (evt: any) => void,
}) {
  return (
    <div className='flex justify-between items-center bg-orange my-4 mx-2 rounded-xl shadow-lg'>
      <a className='text-center text-black font-bold text-lg p-4 mr-2' href={props.href}
        style={{ borderRight: 'solid black 1px' }}>
        {props.name}
      </a>
      <>
        <PencilAltIcon
          className='icon-button mr-2'
          onClick={props.onEditClick} />
        <TrashIcon
          className='icon-button mr-2'
          onClick={props.onDeleteClick} />
      </>
    </div>
  );
}
