import Layout from 'components/Layout'
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { useAccount } from 'wagmi'
import useDataDog from 'hooks/useAnalytics'
import { paths } from '@reservoir0x/client-sdk/dist/types/api'
import setParams from 'lib/params'
import Head from 'next/head'
import useCollections from 'hooks/useCollections'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from "next/link";


// Environment variables
// For more information about these variables
// refer to the README.md file on this repository
// Reference: https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser
// REQUIRED
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
const RESERVOIR_API_BASE = process.env.NEXT_PUBLIC_RESERVOIR_API_BASE

// OPTIONAL
const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY

const META_TITLE = process.env.NEXT_PUBLIC_META_TITLE
const META_DESCRIPTION = process.env.NEXT_PUBLIC_META_DESCRIPTION
const TAGLINE = process.env.NEXT_PUBLIC_TAGLINE
const COLLECTION = process.env.NEXT_PUBLIC_COLLECTION

type Props = InferGetStaticPropsType<typeof getStaticProps>

const metadata = {
  title: (title: string) => <title>{title}</title>,
  description: (description: string) => (
    <meta name="description" content={description} />
  ),
  tagline: (tagline: string | undefined) => (
    <>{tagline || 'Discover, buy and sell NFTs'}</>
  ),
}

const Home: NextPage<Props> = ({ fallback }) => {
  const router = useRouter()
  const { data: accountData } = useAccount()
  useDataDog(accountData)

  const title = META_TITLE && metadata.title(META_TITLE)
  const description = META_DESCRIPTION && metadata.description(META_DESCRIPTION)
  const tagline = metadata.tagline(TAGLINE)

  useEffect(() => {
    if (COLLECTION) {
      console.log('fallback', fallback)
      router.push(`/collections/${COLLECTION}?token=${fallback?.collection?.collection?.tokenCount}`)
    }
  }, [COLLECTION])

  // Return error page if the API base url or the environment's
  // chain ID are missing
  if (!CHAIN_ID) {
    console.debug({ CHAIN_ID })
    return <div>There was an error</div>
  }

  if (COLLECTION) return null

  return (
    <Layout navbar={{}}>
      <Head>
        {title}
        {description}
      </Head>
      <section className="absolute left-0 w-full h-screen col-span-full flex bg-[url('/background.png')] bg-center bg-cover">
      </section>
      <Link href="/collections/0x1f63ef5e95b3b2541f2b148bf95bfc34201b77cd">
      <a>
      <div className='absolute cursor-pointer top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96'>
      <img src="/gb_head.gif" alt="description of image"></img>
      </div>
      </a>
      </Link>
    </Layout>
  )
}

export default Home

export const getStaticProps: GetStaticProps<{
  fallback: {
    collection: paths['/collection/v2']['get']['responses']['200']['schema']
  }
}> = async () => {
  const options: RequestInit | undefined = {}

  if (RESERVOIR_API_KEY) {
    options.headers = {
      'x-api-key': RESERVOIR_API_KEY,
    }
  }

  const url = new URL('/collection/v2', RESERVOIR_API_BASE)

  let query: paths['/collection/v2']['get']['parameters']['query'] = {
    id: COLLECTION,
  }

  const href = setParams(url, query)
  const res = await fetch(href, options)

  const collection = (await res.json()) as Props['fallback']['collection']

  return {
    props: {
      fallback: {
        collection,
      },
    },
  }
}
