import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { useRouter } from 'next/router'
import Layout from 'components/Layout'
import { useState } from 'react'
import useCollection from 'hooks/useCollection'
import useCollectionStats from 'hooks/useCollectionStats'
import useTokens from 'hooks/useTokens'
import useCollectionAttributes from 'hooks/useCollectionAttributes'
import { setToast } from 'components/token/setToast'
import { paths, setParams } from '@reservoir0x/client-sdk'
import { formatNumber } from 'lib/numbers'
import Sidebar from 'components/Sidebar'
import AttributesFlex from 'components/AttributesFlex'
import ExploreFlex from 'components/ExploreFlex'
import SortMenuExplore from 'components/SortMenuExplore'
import ViewMenu from 'components/ViewMenu'
import SortMenu from 'components/SortMenu'
import { FiRefreshCcw } from 'react-icons/fi'
import ExploreTokens from 'components/ExploreTokens'
import TokensRow from 'components/TokensRow'
import TokensGrid from 'components/TokensGrid'
import Head from 'next/head'
import FormatEth from 'components/FormatEth'
import useAttributes from 'hooks/useAttributes'
import Link from "next/link";
import { Modal } from 'components/modal/ModalBasic'
import { useEffect } from 'react'
import TokenAvatar from 'components/token/TokenAvatar'
import TokenInfo from 'components/token/TokenInfo'
import Owner from 'components/token/Owner'
import useDetails from 'hooks/useDetails'


// Environment variables
// For more information about these variables
// refer to the README.md file on this repository
// Reference: https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser
// REQUIRED
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

// OPTIONAL
const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY

const envBannerImage = process.env.NEXT_PUBLIC_BANNER_IMAGE

const RESERVOIR_API_BASE = process.env.NEXT_PUBLIC_RESERVOIR_API_BASE
const PROXY_API_BASE = process.env.NEXT_PUBLIC_PROXY_API_BASE

const metaTitle = process.env.NEXT_PUBLIC_META_TITLE
const metaDescription = process.env.NEXT_PUBLIC_META_DESCRIPTION
const metaImage = process.env.NEXT_PUBLIC_META_OG_IMAGE

