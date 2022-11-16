import React, { useEffect, useState } from "react";
import CustomAlert from "../components/CustomAlert";

function useHistoricalWeeklyPriceApi(search) {
  const [loadingW, setLoadingW] = useState(true);
  const [historicalWeeklyPrice, setHistoricalWeeklyPrice] = useState([]);
  const [errorW, setErrorW] = useState(null);
  const API_KEY = `Q0UX9HMH0Y7RDAG3`; //alternative:`0CHJ7V4OV6Q5YKON`Q0UX9HMH0Y7RDAG3
  //to fetch weekly historical price of chosen stock
  async function getHistoricalWeeklyPrice(search) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${search}&apikey=${API_KEY}`;
    let res = await fetch(url);
    let data = await res.json();
    let timePrices = await data["Weekly Time Series"];
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
        setHistoricalWeeklyPrice(await getHistoricalWeeklyPrice(search));
        setLoadingW(false);
      } catch (err) {
        setErrorW(errorW);
        setLoadingW(false);
        CustomAlert("API sever not response 😢");
      }
    })();
  }, [search]);

  return { loadingW, historicalWeeklyPrice, errorW };
}

export default useHistoricalWeeklyPriceApi;
