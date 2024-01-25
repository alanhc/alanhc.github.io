import * as React from 'react'
import Head from 'next/head'

import { ExtendedRecordMap } from 'notion-types'
import { getPageTitle } from 'notion-utils'
import { NotionRenderer } from 'react-notion-x'
import { useColorMode } from '@chakra-ui/react'

export const NotionPage = ({
  recordMap,
  rootPageId,
  colorMode
}: {
  recordMap: ExtendedRecordMap
  rootPageId?: string
  colorMode?: string
}) => {
  if (!recordMap) {
    return null
  }

  const title = getPageTitle(recordMap)
  console.log(title, recordMap)
  return (
    <>
      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        darkMode={colorMode !== 'light'}
        rootPageId={rootPageId}
      />
    </>
  )
}
