import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('screen').width

const OrderItem = ({order}) => {
  const navigation = useNavigation()

  const handleOrderSelected = () => {
    navigation.navigate('OrderDelivery', {id: order.id})
  }
  return (
      <TouchableOpacity style={styles.container} onPress={handleOrderSelected}>
        <Image source={{uri: order.Restaurant.image}} style={styles.image}/>
        <View style={styles.info}>
          <View>
            <Text style={styles.restaurantName}>{order.Restaurant.name}</Text>
            <Text style={styles.greyText}>{order.Restaurant.address}</Text>
          </View>
          <View>
            <Text style={styles.text}>Delivery Detail:</Text>
            <Text style={styles.greyText}>{order.User.name}</Text>
            <Text style={styles.greyText}>{order.User.address}</Text>
          </View>
        </View>
        <View style={styles.check}>
          <Entypo name="check" size={24} color="black" />
        </View>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth -10 ,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 10,
    alignSelf: 'center'
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10
  },
  info: {
    justifyContent: 'space-between',
    marginLeft: 6,
    flex: 1
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  greyText: {
    color: 'grey'
  },
  check: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    paddingHorizontal: 4,
  }
});


export default OrderItem;