import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsChanging } from "components/favStore";
import { notifySuccess, notifyError, notifyInfo } from "./toast";

interface FavoriteItem {
  id: string;
  title: string;
  table: string;
  isFavorite: boolean;
}

export const getFavorites = async (): Promise<FavoriteItem[]> => {
  try {
    //  Get favorites from Asyncstore and check if Array, if not -> return empty array to not break code in fetchText
    const jsonValue = await AsyncStorage.getItem("Favorites");
    if (jsonValue) {
      const parsedFavorites = JSON.parse(jsonValue);
      return Array.isArray(parsedFavorites) ? parsedFavorites : [];
    } else {
      return [];
    }
  } catch (e) {
    notifyError(
      "Fehler beim Laden der Favoriten! Bitte überprüfen Sie Ihre Internetverbindung"
    );
    return [];
  }
};
export const storeFavorites = async (
  favorites: FavoriteItem[],
  change: () => void
) => {
  try {
    const jsonValue = JSON.stringify(favorites);
    await AsyncStorage.setItem("Favorites", jsonValue);
    change();
  } catch (e) {
    console.log(e);
    notifyError(
      "Fehler beim Hinzufügen zu den Favoriten! Bitte überprüfen Sie Ihre Internetverbindung"
    );
  }
};

export const updateFavoriteStatus = (
  favorites: FavoriteItem[],
  itemDetails: FavoriteItem,
  isFavorite: boolean
): FavoriteItem[] => {
  return favorites.map((item) =>
    item.id === itemDetails.id && item.table === itemDetails.table
      ? { ...item, isFavorite }
      : item
  );
};
