import React, { useState, useContext, useEffect, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "../components/CustomAlert";
// import API
import { keys } from "../config/apiUrl";
const StocksContext = createContext();
export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);
  async function addStock_API(state) {
    const url_update = `${keys.API_URL}/api/updates`;
    let email = await AsyncStorage.getItem("email");
    let token = await AsyncStorage.getItem("token");
    await AsyncStorage.setItem("watchList", JSON.stringify(state));
    try {
      let res = await fetch(url_update, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ email: `${email}`, data: state }),
      });
      let data = await res.json();
    } catch (e) {
      console.log("Client cannot connect to the sever");
    }
  }
  useEffect(async () => {
    addStock_API(state);
  }, [state]);
  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};
export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);
  useEffect(async () => {
    getDataAPI();
  }, []);
  async function getDataAPI() {
    const url_getData = `${keys.API_URL}/api/stock`;
    let token = await AsyncStorage.getItem("token");
    let email = await AsyncStorage.getItem("email");
    try {
      let res = await fetch(url_getData, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        // accpet from user
        body: JSON.stringify({ email: `${email}` }),
      });
      let data = await res.json();
      console.log(data);
      if (data.error === true) {
        console.log(`${data.message}`);
      } else {
        console.log(`${data.stock}`);
        console.log(data);
        if (data.stock !== false) {
          let stringData = data.stock.map((x) => x.stockData);
          let pStringData = JSON.stringify(stringData).replace(/\\/g, "");
          let ppStringData = pStringData
            .substring(2)
            .substring(0, pStringData.substring(2).length - 2);
          let listData = JSON.parse(ppStringData);
          if (listData === null) {
            console.log("no value in side");
          } else {
            setState(listData);
          }
        } else {
          console.log("There is no data stroe");
          return;
        }
      }
    } catch (e) {
      try {
        //// for load data from Async storage
        let watAsyn = await AsyncStorage.getItem("watchList");
        if (watAsyn.length == []) {
          console.log("There is no stock has been stroe for the user");
        } else {
          setState([watAsyn]);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
  // can put more code hereN
  function addToWatchlist(stockData) {
    setState((s) => {
      if (s.includes(stockData)) {
        return [...s];
      } else {
        s.push(stockData);
        return [...s];
      }
    });
  }
  function deleteFromWatchlist(stockSymbol) {
    console.log(stockSymbol);
    setState((s) => {
      s = s.filter((stock) => stock.symbol != stockSymbol);
      return [...s];
    });
  }
  function cleanWatchlist() {
    AsyncStorage.clear();
    setState([]);
  }
  //FixMe: add the new symbol to the watchlist, save it in useStockContext state and persist to AsyncStorage
  // console.log(JSON.stringify(state));
  return {
    ServerURL: "http://131.181.190.87:3001",
    watchList: state,
    addToWatchlist,
    deleteFromWatchlist,
    cleanWatchlist,
  };
};
