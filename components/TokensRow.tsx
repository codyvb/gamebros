import { FC } from 'react'
import { toggleOffItem, toggleOnItem } from 'lib/router'
import { useRouter } from 'next/router'
import LoadingCard from './LoadingCard'
import { SWRInfiniteResponse } from 'swr/infinite/dist/infinite'
import Link from 'next/link'
import { optimizeImage } from 'lib/optmizeImage'
import { useInView } from 'react-intersection-observer'
import FormatEth from './FormatEth'
import Masonry from 'react-masonry-css'
import { paths } from '@reservoir0x/client-sdk/dist/types/api'
import FormatWEth from 'components/FormatWEth'
import {ENSName} from 'react-ens-name'


const SOURCE_ID = process.env.NEXT_PUBLIC_SOURCE_ID
const NAVBAR_LOGO = process.env.NEXT_PUBLIC_NAVBAR_LOGO

type Props = {
  tokens: SWRInfiniteResponse<
    paths['/tokens/v4']['get']['responses']['200']['schema'],
    any
  >
  collectionImage: string | undefined
  viewRef: ReturnType<typeof useInView>['ref']
  tokenCount: number
}

const TokensGrid: FC<Props> = ({
  tokens,
  viewRef,
  tokenCount,
  collectionImage,
}) => {
  const { data, error } = tokens

  // Reference: https://swr.vercel.app/examples/infinite-loading
  const mappedTokens = data ? data.flatMap(({ tokens }) => tokens) : []
  const isLoadingInitialData = !data && !error
  const isEmpty = mappedTokens.length === 0
  const didReactEnd = isEmpty || (data && mappedTokens.length < tokenCount)

  const router = useRouter()



  return (
    <div
      className='flex justify-center p-10'
      key="tokensGridMasonry"
    >
      {isLoadingInitialData
        ? Array(12)
            .fill(null)
            .map((_, index) => <LoadingCard key={`loading-card-${index}`} />)
        : mappedTokens?.map((token, idx) => {
            if (!token) return null

            return (
              
              

              <li className='list-none'
                key={`${token?.collection?.name}${idx}`}
              >
                <a onClick={() => toggleOnItem(router, 'token', `${token?.tokenId}`)} className="group relative grid cursor-pointer self-start overflow-hidden border-8 border-[#000000] transition ease-in hover:border-[#6d6d6d] hover:ease-out">
                  {token?.source && (
                    
                  <div className='absolute top-0 left-0 h-24 w-full bg-gradient-to-b from-black to-background-opacity-0 col-span-full'>
                                      <div className='absolute top-4 left-4 h-8 w-8 font-press-start'>Available! 

                    {/* <img
                      className='absolute float-right'
                      src={
                        SOURCE_ID &&
                        token?.source &&
                        SOURCE_ID === token?.source
                          ? NAVBAR_LOGO
                          : `https://api.reservoir.tools/redirect/logo/v1?source=${token?.source}`
                      }
                      alt=""
                    />  */}
                    </div>
                    </div>
                  )}
                  {token?.image ? (
                    <img
                      src={optimizeImage(token?.image, 250)}
                      alt={`${token?.name}`}
                      className="w-full"
                      width="250"
                      height="250"
                    />
                  ) : (
                    <div className="relative w-full">
                      <div className="absolute inset-0 grid place-items-center backdrop-blur-lg">
                        <div>
                          <img
                            src={optimizeImage(collectionImage, 250)}
                            alt={`${token?.collection?.name}`}
                            className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-white"
                            width="64"
                            height="64"
                          />
                          <div className="reservoir-h6 text-white">
                            No Content Available
                          </div>
                        </div>
                      </div>
                      <img
                        src={optimizeImage(collectionImage, 250)}
                        alt={`${token?.collection?.name}`}
                        className="aspect-square w-full object-cover"
                        width="250"
                        height="250"
                      />
                    </div>
                  )}
                  <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-black to-background-opacity-0 col-span-full invisible group-hover:visible'>
                  </div>
                  <div className='absolute text-xs invisible group-hover:visible bottom-5 left-3 h-2 w-8 font-press-start'>
                  <ENSName address={token?.owner}></ENSName>
                  {/* <p
                    className="reservoir-subtitle mb-3 overflow-hidden truncate px-4 pt-4 dark:text-white lg:pt-3"
                    title={token?.name || token?.tokenId}
                  >
                    {token?.name || `#${token?.tokenId}`}
                  </p> */}
                  </div>
                  {/* <div className="flex items-center justify-between px-4 pb-4 lg:pb-3">
                    <div>
                      <div className="reservoir-subtitle text-xs text-gray-400">
                        Price
                      </div>
                      <div className="reservoir-h6 dark:text-white">
                        <FormatEth
                          amount={token?.floorAskPrice}
                          logoWidth={7}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="reservoir-subtitle text-xs text-gray-400">
                        Offer
                      </div>
                      <div className="reservoir-h6 dark:text-white">
                        <FormatWEth amount={token?.topBidValue} logoWidth={7} />
                      </div>
                    </div>
                  </div> */}
                </a>
              </li>
            )
          })}
      {didReactEnd &&
        Array(0)
          .fill(null)
          .map((_, index) => {
            if (index === 0) {
              return (
                <LoadingCard viewRef={viewRef} key={`loading-card-${index}`} />
              )
            }
            return <LoadingCard key={`loading-card-${index}`} />
          })}
    </div>
  )
}

export default TokensGrid
