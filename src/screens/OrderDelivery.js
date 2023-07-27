import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 
import { FontAwesome, Fontisto, FontAwesome5  } from '@expo/vector-icons';
import orders from '../data/orders'
const order = orders[0]
const OrderDelivery = () => {
    const bottomSheetRef = useRef(null)
    const snapPoints = useMemo(() => ['12%', '95%'], []);
    return (
        <GestureHandlerRootView style={styles.gesture}>
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            handleIndicatorStyle={{width: 100}}
          >
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.headertext}>14 min</Text>
                    <FontAwesome name="shopping-bag" size={30} color="#3FC060" style={styles.shoppingBag}/>
                    <Text style={styles.headertext}>3.1 km</Text>
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
    }
})

export default OrderDelivery;