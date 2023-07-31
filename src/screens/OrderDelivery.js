import React, { useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 
import { FontAwesome, Fontisto, FontAwesome5  } from '@expo/vector-icons';
import { PermissionsAndroid } from 'react-native';
import * as Location from "expo-location";
import MapView, { Marker } from 'react-native-maps'
import { Entypo, MaterialIcons, Ionicons } from '@expo/vector-icons';
import MapViewDirections from 'react-native-maps-directions';
import { useNavigation } from '@react-navigation/native';

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
    const mapRef = useRef(null)
    const snapPoints = useMemo(() => ['12%', '95%'], []);
    const navigation = useNavigation()
    const [driverLocation, setDriverLocation] = useState(null);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [totalKm, setTotalKm] = useState(0);
    const [activeOrder, setActiveOrder] = useState(null);
    const [deliveryStatus, setDeliveryStatus] = useState(ORDERS_STATUSES.READY_FOR_PICKUP);
    const [isDriverClose, setIsDriverClose] = useState(false)

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
    
    if(!driverLocation) 
    return <ActivityIndicator style={{justifyContent: 'center', alignItems: 'center'}}/>

    const onButtonPressed = () => {
        if(deliveryStatus === ORDERS_STATUSES.READY_FOR_PICKUP) {
            bottomSheetRef.current?.collapse()
            mapRef.current.animateToRegion({
                latitude: driverLocation.coords.latitude,
                longitude: driverLocation.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            })
            setDeliveryStatus(ORDERS_STATUSES.ACCEPTED)
        }
        if(deliveryStatus === ORDERS_STATUSES.ACCEPTED) {
            bottomSheetRef.current?.collapse()
            setDeliveryStatus(ORDERS_STATUSES.PICKED_UP)
        }
        if(deliveryStatus === ORDERS_STATUSES.PICKED_UP) {
            bottomSheetRef.current?.collapse()
            console.warn("Delivery Finished")
        }
    }

    const renderButtonTitle = () => {
        if(deliveryStatus === ORDERS_STATUSES.READY_FOR_PICKUP) {
            return 'Accept Order'
        }
        if(deliveryStatus === ORDERS_STATUSES.ACCEPTED) {
            return 'Pick-up Order'
        }
        if(deliveryStatus === ORDERS_STATUSES.PICKED_UP) {
            return 'Complete Delivery'
        }
    }

    const isButtonDisabled = () => {
        if(deliveryStatus === ORDERS_STATUSES.READY_FOR_PICKUP) {
            return false
        }
        if(deliveryStatus === ORDERS_STATUSES.ACCEPTED && isDriverClose) {
            return false
        }
        if(deliveryStatus === ORDERS_STATUSES.PICKED_UP && isDriverClose) {
            return false
        }
        return true
    }

    return (
        <GestureHandlerRootView style={styles.gesture}>
             <MapView 
                    ref={mapRef}
                    style={styles.mapView} 
                    showsUserLocation={true}
                    followsUserLocation={true}
                    showsMyLocationButton={true}
                    initialRegion={{
                        latitude: driverLocation.coords.latitude,
                        longitude: driverLocation.coords.longitude,
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
                        origin={`${driverLocation.coords.latitude},${driverLocation.coords.longitude}`}
                        destination={deliveryStatus === ORDERS_STATUSES.ACCEPTED 
                            ? {latitude: order.Restaurant.lat, longitude: order.Restaurant.lng} 
                            : {latitude: order.User.lat, longitude: order.User.lng}}
                        strokeWidth={10}
                        waypoints={deliveryStatus === ORDERS_STATUSES.READY_FOR_PICKUP 
                            ? [`${order.Restaurant.lat},${order.Restaurant.lng}`]
                            : []
                        }
                        strokeColor='#3FC060'
                        apikey={"AIzaSyDKQXK6xPDeYO0jKbDMzeTmI2lmJTlJCVY"}
                        onReady={(result) => {
                            setIsDriverClose(result.distance <= 0.1)
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
                {
                 deliveryStatus === ORDERS_STATUSES.READY_FOR_PICKUP && (
                    <Ionicons 
                        onPress={() => navigation.goBack()}
                        name="arrow-back-circle"
                        size={45}
                        color="black"
                        style={{top: 40, left: 15, position: 'absolute'}}
                    />
                 )
                }
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
                <TouchableOpacity onPress={onButtonPressed} style={[styles.acceptBtn, {backgroundColor: isButtonDisabled() ? 'grey' : '#3FC060'}]} disabled={isButtonDisabled()}>
                    <Text style={styles.btnText}>{renderButtonTitle()}</Text>
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