const COLLECTION = process.env.NEXT_PUBLIC_COLLECTION
const COMMUNITY = process.env.NEXT_PUBLIC_COMMUNITY

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Home: NextPage<Props> = (props) => {
  const { id } = props;

  const router = useRouter()
  const [refreshLoading, setRefreshLoading] = useState(false)

  const collection = props.collection?.collection
  // const tokens = props.tokens?.tokens;

  const stats = useCollectionStats(router, id)

  const { tokens, ref: refTokens } = useTokens(id, [props.tokens], router)

  const { collectionAttributes, ref: refCollectionAttributes } =
    useCollectionAttributes(router, id)

  const attributes = useAttributes(id)


  const { query } = useRouter()
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    const token = query?.token?.toString()

    setOpenModal(Boolean(token))
  }, [query])

  const details = useDetails({
    tokens: [
      `${'0x1f63ef5e95b3b2541f2b148bf95bfc34201b77cd'}:${router.query?.token?.toString()}`,
    ],
  })

  if (!CHAIN_ID) return null

  if (tokens.error) {
    return <div>There was an error</div>
  }

  const tokenCount = stats?.data?.stats?.tokenCount ?? 0

  async function refreshCollection(collectionId: string | undefined) {
    function handleError(message?: string) {
      setToast({
        kind: 'error',
        message: message || 'Request to refresh collection was rejected.',
        title: 'Refresh collection failed',
      })

      setRefreshLoading(false)
    }

    try {
      if (!collectionId) throw new Error('No collection ID')

      const data = {
        collection: collectionId,
      }

      const pathname = `${PROXY_API_BASE}/collections/refresh/v1`

      setRefreshLoading(true)

      const res = await fetch(pathname, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json()
        handleError(json?.message)
        return
      }

      setToast({
        kind: 'success',
        message: 'Request to refresh collection was accepted.',
        title: 'Refresh collection',
      })
    } catch (err) {
      handleError()
      console.error(err)
      return
    }

    setRefreshLoading(false)
  }

  const title = metaTitle ? (
    <title>{metaTitle}</title>
  ) : (
    <title>{collection?.name}</title>
  )
  const description = metaDescription ? (
    <meta name="description" content={metaDescription} />
  ) : (
    <meta
      name="description"
      content={collection?.metadata?.description as string}
    />
  )

  const bannerImage = (envBannerImage ||
    collection?.metadata?.bannerImageUrl) as string

  const image = metaImage ? (
    <>
      <meta name="twitter:image" content={metaImage} />
      <meta name="og:image" content={metaImage} />
    </>
  ) : (
    <>
      <meta name="twitter:image" content={bannerImage} />
      <meta property="og:image" content={bannerImage} />
    </>
  )


  return (
    <Layout navbar={{}}>
      <>
        <Head>
          {title}
          {description}
          {image}
        </Head>


      {/* {openModal && (
        <Modal
          onClose={() => {
            router.push(`/collections/0x1f63ef5e95b3b2541f2b148bf95bfc34201b77cd`, undefined, { shallow: true });
          }}
        >
          <TokenMedia details={details} />
          <div className='ml-10'>
          <Owner details={details} />

          </div>

        </Modal>
      )} */}

      <div className='relative md:flex justify-center items-end col-span-full md:w-screen md:h-screen md:bg-gradient-to-b from-black via-black to-gray-600 '>

      <div className='child md:absolute md:flex md:translate-y-[-30%]'>
      <div className='relative col-span-full md:min-w-[600px] md:min-h-[600px] md:pl-10 md:mr-10'>
        <TokenAvatar details={details} />
      </div>

      <div className='relative col-span-full md:pr-10 flex items-end'>
        <Owner tokenId={router.query?.token?.toString()} tokenCount={collection?.tokenCount} details={details} />
      </div>
      </div>

      <div className='invisible overflow-x-scroll md:visible md:relative bg-gray-900 md:left-0 md:bottom-0 md:h-[15%] md:w-screen'>
      <TokensGrid
                tokenCount={12}
                tokens={tokens}
                viewRef={refTokens}
                collectionImage={
                  collection?.metadata?.imageUrl as string
                }
              />
      </div>
      
      </div>


      <div className='relative flex justify-center items-center h-[700px] col-span-full md:bg-gradient-to-b from-black via-black to-gray-600 bg-center '>
      
      <div className="absolute child w-full h-full col-span-full flex bg-[url('/background.png')] bg-center bg-cover"></div>

      <div className='md:items-center md:relative md:child md:flex md:justify-center p-10 '>

      <div className='bg-slate-900 relative child md:w-[40%] p-8 justify-center  col-span-full text-xl font-pixeloid'>
      A speedrun of video game history in 360 characters.
      <div className='flex mt-4 text-lg font-pixeloid'>
        360 Total - {stats?.data?.stats?.tokenCount} / 360
      </div>
      <div className="w-full md:w-3/4 mt-4 bg-gray-200 dark:bg-gray-700 border-2">
      <div className="bg-white h-2.5 w-[52%]" ></div>
      </div>
      
      <a href="https://twitter.com/gamebrosgg" rel="noreferrer" target="_blank">
      <div className='bg-white text-black p-3 flex mt-4 text-lg font-pixeloid justify-center hover:bg-slate-700 hover:text-white'>
       New Drops Every Week
      </div></a>
      </div>
      

      <div className='relative flex child col-span-full justify-center '>
       <img src="/gb_head.webp" alt="description of image" className='p-8 w-[300px] md:w-[400px]' ></img>

      </div>


      </div>
      </div>



      {/* <div className="relative flex justify-center w-screen h-screen col-span-full bg-gradient-to-b from-black via-black to-gray-800 bg-center">
        <div className="absolute child left-0 w-full h-full col-span-full flex bg-[url('/background.png')] bg-center bg-cover"></div>
          
        <div className='absolute child flex translate-y-[-30%]'>
      <div className='relative min-w-[600px] min-h-[600px] mr-10'>
      <div className='flex justify-center mt-4 text-xl font-press-start'>
        360 GameBros
      </div>
      <div className='flex justify-center mt-4 text-lg font-press-start'>
        {stats?.data?.stats?.tokenCount} / 360
      </div>
      <div className="w-full mt-4 bg-gray-200 dark:bg-gray-700 border-2">
      <div className="bg-white h-2.5 w-[52%]" ></div>
</div>
      </div>

      <div className='relative col-span-full flex items-end md:w-[600px]'>
      <img src="/gb_head.webp" alt="description of image"></img>

      </div>
      </div>


      <div className='relative child mt-14 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96'>

      </div>
      </div> */}


        {/* <Hero collectionId={id} fallback={fallback} /> */}
        <div className="col-span-full grid grid-cols-4 gap-x-4 md:grid-cols-8 lg:grid-cols-12 3xl:grid-cols-16 4xl:grid-cols-21">
          {/* <Sidebar attributes={attributes} setTokensSize={tokens.setSize} /> */}
          <div className="col-span-full">
            <div className="mb-10 hidden items-center justify-between">
              <div className="flex items-center gap-6">
                {!!stats?.data?.stats?.tokenCount &&
                  stats?.data?.stats?.tokenCount > 0 && (
                    <>
                      <div>
                        {formatNumber(stats?.data?.stats?.tokenCount)} items
                      </div>

                      {/* <div className="h-9 w-px bg-gray-300 dark:bg-neutral-600"></div> */}
                      {/* <div>
                        <FormatEth
                          amount={stats?.data?.stats?.market?.floorAsk?.price}
                        />{' '}
                        floor price
                      </div> */}
                    </>
                  )}
              </div>
              <div className="flex gap-4">
                {router.query?.attribute_key ||
                router.query?.attribute_key === '' ? (
                  <>
                    <SortMenuExplore setSize={collectionAttributes.setSize} />
                    <ViewMenu />
                  </>
                ) : (
                  <SortMenu setSize={tokens.setSize} />
                )}
                <button
                  className="btn-primary-outline dark:border-neutral-600 dark:text-white dark:ring-primary-900 dark:focus:ring-4"
                  title="Refresh collection"
                  disabled={refreshLoading}
                  onClick={() => refreshCollection(id)}
                >
                  <FiRefreshCcw
                    className={`h-5 w-5 ${
                      refreshLoading ? 'animate-spin-reverse' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
            <AttributesFlex className="mb-10 flex flex-wrap gap-3" />
            <ExploreFlex />
            {/* {router.query?.attribute_key ||
            router.query?.attribute_key === '' ? (
              <ExploreTokens
                attributes={collectionAttributes}
                viewRef={refCollectionAttributes}
              />
            ) : (
              <TokensGrid
                tokenCount={tokenCount}
                tokens={tokens}
                viewRef={refTokens}
                collectionImage={
                  collection?.data?.collection?.metadata?.imageUrl as string
                }
              />
            )} */}
          </div>
        </div>
      </>
    </Layout>
  )
}

export default Home

export const getStaticPaths: GetStaticPaths = async () => {
  if (COLLECTION && !COMMUNITY) {
    return {
      paths: [{ params: { id: COLLECTION } }],
      fallback: false,
    }
  }

  if (COLLECTION && COMMUNITY) {
    const url = new URL(`/search/collections/v1`, RESERVOIR_API_BASE)

    const query: paths['/search/collections/v1']['get']['parameters']['query'] =
      { community: COMMUNITY, limit: 20 }

    setParams(url, query)

    const res = await fetch(url.href)

    const collections =
      (await res.json()) as paths['/search/collections/v1']['get']['responses']['200']['schema']

    if (!collections?.collections) {
      return {
        paths: [{ params: { id: COLLECTION } }],
        fallback: false,
      }
    }

    if (collections.collections?.length === 0) {
      return {
        paths: [{ params: { id: COLLECTION } }],
        fallback: false,
      }
    }

    const paths = collections?.collections?.map(({ contract }) => ({
      params: {
        id: contract,
      },
    }))

    return {
      paths,
      fallback: false,
    }
  }

  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<{
  collectionId?: string
  collection: paths['/collection/v1']['get']['responses']['200']['schema']
  tokens: paths['/tokens/v4']['get']['responses']['200']['schema']
  id: string | undefined
}> = async ({ params }) => {
  const options: RequestInit | undefined = {}

  if (RESERVOIR_API_KEY) {
    options.headers = {
      'x-api-key': RESERVOIR_API_KEY,
    }
  }

  const id = params?.id?.toString()

  // COLLECTION
  const collectionUrl = new URL('/collection/v1', RESERVOIR_API_BASE)

  let collectionQuery: paths['/collection/v1']['get']['parameters']['query'] = {
    id,
  }

  setParams(collectionUrl, collectionQuery)

  const collectionRes = await fetch(collectionUrl.href, options)

  const collection =
    (await collectionRes.json()) as Props['collection']

  // TOKENS
  const tokensUrl = new URL('/tokens/v4', RESERVOIR_API_BASE)

  let tokensQuery: paths['/tokens/v4']['get']['parameters']['query'] = {
    collection: id,
    sortBy: 'topBidValue',
    limit: 20,
  }

  setParams(tokensUrl, tokensQuery)

  const tokensRes = await fetch(tokensUrl.href, options)

  const tokens = (await tokensRes.json()) as Props['tokens']

  return {
    props: { collection, tokens, id },
    revalidate: 20,
  }
}
