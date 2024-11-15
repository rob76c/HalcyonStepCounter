import AppleHealthKit, { HealthInputOptions, HealthKitPermissions, HealthUnit,} from "react-native-health";
import { useEffect, useState } from "react";
import appleHealthKit from "react-native-health";
import { Platform } from "react-native";

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

const useHealthData = (date:Date) => {
    const [hasPermissions, setHasPermissions] = useState(false);
  const [steps, setSteps]= useState(0);
  const [flights, setFlights]= useState(0);
  const[distance,setDistance]= useState(0);
  useEffect (() => {
    if (Platform.OS!== 'ios') {
      return;
    }
   AppleHealthKit.isAvailable((err, isAvailable) => {
    if(err) {
      console.log('Error getting permissions')
      return;
    }
    if(!isAvailable) {
      console.log('Apple Health not available');
      return;
    }
    AppleHealthKit.initHealthKit(permissions, (err) => {
      if (err) {
        console.log('Error getting permissions');
        return;
      }
      setHasPermissions(true);

    });
   });

  }, [])

  useEffect (()=> {
    if (!hasPermissions) {
      return;
    }
    const options: HealthInputOptions ={
      date: date.toISOString(),
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

  return {
    steps,
    flights,
    distance,
  };
};
export default useHealthData;