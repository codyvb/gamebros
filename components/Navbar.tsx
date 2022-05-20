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
    <nav className="top-0 sticky bg-gradient-to-b from-black to-background-opacity-0 z-50 col-span-full flex items-center justify-between py-6 gap-2 px-6 md:gap-3 md:pt-12 md:py-6 md:px-16 sm:py-6">
      <NavbarLogo className="z-10" />
      <div className="flex h-full w-full items-center justify-center">
        <div className="absolute left-0 z-[1] flex w-full justify-center">
          {filterComponent && filterComponent}
          {hasExternalLinks && (
            <div className="ml-12 hidden items-center gap-11 lg:flex">
              {externalLinks.map(({ name, url }) => (
                <a
                  key={url}
                  href={url}
                  rel="noopener noferrer"
                  className="text-dark reservoir-h6 hover:text-[#1F2937] dark:text-white"
                >
                  {name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <HamburgerMenu externalLinks={externalLinks} />
      <div className="z-10 ml-auto hidden shrink-0 md:block">
        {/* <ConnectWallet /> */}
        
      <button className="bg-transparent mr-2 hover:bg-slate-500 text-slate-50 font-semibold hover:text-white py-2 px-4 border border-slate-500 hover:border-transparent rounded">
        About
      </button>
      <button className="bg-transparent mr-2 hover:bg-slate-500 text-slate-50 font-semibold hover:text-white py-2 px-4 border border-slate-500 hover:border-transparent rounded">
        Leaderboard
      </button>
      <button className="bg-transparent mr-2 hover:bg-slate-500 text-slate-50 font-semibold hover:text-white py-2 px-4 border border-slate-500 hover:border-transparent rounded">
        Merch
      </button>
      <button className="bg-transparent mr-2 hover:bg-slate-500 text-slate-50 font-semibold hover:text-white py-2 px-4 border border-slate-500 hover:border-transparent rounded">
        OpenSea
      </button>
      <button className="bg-transparent mr-2 hover:bg-slate-500 text-slate-50 font-semibold hover:text-white py-2 px-4 border border-slate-500 hover:border-transparent rounded">
        Discord
      </button>
      <button className="bg-transparent mr-2 hover:bg-slate-500 text-slate-50 font-semibold hover:text-white py-2 px-4 border border-slate-500 hover:border-transparent rounded">
        Twitter
      </button>
      </div>
    </nav>
  )
}

export default Navbar
