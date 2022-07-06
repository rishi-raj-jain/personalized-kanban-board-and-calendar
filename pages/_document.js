import { CssBaseline } from '@geist-ui/react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    const styles = CssBaseline.flush()
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {styles}
        </>
      ),
    }
  }
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:type" content="website" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <body className="flex h-screen w-screen flex-col overflow-hidden bg-gradient-to-br from-[#9a1ab1] via-[#004966] to-[#01B18D] font-display">
          <Main />
          <NextScript />
          <noscript dangerouslySetInnerHTML={{ __html: `<link rel="stylesheet" href="/fonts/inter-var.woff2" />` }} />
        </body>
      </Html>
    )
  }
}
