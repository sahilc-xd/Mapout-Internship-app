import { useEffect, useState } from "react";
// import { RAPID_API_KEY } from "@env";

// const rapidKey = RAPID_API_KEY;

const useFetch = (apiCall) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  setIsLoading(true);
  try {

    const response = apiCall();
    console.log("loog : " , response);
    setData(response.data.data);
  } catch (error) {
    setError(error);
    alert("Something Went Wrong");
  } finally {
    setIsLoading(false);
  }

  return { data, isLoading, error, refetch };
};

export default useFetch;
