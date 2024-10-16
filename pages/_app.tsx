import { useState } from 'react';
import { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0/client'

import { //https://tanstack.com/query/v4/docs/react/examples/react/nextjs
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


import 'bootstrap/dist/css/bootstrap.min.css'

export default function App ({
  Component,
  pageProps,
}: AppProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
        <ReactQueryDevtools />
      </UserProvider>
    </QueryClientProvider>
  )
}