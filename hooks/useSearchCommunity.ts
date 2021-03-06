import { paths } from '@reservoir0x/client-sdk/dist/types/api'
import fetcher from 'lib/fetcher'
import setParams from 'lib/params'
import useSWR from 'swr'

const PROXY_API_BASE = process.env.NEXT_PUBLIC_PROXY_API_BASE
const COMMUNITY = process.env.NEXT_PUBLIC_COMMUNITY

export default function useSearchCommunity() {
  const pathname = `${PROXY_API_BASE}/search/collections/v1`

  const query: paths['/search/collections/v1']['get']['parameters']['query'] = {
    community: COMMUNITY,
  }

  const href = setParams(pathname, query)

  const collections = useSWR<
    paths['/search/collections/v1']['get']['responses']['200']['schema']
  >(href, fetcher)

  return collections
}
