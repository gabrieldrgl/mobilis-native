// VansStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Vans from "../pages/Vans";
import VanDetails from "../pages/VanDetails";

const Stack = createStackNavigator();

export default function VansStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Vans" component={Vans} options={{ headerShown: false }} />
      <Stack.Screen name="VanDetails" component={VanDetails} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
