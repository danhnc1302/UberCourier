import React, { useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 
import { FontAwesome, Fontisto, FontAwesome5  } from '@expo/vector-icons';
import { PermissionsAndroid } from 'react-native';
import * as Location from "expo-location";
import MapView, { Marker } from 'react-native-maps'
import { Entypo, MaterialIcons  } from '@expo/vector-icons';
import MapViewDirections from 'react-native-maps-directions';

import orders from '../data/orders'

const screenWidth = Dimensions.get('screen').width
const screenHeight = Dimensions.get('screen').height
const order = orders[0]
const ORDERS_STATUSES = {
    READY_FOR_PICKUP: 'READY_FOR_PICKUP',
    ACCEPTED: 'ACCEPTED',
    PICKED_UP: 'PICKED_UP'
}
const OrderDelivery = () => {
    const bottomSheetRef = useRef(null)
    const snapPoints = useMemo(() => ['12%', '95%'], []);

    const [dirverLocation, setDriverLocation] = useState(null);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [totalKm, setTotalKm] = useState(0);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setDriverLocation(location);
        })();

        Location.watchPositionAsync({
            accuracy: Location.Accuracy.High,
            distanceInterval: 100
        }, (updatedLocation) => {
            setDriverLocation(updatedLocation)
        })
       
      }, []);
    
      if(!dirverLocation) 
      return <ActivityIndicator style={{justifyContent: 'center', alignItems: 'center'}}/>

    return (
        <GestureHandlerRootView style={styles.gesture}>
             <MapView style={styles.mapView} 
                    showsUserLocation={true}
                    followsUserLocation={true}
                    showsMyLocationButton={true}
                    initialRegion={{
                        latitude: dirverLocation.coords.latitude,
                        longitude: dirverLocation.coords.longitude,
                        latitudeDelta: 0.07,
                        longitudeDelta: 0.07,
                      }}
                      onMapReady={async () => {
                        PermissionsAndroid.request(
                          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                        ).then(granted => {
                          alert(granted ? 'Location permission granted' : 'Location permission denied');
                        });
                      }}
                >
                    <MapViewDirections
                        origin={`${dirverLocation.coords.latitude},${dirverLocation.coords.longitude}`}
                        destination={{latitude: order.User.lat, longitude: order.User.lng}}
                        strokeWidth={10}
                        waypoints={[`${order.Restaurant.lat},${order.Restaurant.lng}`]}
                        strokeColor='#3FC060'
                        apikey={"AIzaSyDKQXK6xPDeYO0jKbDMzeTmI2lmJTlJCVY"}
                        onReady={(result) => {
                            setTotalMinutes(result.duration)
                            setTotalKm(result.distance)
                        }}
                    />
                    <Marker key={order.Restaurant.id} title={order.Restaurant.name} description={order.Restaurant.address} coordinate={{
                        latitude: order.Restaurant.lat,
                        longitude: order.Restaurant.lng,
                    }}>
                        <View style={{backgroundColor: 'green', padding: 5, borderRadius: 20}}>
                            <Entypo name="shop" size={24} color="white" />
                        </View>
                    </Marker>
                    <Marker key={order.User.id} title={order.User.name} description={order.User.address} coordinate={{
                        latitude: order.User.lat,
                        longitude: order.User.lng,
                    }}>
                        <View style={{backgroundColor: 'green', padding: 5, borderRadius: 20}}>
                            <MaterialIcons name="restaurant" size={24} color="white" />
                        </View>
                    </Marker>
                </MapView>
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            handleIndicatorStyle={{width: 100}}
          >
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.headertext}>{totalMinutes.toFixed(0)} min</Text>
                    <FontAwesome name="shopping-bag" size={30} color="#3FC060" style={styles.shoppingBag}/>
                    <Text style={styles.headertext}>{totalKm.toFixed(1)} km</Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.restaurantName}>{order.Restaurant.name}</Text>
                    <View style={styles.address}>
                        <View style={styles.icon}>
                            <Fontisto name="shopping-store" size={24} color="grey" />
                        </View>
                            <Text style={styles.greyText}>{order.Restaurant.address}</Text>
                    </View>
                    <View style={styles.address}>
                        <View style={styles.icon}>
                            <FontAwesome5 name="map-marker-alt" size={24} color="grey" />
                        </View>
                            <Text style={styles.greyText}>{order.User.address}</Text>
                    </View>
                    <View style={styles.separate}></View>
                    <Text style={styles.greyText}>Onion Rings x1</Text>
                    <Text style={styles.greyText}>Big Mac x3</Text>
                    <Text style={styles.greyText}>Big Tasty x2</Text>
                    <Text style={styles.greyText}>Coca-Cola x1</Text>
                </View>
                <TouchableOpacity style={styles.acceptBtn}>
                    <Text style={styles.btnText}>Accept Order</Text>
                </TouchableOpacity>

            </View>
          </BottomSheet>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    gesture: {
        flex:1,
        backgroundColor: 'lightblue'
    },
    contentContainer: {
        flex:1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,

    },
    body: {
        flex: 1,
        padding: 10
    },
    headertext: {
        fontSize: 25,
        letterSpacing: 1
    },
    shoppingBag: {
        paddingHorizontal: 8
    },
    address: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        padding: 5,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    separate: {
        width: '100%',
        height: 2,
        backgroundColor: '#EEEEEE',
        marginVertical: 10
    },
    greyText: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        color: 'grey'
    },
    restaurantName: {
        fontSize: 22,
        fontWeight: '500',
        letterSpacing: 1,
        paddingVertical: 10
    },
    acceptBtn: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3FC060',
        margin: 20,
        borderRadius: 10
    },
    btnText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#DDDDDD'
    },
    mapView: {
        ...StyleSheet.absoluteFillObject,
        width: screenWidth,
        height: screenHeight,
    },
})

export default OrderDelivery;