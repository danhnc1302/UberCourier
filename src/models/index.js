// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const TransportationModes = {
  "DRIVING": "DRIVING",
  "BICYCLING": "BICYCLING"
};

const OrderStatus = {
  "NEW": "NEW",
  "COOKING": "COOKING",
  "READY_FOR_PICKUP": "READY_FOR_PICKUP",
  "COMPLETED": "COMPLETED"
};

const { Courier, OrderDish, BasketDish, Order, Basket, User, Dish, Restaurant } = initSchema(schema);

export {
  Courier,
  OrderDish,
  BasketDish,
  Order,
  Basket,
  User,
  Dish,
  Restaurant,
  TransportationModes,
  OrderStatus
};