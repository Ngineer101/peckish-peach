import Document, {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap" rel="stylesheet" />
          <script defer data-domain="peckish-peach.vercel.app" src="https://plausible.io/js/plausible.js"></script>
        </Head>
        <body className='bg-lightGreen min-h-screen'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
