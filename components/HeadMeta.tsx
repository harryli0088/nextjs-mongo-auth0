import Head from "next/head";

type HeadMetaPropsType = {
  description?: string,
  image?: string,
  title?: string,
}

export function HeadMeta({
  title="Next.js MongoDB Auth0 Test Application",
  description="A test full stack application",
  image="https://www.trustedgunexchange.com/imgs/logo_short.svg",
}:HeadMetaPropsType) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description}/>

      {/* <meta property="og:url" content={url}/> */}
      <meta property="og:type" content="website"/>
      <meta property="og:title" content={title}/>
      <meta property="og:description" content={description}/>
      <meta property="og:image" content={image}/>

      <meta name="twitter:card" content="summary_large_image"/>
      <meta property="twitter:domain" content="trustedgunexchange.com"/>
      {/* <meta property="twitter:url" content={url}/> */}
      <meta name="twitter:title" content={title}/>
      <meta name="twitter:description" content={description}/>
      <meta name="twitter:image" content={image}/>
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}