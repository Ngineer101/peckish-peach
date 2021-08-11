import {
  Dispatch,
  FormEvent,
  SetStateAction,
} from 'react';

export default function GroceryListForm(props: {
  groceryListName: string,
  setGroceryListName: Dispatch<SetStateAction<string>>,
  groceryListItemText: string,
  setGroceryListItemText: Dispatch<SetStateAction<string>>,
  onSubmit: (evt: FormEvent<HTMLFormElement>) => void,
  loading: boolean,
  nameErrorMessage?: string,
  itemsErrorMessage?: string,
}) {
  return (
    <form className='flex flex-col justify-center w-full'
      onSubmit={props.onSubmit}>
      <label htmlFor='Grocery list name'>Grocery list name</label>
      <input
        className='w-full p-2 text-lg border border-black border-solid rounded-xl outline-none mb-2'
        autoFocus={true}
        name='Grocery list name'
        placeholder='e.g. Household items'
        value={props.groceryListName}
        onChange={(evt) => props.setGroceryListName(evt.target.value)} />
      {
        props.nameErrorMessage &&
        <label className='text-red-500 font-bold'>{props.nameErrorMessage}</label>
      }

      <label className='mt-6' htmlFor='Grocery list items'>Grocery list items</label>
      <textarea
        className='border border-solid border-black rounded-xl outline-none p-4 w-full mb-2'
        style={{ minHeight: 120 }}
        name='Grocery list items'
        rows={1 + props.groceryListItemText.split('\n').length}
        value={props.groceryListItemText}
        onChange={(evt) => props.setGroceryListItemText(evt.target.value)}
        placeholder={'Cheese\nPasta\nTomatoes'}></textarea>
      {
        props.itemsErrorMessage &&
        <label className='text-red-500 font-bold'>{props.itemsErrorMessage}</label>
      }

      <button
        className='default-button w-full mt-6'
        type='submit'>
        {
          props.loading ?
            'Saving...'
            :
            'Save'
        }
      </button>
    </form>
  );
}
