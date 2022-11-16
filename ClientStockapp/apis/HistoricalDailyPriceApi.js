import React, { useEffect, useState } from "react";
import CustomAlert from "../components/CustomAlert";

function useHistoricalDailyPriceApi(search) {
  const [loadingD, setLoadingD] = useState(true);
  const [historicalDailyPrice, setHistoricalDailyPrice] = useState([]);
  const [errorD, setErrorD] = useState(null);
  const API_KEY = `Q0UX9HMH0Y7RDAG3`; //alternative:`0CHJ7V4OV6Q5YKON,Q0UX9HMH0Y7RDAG3`
  //to fetch daily historical price of chosen stock
  async function getHistoricalDailyPrice(search) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${search}&apikey=${API_KEY}`;
    let res = await fetch(url);
    let data = await res.json();
    let timePrices = await data["Time Series (Daily)"];

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
        setHistoricalDailyPrice(await getHistoricalDailyPrice(search));
        setLoadingD(false);
      } catch (err) {
        setErrorD(errorD);
        setLoadingD(false);
        CustomAlert("API sever not response 😢");
      }
    })();
  }, [search]);

  return { loadingD, historicalDailyPrice, errorD };
}

export default useHistoricalDailyPriceApi;
