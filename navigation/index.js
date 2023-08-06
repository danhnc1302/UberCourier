import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OrdersScreen from '../src/screens/OrdersScreen'
import OrderDelivery from '../src/screens/OrderDelivery'
import ProfileScreen from '../src/screens/ProfileScreen'
import { useAuthContext } from '../src/contexts/AuthContext'
const Stack = createNativeStackNavigator()

const Navigation = () => {
    const {dbCourier} = useAuthContext()
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
           {dbCourier ? (
            <>
                <Stack.Screen name='OrdersScreen' component={OrdersScreen}/>
                <Stack.Screen name='OrderDelivery' component={OrderDelivery}/>
            </>
           ) : (
            <>
                <Stack.Screen name='ProfileScreen' component={ProfileScreen}/>
            </>
           )}
        </Stack.Navigator>
    )
}

export default Navigation;