import EthAccount from 'components/EthAccount'
import useDetails from 'hooks/useDetails'
import Link from 'next/link'
import { FC } from 'react'
import {ENSName} from 'react-ens-name'
import NavbarLogo from 'components/navbar/NavbarLogo'
import { useRouter } from 'next/router'
import { toggleOffItem, toggleOnItem, lastToken } from 'lib/router'
import React, { useState, useEffect } from 'react';





type Props = {
  details: ReturnType<typeof useDetails>
}


const Owner: FC<Props> = ({ details }) => {
  const token = details.data?.tokens?.[0]
  const router = useRouter()


  const owner =
    token?.token?.kind === 'erc1155' && token?.market?.floorAsk?.maker
      ? token?.market?.floorAsk?.maker
      : token?.token?.owner

      
  return (
    
    <div className="col-span-full md:w-[400px] mb-10">
     <div className='hidden md:block md:mb-5'>
            <NavbarLogo className="z-10" />
      </div> 
      <article className="col-span-full md:border border-gray-300 bg-white p-6 dark:border-neutral-600 dark:bg-black">
      <button onClick={() => lastToken(router, 'token', `${(Math.floor( Math.random( ) * 187) + 1)}` )}>
      <img
        src="/arrowwhite.svg"
        alt="arrow"
        width="25"
        height="25"
        className='inline-block mb-5'
      />
        <img
        src="/arrowwhiteright.svg"
        alt="arrow"
        width="25"
        height="25"
        className='inline-block ml-5 mb-5'
      />


      </button>
        <div className=" mb-6 overflow-hidden dark:text-white font-press-start">
          {token?.token?.name || `#${token?.token?.tokenId}`}
        </div>

        {/* {token?.token?.kind === 'erc1155' && (
          <div className="mb-4 flex justify-evenly">
            <div className="flex items-center gap-2">
              <FiUsers className="h-4 w-4" />
              <span className="reservoir-h5 ">Owners</span>
            </div>
            <div className="flex items-center gap-2">
              <FiDatabase className="h-4 w-4" />
              <span className="reservoir-h5 ">Total</span>
            </div>
          </div>
        )} */}

        <div className="mb-2 dark:text-white font-press-start">
          Held by{' '}
        {owner && (
          <Link href={`/address/${owner}`}>
            <a className="inline-block">
            <ENSName address={token?.token?.owner}></ENSName>

            </a>
          </Link>
        )}
        </div>

      </article>
    </div>
  )
}

export default Owner
