import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps'
import { Entypo  } from '@expo/vector-icons';
import { PermissionsAndroid } from 'react-native';
import * as Location from "expo-location";

import OrderItem from '../components/orderItem'
import orders from '../data/orders'

const screenWidth = Dimensions.get('screen').width
const screenHeight = Dimensions.get('screen').height

const OrdersScreen = () => {
    const bottomSheetRef = useRef(null)
    const snapPoints = useMemo(() => ['12%', '95%'], []);

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
  
    useEffect(() => {
      (async () => {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }, []);
  
    if(!location) 
    return <ActivityIndicator/>
    
    return (
        <GestureHandlerRootView style={styles.gesture}>
            <View style={styles.mapContainer}>
                <MapView style={styles.mapView} 
                    showsUserLocation={true}
                    followsUserLocation={true}
                    showsMyLocationButton={true}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
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
                    {
                        orders.map((order) =>{
                            return (
                            <Marker key={order.id} title={order.Restaurant.name} description={order.Restaurant.address} coordinate={{
                                latitude: order.Restaurant.lat,
                                longitude: order.Restaurant.lng,
                            }}>
                                <View style={{backgroundColor: 'green', padding: 5, borderRadius: 20}}>
                                    <Entypo name="shop" size={24} color="white" />
                                </View>
                            </Marker>
                        )})
                    }
                </MapView>
                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    
                >
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>You're Online</Text>
                        <Text style={styles.greyText}>Available Orders: {orders.length}</Text>
                        <FlatList
                            data={orders}
                            renderItem={({item})=> <OrderItem order={item}/>}
                            style={styles.flatlistContainer}
                        />
                    </View>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    gesture: {
        ...StyleSheet.absoluteFillObject,
        flex:1,
        backgroundColor: 'lightblue'
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    mapView: {
        ...StyleSheet.absoluteFillObject,
        width: screenWidth,
        height: screenHeight,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 10, 
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: 0.5,
        paddingBottom: 5
    },
    greyText: {
        color: 'grey'
    },
    flatlistContainer: {
        paddingTop: 24
    },
})

export default OrdersScreen;
