import Link from 'next/link';

export default function Welcome() {
  return (
    <div className='flex items-center justify-center flex-col p-4 w-full mt-12'>
      <div className='speech-bubble sm:w-full md:w-full lg:w-2/3 xl:w-2/3 2xl:w-2/3'>
        <h1 className='text-center text-2xl my-4'>
          Hello! I'm <strong>Peckish Peach</strong>, your friendly AI kitchen assistant.{' '}
          I'm here to help you with cooking...
        </h1>
        <Link href='/magic-link'>
          <a className='speech-bubble-button'>
            Click here to continue
          </a>
        </Link>
      </div>
      <img src='/assets/peach-green.gif' height={300} width={300} />
    </div>
  );
}
