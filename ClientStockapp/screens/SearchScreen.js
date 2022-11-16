import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard /* include other react native components here as needed */,
} from "react-native";

import { useStocksContext } from "../contexts/StocksContext";

import ListItem from "../components/ListItem";
import useCompanyApi from "../apis/CompanyApi";
import CustomAlert from "../components/CustomAlert";

export default function SearchScreen({ navigation }) {
  const [choose, setChoose] = useState(null);

  const { ServerURL, watchList, addToWatchlist } = useStocksContext();
  const [filterData, setfilterData] = useState([]);
  const [masterData, setmasterData] = useState([]);
  const [search, setSearch] = useState("");

  let watchListSymbols = watchList.map((a) => a.symbol);

  //fetch Nasdaq 100 stocks data for searching purpose
  useEffect(() => {
    fetchStockData();
  }, []);

  //fetch Nasdaq 100 stocks data for searching purpose
  const fetchStockData = () => {
    const API_KEY = `d5c8d1b31e007be468b929cb49029618`; //.bf186a537bcf074adc5473d7be793521--7ec131ab714b8a9e7d682e789a17c5eb-d5c8d1b31e007be468b929cb49029618--daef25f05857f085d0ee147532c044e4
    const url = `https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${API_KEY}`;
    fetch(url)
      .then((res) => res.json())
      .then((resJson) => {
        // setfilterData(resJson);
        setmasterData(resJson);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //to fetch stock data which include name, symbol, price and change percentage and put into watchlist
  async function getCompanyDatas(stockSymbol) {
    const API_KEY = `d5c8d1b31e007be468b929cb49029618`;
    const url = `https://financialmodelingprep.com/api/v3/quote/${stockSymbol}?apikey=${API_KEY}`;
    let res = await fetch(url);
    let data = await res.json();
    console.log(data);

    addToWatchlist({
      name: data[0].name,
      symbol: data[0].symbol,
      price: data[0].price,
      changesPercentage: data[0].changesPercentage,
    });
  }

  //search filter
  const searchFilter = (text) => {
    if (text) {
      const newData = masterData.filter((item) => {
        const itemData = item.symbol
          ? item.symbol.toUpperCase()
          : "".toUpperCase();
        const textDate = text.toUpperCase();
        return itemData.indexOf(textDate) > -1;
      });
      setfilterData(newData);
      setSearch(text);
    } else {
      setfilterData([]);
      setSearch(text);
    }
  };
  //by pressing symbol add to watchlist and avoid duplicate
  const pressHandler = async (symbol) => {
    if (watchListSymbols.includes(symbol) || symbol === choose) {
      CustomAlert("This stock is in your watchlist already 👋");
    } else {
      await getCompanyDatas(symbol);
      setChoose(symbol);

      navigation.navigate("Stocks");
    }
  };

  //format searching results
  const ItemView = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => pressHandler(item.symbol.toUpperCase())}>
        <View style={styles.leftWrapper}>
          <View style={styles.titlesWrapper}>
            <Text style={styles.title}>{item.symbol.toUpperCase()}</Text>
            <Text style={styles.subtitle}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <>
        <TextInput
          style={styles.input}
          value={search}
          placeholder="Search by symbol"
          placeholderTextColor="#a7aaad"
          onChangeText={(text) => searchFilter(text)}
        />

        <ScrollView>
          {filterData.map((item) => (
            <ItemView key={item.symbol} item={item} />
          ))}
        </ScrollView>
      </>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  leftWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  titlesWrapper: {
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    color: "white",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#A9ABB1",
  },

  input: {
    height: 39,
    borderWidth: 1,
    paddingLeft: 10,
    margin: 5,
    borderColor: "#009688",
    backgroundColor: "white",
  },
});
