import React, { useEffect, useState } from 'react';

export default useDebounce = (value, delay)=>{
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setDebounceValue(value);
        }, delay || 500)


        return ()=>{
            clearTimeout(timer);
        }
    },[value, delay])

    return debounceValue;
}