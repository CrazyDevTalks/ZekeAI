import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css"
          integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
          integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic&display=swap"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800&display=swap"
          rel="stylesheet"
          type="text/css"
        />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link
          href="https://forge.zeke.ai/static/css/main.5884f45b.css"
          rel="stylesheet"
          type="text/css"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff"></meta>
        {/* Primary Meta Tags */}

        <title>Zeke - Emergent intelligence from Hub Culture</title>
        <meta
          name="title"
          content="Zeke - Emergent intelligence from Hub Culture"
        />
        <meta
          name="description"
          content="Zeke.ai was designed to provide intuitive and personalized experiences for each Hub Culture member"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.zeke.ai/" />
        <meta
          property="og:title"
          content="Zeke - Emergent intelligence from Hub Culture"
        />
        <meta
          property="og:description"
          content="Zeke.ai was designed to provide intuitive and personalized experiences for each Hub Culture member"
        />
        <meta
          property="og:image"
          content="https://www.zeke.ai/20230506_125223_0000.png"
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.zeke.ai/" />
        <meta
          property="twitter:title"
          content="Zeke - Emergent intelligence from Hub Culture"
        />
        <meta
          property="twitter:description"
          content="Zeke.ai was designed to provide intuitive and personalized experiences for each Hub Culture member"
        />
        <meta
          property="twitter:image"
          content="https://www.zeke.ai/20230506_125223_0000.png"
        ></meta>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
