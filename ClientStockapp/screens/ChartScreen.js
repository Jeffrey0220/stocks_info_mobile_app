import { LineChart } from "react-native-chart-kit";
import { Appbar } from "react-native-paper";
import { View, Text, ScrollView, Dimensions, StyleSheet } from "react-native";
import React, { useState } from "react";
import useHistoricalDailyPriceApi from "../apis/HistoricalDailyPriceApi";
import useHistoricalWeeklyPriceApi from "../apis/HistoricalWeeklyPriceApi";
import useHistoricalMonthlyPriceApi from "../apis/HistoricalMonthlyPriceApi";
import { TouchableOpacity } from "react-native-gesture-handler";
import useStockNewsPriceApi from "../apis/StockNewsApi";
import PaperCard from "../components/PaperCard";

const ChartScreen = ({ route }) => {
  //fetch chosen stock's news data
  const { loadingN, stockNews, errorN } = useStockNewsPriceApi(
    route.params?.symbol
  );

  //fetch chosen stock's daily historical price data
  const { loadingD, historicalDailyPrice, errorD } = useHistoricalDailyPriceApi(
    route.params?.symbol
  );
  //fetch chosen stock's weekly historical price data
  const { loadingW, historicalWeeklyPrice, errorW } =
    useHistoricalWeeklyPriceApi(route.params?.symbol);

  //fetch chosen stock's monthly historical price data
  const { loadingM, historicalMonthlyPrice, errorM } =
    useHistoricalMonthlyPriceApi(route.params?.symbol);

  //make a state for time range of historical price
  const [timeRange, setTimeRange] = useState("daily");

  //format historical price data to fit the chart module
  let labelDataD = historicalDailyPrice
    .map((a) => a.date.substr(0, 7))
    .filter((x, i, a) => a.indexOf(x) == i);

  let priceDataD = historicalDailyPrice.map((a) => a.close);

  let labelDataW = historicalWeeklyPrice
    .map((a) => a.date.substr(0, 4))
    .filter((x, i, a) => a.indexOf(x) == i)
    .filter((x, i, a) => a.indexOf(x) % 2 == 0);

  let priceDataW = historicalWeeklyPrice.map((a) => a.close);

  let labelDataM = historicalMonthlyPrice
    .map((a) => a.date.substr(0, 4))
    .filter((x, i, a) => a.indexOf(x) == i)
    .filter((x, i, a) => a.indexOf(x) % 2 == 0);

  let priceDataM = historicalMonthlyPrice.map((a) => a.close);

  //by change time range state to display different historical price data
  const onPressHandlerD = () => {
    setTimeRange("daily");
  };
  const onPressHandlerW = () => {
    setTimeRange("weekly");
  };
  const onPressHandlerM = () => {
    setTimeRange("monthly");
  };

  const labelData = {
    daily: labelDataD,
    weekly: labelDataW,
    monthly: labelDataM,
  };

  const priceData = {
    daily: priceDataD,
    weekly: priceDataW,
    monthly: priceDataM,
  };

  const loading = {
    daily: loadingD,
    weekly: loadingW,
    monthly: loadingM,
  };

  const error = {
    daily: errorD,
    weekly: errorW,
    monthly: errorM,
  };

  if (loading[timeRange]) {
    return <Text>loading...</Text>;
  }
  if (error[timeRange]) {
    return <Text>Someting went wrong: {error[timeRange].message}</Text>;
  }

  return (
    <>
      <Text style={{ color: "white", fontSize: 33, fontWeight: "bold" }}>
        {route.params?.symbol}
      </Text>

      <View style={styles.table}>
        <View style={styles.subtable}>
          <View>
            <Text style={styles.label}>Open</Text>
            <Text style={styles.label}>Close</Text>
          </View>
          <View>
            <Text style={styles.data}>
              $
              {historicalDailyPrice
                ? Number(historicalDailyPrice[0].open).toFixed(2)
                : null}
            </Text>
            <Text style={styles.data}>
              $
              {historicalDailyPrice
                ? Number(historicalDailyPrice[0].close).toFixed(2)
                : null}
            </Text>
          </View>
        </View>

        <View style={styles.subtable}>
          <View>
            <Text style={styles.label}>High</Text>
            <Text style={styles.label}>Low</Text>
          </View>

          <View>
            <Text style={styles.data}>
              $
              {historicalDailyPrice
                ? Number(historicalDailyPrice[0].high).toFixed(2)
                : null}
            </Text>
            <Text style={styles.data}>
              $
              {historicalDailyPrice
                ? Number(historicalDailyPrice[0].low).toFixed(2)
                : null}
            </Text>
          </View>
        </View>
      </View>
      <Text style={{ color: "#ffa726", padding: 3 }}>
        Historial Price Trend Chart
      </Text>
      <LineChart
        data={{
          labels: labelData[timeRange].reverse(),
          datasets: [
            {
              data: priceData[timeRange].reverse(),
            },
          ],
        }}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        fromZero="true"
        segments={5}
        yAxisLabel="$"
        yAxisSuffix=""
        yAxisInterval={3} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
          propsForHorizontalLabels: {
            fontSize: "13",
            x: "55",
          },
          propsForVerticalLabels: {
            fontSize: "11",
          },
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 13,
          },
          propsForDots: {
            r: "0",
            strokeWidth: "1",
            stroke: "#ffa726",
          },
        }}
        bezier
        style={{
          marginVertical: 7,

          borderRadius: 7,
        }}
      />
      <View style={styles.time}>
        <TouchableOpacity onPress={() => onPressHandlerD()}>
          <Text style={styles.subtitle}>Daily</Text>
        </TouchableOpacity>
        <Text style={styles.subtitle}>|</Text>
        <TouchableOpacity onPress={() => onPressHandlerW()}>
          <Text style={styles.subtitle}>Weekly</Text>
        </TouchableOpacity>
        <Text style={styles.subtitle}>|</Text>
        <TouchableOpacity onPress={() => onPressHandlerM()}>
          <Text style={styles.subtitle}>Monthly</Text>
        </TouchableOpacity>
      </View>

      <Appbar.Header>
        <Appbar.Content
          title={`News of ${route.params?.symbol}`}
          subtitle={"Current 3 days news"}
        />
      </Appbar.Header>
      <ScrollView>
        {stockNews.map((stock) => {
          return (
            <PaperCard
              key={JSON.stringify(stock.title)}
              title={JSON.stringify(stock.title)}
              content={JSON.stringify(stock.content)}
              image={stock.image}
              url={stock.url}
            />
          );
        })}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  time: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#72aee6",
    margin: 3,
    padding: 5,
    borderRadius: 7,
  },
  subtitle: {
    fontWeight: "bold",
  },
  table: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    margin: 7,
  },
  subtable: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginRight: 33,
  },
  data: {
    color: "white",
    fontWeight: "bold",
  },
  label: {
    color: "#a7aaad",
    fontWeight: "bold",
    marginRight: 17,
  },
});

export default ChartScreen;
