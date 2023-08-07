import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Alert, SafeAreaView, Pressable } from "react-native";
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
        console.log("1")
      } else {
        await createCourier()
        console.log("2")
      }
      console.log("2")
      navigation.navigate("OrdersScreen")
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
          onPress={() => setTransportationMode(TransportationModes.BICYCLING)}
          style={{
            backgroundColor:
              transportationMode === TransportationModes.BICYCLING
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
        <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 10, width: '100%', backgroundColor: 'blue'}} onPress={onSave} >
          <Text style={{fontWeight: 'bold', color: 'white'}}>SAVE</Text>
        </TouchableOpacity> 
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