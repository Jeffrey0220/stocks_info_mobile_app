import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from "react-native";
import React from "react";
import { Appbar, Card, Title, Paragraph } from "react-native-paper";

const PaperCard = ({ url, title, content, image }) => {
  return (
    <Card>
      <Card.Cover
        source={{ uri: image !== "" ? image : "https://picsum.photos/700" }}
      />
      <Card.Content>
        <TouchableOpacity onPress={() => Linking.openURL(url)}>
          <Title>{title}</Title>
        </TouchableOpacity>
        <Paragraph>{content}</Paragraph>
      </Card.Content>
    </Card>
  );
};

export default PaperCard;

const styles = StyleSheet.create({});
