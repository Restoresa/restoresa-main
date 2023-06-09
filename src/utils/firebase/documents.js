import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";

export const getFoodByRestaurantID = async (restaurantID) => {
  let q = query(
    collection(db, "foods"),
    where("restaurant", "==", restaurantID)
  );

  const querySnapshot = await getDocs(q);
  const foodArray = [];
  querySnapshot.forEach((doc) => {
    foodArray.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return foodArray;
};
