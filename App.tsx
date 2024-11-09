import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Value from "./src/componenets/value";
import RingProgress from "./src/componenets/RingProgress";

export default function App() {
  return (
    <View style={styles.container}>
    <RingProgress progress= {0.75}/>

      <View style={styles.values}>
        <Value label="Steps" value="1233" />
        <Value label="Distance" value=".5km" />
        <Value label="Flights Climbed" value="5" />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    padding: 12,
  },
  values: {
    flexDirection: 'row',
    gap: 25,
    flexWrap: 'wrap',
    marginTop: 100,
  },
});
