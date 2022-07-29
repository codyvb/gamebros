import { FC, ReactElement, useEffect, useState } from 'react'
import ConnectWallet from './ConnectWallet'
import HamburgerMenu from './HamburgerMenu'
import dynamic from 'next/dynamic'
import { paths } from '@reservoir0x/client-sdk'
import setParams from 'lib/params'
import NavbarLogo from 'components/navbar/NavbarLogo'

const SearchCollections = dynamic(() => import('./SearchCollections'))
const CommunityDropdown = dynamic(() => import('./CommunityDropdown'))
const EXTERNAL_LINKS = process.env.NEXT_PUBLIC_EXTERNAL_LINKS || null
const COLLECTION = process.env.NEXT_PUBLIC_COLLECTION
const COMMUNITY = process.env.NEXT_PUBLIC_COMMUNITY

function getInitialSearchHref() {
  const PROXY_API_BASE = process.env.NEXT_PUBLIC_PROXY_API_BASE
  const pathname = `${PROXY_API_BASE}/search/collections/v1`
  const query: paths['/search/collections/v1']['get']['parameters']['query'] =
    {}

  if (COMMUNITY) {
    query.community = COMMUNITY
  }

  return setParams(pathname, query)
}

const Navbar: FC = () => {
  const [filterComponent, setFilterComponent] = useState<ReactElement | null>(
    null
  )

  const externalLinks: { name: string; url: string }[] = []

  if (typeof EXTERNAL_LINKS === 'string') {
    const linksArray = EXTERNAL_LINKS.split(',')

    linksArray.forEach((link) => {
      let values = link.split('::')
      externalLinks.push({
        name: values[0],
        url: values[1],
      })
    })
  }

  const hasExternalLinks = externalLinks.length > 0

  const isGlobal = !COMMUNITY && !COLLECTION
  const filterableCollection = isGlobal || COMMUNITY

  useEffect(() => {
    if (filterableCollection) {
      const href = getInitialSearchHref()

      fetch(href).then(async (res) => {
        let initialResults = undefined

        if (res.ok) {
          initialResults =
            (await res.json()) as paths['/search/collections/v1']['get']['responses']['200']['schema']
        }

        const smallCommunity =
          initialResults?.collections &&
          initialResults.collections.length >= 2 &&
          initialResults.collections.length <= 10

        if (COMMUNITY && smallCommunity) {
          setFilterComponent(
            <CommunityDropdown collections={initialResults?.collections} />
          )
        } else {
          setFilterComponent(
            <SearchCollections
              communityId={COMMUNITY}
              initialResults={initialResults}
            />
          )
        }
      })
    }
  }, [filterableCollection])

  return (
    <nav className="visible top-0 md:absolute w-full bg-gradient-to-b from-black to-background-opacity-0 z-50 col-span-full  justify-between py-6 gap-2 px-6 md:gap-3 md:pt-12 md:py-6 md:px-16 sm:py-6">
      {/* <div className="hidden md:flex w-1/3 justify-left">
      <button className="font-pixeloid text-xs bg-transparent mr-2 hover:bg-slate-500 text-slate-50 font-semibold hover:text-white py-2 px-4 border border-slate-800 hover:border-transparent rounded">
        OpenSea
      </button>
      <button className="font-pixeloid text-xs bg-transparent mr-2 hover:bg-slate-500 text-slate-50 font-semibold hover:text-white py-2 px-4 border border-slate-800 hover:border-transparent rounded">
        Discord
      </button>
      <button className="font-pixeloid text-xs bg-transparent mr-2 hover:bg-slate-500 text-slate-50 font-semibold hover:text-white py-2 px-4 border border-slate-800 hover:border-transparent rounded">
        Twitter
      </button>
      </div> */}
      <div className='flex w-1/3 justify-left'>
      <NavbarLogo className="z-10" />
      </div>
      <div className='hidden'>
      <HamburgerMenu externalLinks={externalLinks} />
      </div>
      <div className="z-10 ml-auto hidden md:flex w-1/3 justify-end">
        {/* <ConnectWallet /> */}
        
{/* 
      <button className="font-pixeloid text-xs bg-transparent mr-2 hover:bg-slate-500 text-slate-50 font-semibold hover:text-white py-2 px-4 border border-slate-800 hover:border-transparent rounded">
        Leaderboard
      </button>
      <button className="font-pixeloid text-xs bg-transparent mr-2 hover:bg-slate-500 text-slate-50 font-semibold hover:text-white py-2 px-4 border border-slate-800 hover:border-transparent rounded">
        Drops
      </button> */}
      </div>
    </nav>
  )
}

export default Navbar
