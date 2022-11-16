import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  FlatList,
  StyleSheet,
  View,
  TouchableHighlight /* include other react-native components here as needed */,
} from "react-native";

import { useStocksContext } from "../contexts/StocksContext";
import { scaleSize } from "../constants/Layout";

import ListItem from "../components/ListItem";

export default function StocksScreen({ navigation }) {
  const { ServerURL, watchList, addToWatchlist, deleteFromWatchlist } =
    useStocksContext();

  //navigate to Chart screen
  const pressHandler = (symbol) => {
    navigation.navigate("Trends", { symbol: symbol });
  };

  //delete from watchlist
  const longPressHandler = (symbol) => {
    deleteFromWatchlist(symbol);
  };

  return (
    <ScrollView>
      {watchList
        .filter((stock) => isNaN(Number(stock.price)) === false)
        .map((stock) => {
          return (
            <ListItem
              key={stock.symbol}
              name={stock.name}
              symbol={stock.symbol}
              currentPrice={stock.price}
              priceChangePercentage7d={stock.changesPercentage}
              onPress={() => pressHandler(stock.symbol)}
              onLongPress={() => longPressHandler(stock.symbol)}
            />
          );
        })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
