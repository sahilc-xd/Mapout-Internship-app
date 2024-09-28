import React, { useEffect, useState } from 'react';

const usePagination=(searchValue, searchResult=[], pagesize=20, initialPage = 1)=>{
    const [data, setData] = useState([]);
    const [page, setPage] = useState(initialPage);
    const [loadingMoreData, setLoadingMoreData] = useState(false);
    
    useEffect(()=>{
        setData([]);
        setPage(initialPage);
    },[searchValue])

    useEffect(()=>{
        if(searchResult){
            if(page>initialPage){
                setLoadingMoreData(false);
                setData([...data, ...searchResult]);
            }
            else{
                setLoadingMoreData(false);
                setData([...searchResult]);
            }
        }
        else{
            setLoadingMoreData(false);
        }
    },[searchResult])

    const onReachedEnd=()=>{
        if(initialPage<1){
            if(parseInt(data?.length/pagesize) === 1+page){
                setLoadingMoreData(true);
                setPage((prev) => prev+1);
            }
        }
        else{
            if(parseInt(data?.length/pagesize) === page){
                setLoadingMoreData(true);
                setPage((prev) => prev+1);
            }
        }
    }

    const reset=()=>{
        setData([]);
        setPage(initialPage);
    }

    return {data, page, onReachedEnd, loadingMoreData, reset}
}

export default usePagination;

