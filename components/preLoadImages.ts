// components/preLoadImages.js

import { Asset } from "expo-asset"; 
import { Image } from "react-native"; 

const preloadImages = async () => {
  const imageAssets = [
    require("assets/images/sistani.png"), 
    require("assets/images/khamenei.png"), 
  ].map((image) => Asset.loadAsync(image)); 

  await Promise.all(imageAssets); 
};

export default preloadImages; 
