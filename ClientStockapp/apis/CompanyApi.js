import React, { useEffect, useState } from "react";

function useCompanyApi(choose) {
  const [loading, setLoading] = useState(true);
  const [companyDatas, setCompanyDatas] = useState([]);
  const [error, setError] = useState(null);
  const API_KEY = `7ec131ab714b8a9e7d682e789a17c5eb`; // `Q0UX9HMH0Y7RDAG3`;7ec131ab714b8a9e7d682e789a17c5eb--.d5c8d1b31e007be468b929cb49029618
  //to fetch stock data which include name, symbol, price and change percentage
  async function getCompanyDatas(choose) {
    const url = `https://financialmodelingprep.com/api/v3/quote/${choose}?apikey=${API_KEY}`;
    let res = await fetch(url);
    let data = await res.json();
    console.log(data);

    return {
      name: data[0].name,
      symbol: data[0].symbol,
      price: data[0].price,
      changesPercentage: data[0].changesPercentage,
    };
  }

  useEffect(() => {
    (async () => {
      try {
        setCompanyDatas(await getCompanyDatas(choose));
        setLoading(false);
      } catch (err) {
        setError(error);
        setLoading(false);
      }
    })();
  }, [choose]);
  return { loading, companyDatas, error: null };
}

export default useCompanyApi;
