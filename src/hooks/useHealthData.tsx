import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
  HealthUnit,
} from "react-native-health";
import { useEffect, useState, Reducer, useReducer } from "react";
import appleHealthKit from "react-native-health";
import { Platform } from "react-native";
import {
  initialize,
  requestPermission,
  readRecords,
} from "react-native-health-connect";
import { TimeRangeFilter } from "react-native-health-connect/lib/typescript/types/base.types";

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.FlightsClimbed,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
    ],
    write: [],
  },
};

const useHealthData = (date: Date) => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [steps, setSteps] = useState(0);
  const [flights, setFlights] = useState(0);
  const [distance, setDistance] = useState(0);
  useEffect(() => {
    //IOS - Healthkit
    if (Platform.OS !== "ios") {
      return;
    }
    AppleHealthKit.isAvailable((err, isAvailable) => {
      if (err) {
        console.log("Error getting permissions");
        return;
      }
      if (!isAvailable) {
        console.log("Apple Health not available");
        return;
      }
      AppleHealthKit.initHealthKit(permissions, (err) => {
        if (err) {
          console.log("Error getting permissions");
          return;
        }
        setHasPermissions(true);
      });
    });
  }, []);

  useEffect(() => {
    if (!hasPermissions) {
      return;
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0); // Reset to start of the day
    const options: HealthInputOptions = {
      date: startOfDay.toISOString(),
      includeManuallyAdded: false,
      unit: HealthUnit.meter,
    };

    AppleHealthKit.getStepCount(options, (err, results) => {
      if (err) {
        console.log("Error getting the steps");
        return;
      }
      setSteps(results.value);
    });

    AppleHealthKit.getFlightsClimbed(options, (err, results) => {
      if (err) {
        console.log("Error getting the steps", err);
        return;
      }
      setFlights(results.value);
    });

    AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
      if (err) {
        console.log("Error getting the steps", err);
        return;
      }
      setDistance(results.value);
    });
  }, [hasPermissions]);

  //Android - Health Connect
  const readSampleData = async () => {
    // initialize the client
    const isInitialized = await initialize();
    if (!isInitialized) {
      return;
    }

    // request permissions
    await requestPermission([
      { accessType: "read", recordType: "Steps" },
      { accessType: "read", recordType: "Distance" },
      { accessType: "read", recordType: "FloorsClimbed" },
    ]);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0); // Set time to the start of the day in local timezone
    const endOfDay = new Date(date); 
    endOfDay.setHours(23, 59, 59, 999); // Set time to the end of the day

    const timeRangeFilter: TimeRangeFilter = {
      operator: "between",
      startTime: startOfDay.toISOString(),
      endTime: endOfDay.toISOString(),
    };

    //Steps
    const steps = await readRecords("Steps", { timeRangeFilter });
    const totalSteps = steps.records.reduce((sum, cur) => sum + cur.count, 0);
    setSteps(totalSteps);

    //Distance
    const distance = await readRecords("Distance", { timeRangeFilter });
    const totalDistance = distance.records.reduce((sum, cur) => sum + cur.distance.inMeters, 0);
    setDistance(totalDistance);

    //Floors Climbed
    const floorsClimbed = await readRecords("FloorsClimbed", {
      timeRangeFilter,
    });
    const totalFloors = floorsClimbed.records.reduce((sum, cur) => sum + cur.floors, 0);
    setFlights(totalFloors);
  };
  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }
    readSampleData();
  });

  return {
    steps,
    flights,
    distance,
  };
};
export default useHealthData;
