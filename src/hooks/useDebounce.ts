// debounce⇒跳ね返り
import { useEffect, useState } from 'react'

const useDebounce = (query: string, delay: number) => {
  const [debounceValue, setDebounceValue] = useState(query)

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounceValue(query)
    }, delay)

    return () => {
      clearTimeout(id)
    }
  }, [delay, query])

  return debounceValue
}

export default useDebounce
