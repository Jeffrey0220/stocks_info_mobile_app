import React, { useEffect, useState } from "react";
import CustomAlert from "../components/CustomAlert";

function useHistoricalMonthlyPriceApi(search) {
  const [loadingM, setLoadingM] = useState(true);
  const [historicalMonthlyPrice, setHistoricalMonthlyPrice] = useState([]);
  const [errorM, setErrorM] = useState(null);
  const API_KEY =process.env.REACT_APP_API_KEY3; 
  //to fetch monthly historical price of chosen stock
  async function getHistoricalMonthlyPrice(search) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${search}&apikey=${API_KEY}`;
    let res = await fetch(url);
    let data = await res.json();
    let timePrices = await data["Monthly Time Series"];
    console.log(timePrices);
    const prices = Object.values(timePrices);
    const times = Object.keys(timePrices);

    const rowDatas = [];
    for (let i = 0; i < prices.length; i++) {
      rowDatas.push({
        date: times[i],
        open: prices[i]["1. open"],
        high: prices[i]["2. high"],
        low: prices[i]["3. low"],
        close: prices[i]["4. close"],
        volume: prices[i]["5. volume"],
      });
    }
    console.log(rowDatas);

    return rowDatas;
  }

  useEffect(() => {
    (async () => {
      try {
        setHistoricalMonthlyPrice(await getHistoricalMonthlyPrice(search));
        setLoadingM(false);
      } catch (err) {
        setErrorM(errorM);
        setLoadingM(false);
        CustomAlert("API sever not response 😢");
      }
    })();
  }, [search]);

  return { loadingM, historicalMonthlyPrice, errorM };
}

export default useHistoricalMonthlyPriceApi;
