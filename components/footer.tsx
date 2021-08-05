export default function Footer() {
  return (
    <footer>
      <span>Created by{' '}
        <a className='text-blue-500' href='https://twitter.com/nwbotha' target='_blank' rel='noopener noreferrer'>
          @nwbotha
        </a>
        {' '}with <strong>⚡</strong> / <strong>☕</strong>
      </span>
      <span className='my-4'>
        <i>
          <u className='text-sm'>This app is still experimental</u>
        </i>
      </span>
    </footer>
  );
}
