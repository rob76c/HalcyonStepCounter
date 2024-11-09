import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

type ValueProps = {
  label: string;
  value: string;
}

const Value = ({ label, value }: ValueProps) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello!</Text>

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
  },
  label: {
    color: "white",
    fontSize: 20,
  },
  value: {
    fontSize: 55,
    color: "#AFB3BE",
    fontWeight: "500",
  },
});
