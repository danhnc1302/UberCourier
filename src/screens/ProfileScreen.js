import { View, Text, TextInput, StyleSheet, Button, Alert, SafeAreaView, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Auth, DataStore } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";
import { useAuthContext } from "../contexts/AuthContext";
import { Courier, TransportationModes  } from '../models'
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const ProfileScreen = () => {
  
    const { sub, setDbCourier, dbCourier } = useAuthContext()
    const [name, setName] = useState(dbCourier?.name || "");
    const [transportationMode, setTransportationMode] = useState(
      TransportationModes.DRIVING
    );
    
    const navigation = useNavigation()

    const onSave = async () => {
      if(dbCourier) {
        await updateCourier()
      } else {
        await createCourier()
      }
      navigation.navigate('OrdersScreen') 
    };

    const updateCourier = async () => {
      const courier = await DataStore.save(
        Courier.copyOf(dbCourier, (updated) => {
          updated.name = name;
          updated.transportationMode = transportationMode;
        })
      )
      setDbCourier(courier)
    }

    const createCourier = async  () => {
      try {
        const courier = await DataStore.save(new Courier({
          name, 
          address, 
          lat: 0, 
          lng: 0, 
          sub,
          transportationMode,
        }))
        setDbCourier(courier)
      } catch (e) {
        Alert.alert("Error", e.massage)
      }
    }
   
    return (
      <SafeAreaView>
        <Text style={styles.title}>Profile</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          style={styles.input}
        />
        <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() => setTransportationMode(TransportationModes.BICYLING)}
          style={{
            backgroundColor:
              transportationMode === TransportationModes.BICYLING
                ? "#3FC060"
                : "white",
            margin: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 10,
          }}
        >
          <MaterialIcons name="pedal-bike" size={40} color="black" />
        </Pressable>
        <Pressable
          onPress={() => setTransportationMode(TransportationModes.DRIVING)}
          style={{
            backgroundColor:
              transportationMode === TransportationModes.DRIVING
                ? "#3FC060"
                : "white",
            margin: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 10,
          }}
        >
          <FontAwesome5 name="car" size={40} color="black" />
        </Pressable>
      </View>
        <Button onPress={onSave} title="Save" />
        <Text
          onPress={() => Auth.signOut()}
          style={{ textAlign: "center", color: "red", margin: 10 }}
        >
          Sign out
        </Text>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    title: {
      fontSize: 30,
      fontWeight: "bold",
      textAlign: "center",
      margin: 10,
    },
    input: {
      margin: 10,
      backgroundColor: "white",
      padding: 15,
      borderRadius: 5,
    },
  });

export default ProfileScreen;