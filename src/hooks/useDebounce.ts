import { useEffect, useState } from "react"

//han che call api lien tuc khi go lien tuc vao o search
export const useDebounce = (value: any, delay: number) => {
    const [debounceValue, setDebounceValue] = useState<string>('')
    useEffect(() => {
        const timeref = setTimeout(() => setDebounceValue(value), delay)
    }, [value, delay])
    return debounceValue
}