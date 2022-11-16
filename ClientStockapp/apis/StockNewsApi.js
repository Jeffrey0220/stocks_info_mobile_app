import React, { useEffect, useState } from "react";
import CustomAlert from "../components/CustomAlert";

function useStockNewsPriceApi(search) {
  const [loadingN, setLoadingN] = useState(true);
  const [stockNews, setStockNews] = useState([]);
  const [errorN, setErrorN] = useState(null);
  const API_KEY = `cak8q4aad3ier73m1ga0`; //cak8q4aad3ier73m1ga0--cadm9i2ad3id9vu65rm0

  // to fetch current 3 days news of chosen stock
  async function getStockNews(search) {
    let d = new Date();
    let currentDate = d.toISOString().slice(0, 10);
    let threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    threeDaysAgo = threeDaysAgo.toISOString().slice(0, 10);

    console.log(d);
    console.log(currentDate);
    console.log(threeDaysAgo);
    const url = `https://finnhub.io/api/v1/company-news?symbol=${search}&from=${threeDaysAgo}&to=${currentDate}&token=${API_KEY}`;
    let res = await fetch(url);
    let data = await res.json();
    console.log(data);

    return data.map((data) => {
      return {
        title: data["headline"],
        content: data["summary"],
        image: data["image"],
        url: data["url"],
      };
    });
  }

  useEffect(() => {
    (async () => {
      try {
        setStockNews(await getStockNews(search));
        setLoadingN(false);
      } catch (err) {
        setErrorN(errorN);
        setLoadingN(false);
        CustomAlert("API sever not response 😢");
      }
    })();
  }, [search]);

  return { loadingN, stockNews, errorN };
}

export default useStockNewsPriceApi;
