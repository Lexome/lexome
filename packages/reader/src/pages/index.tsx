import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Row } from '@style-kit-n/web'
import { useQuery } from '@tanstack/react-query'


const BOOKS_QUERY_KEY = 'books_query'

const useBooks = (queryString: string) => {
  return useQuery({
    queryKey: [
      BOOKS_QUERY_KEY,
      queryString
    ],
    queryFn: () => {
      fetch(`/api/books?${queryString}`).then((res) => res.json())
    }
  )
})

export default Home = () => {
  return (
    <>
      <div>test</div> 
    </>
  ) 
}
