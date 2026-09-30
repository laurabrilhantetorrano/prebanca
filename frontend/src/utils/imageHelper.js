import produto1 from "../assets/produto1.png";
import produto2 from "../assets/produto2.png";
import produto3 from "../assets/produto3.png";
import produto4 from "../assets/produto4.png";
import produto5 from "../assets/produto5.jpeg";
import produto6 from "../assets/produto6.jpeg";
import produto7 from "../assets/produto7.jpeg";
import produto8 from "../assets/produto8.jpeg";

const localImageMap = {
  "/src/assets/produto1.png": produto1,
  "/src/assets/produto2.png": produto2,
  "/src/assets/produto3.png": produto3,
  "/src/assets/produto4.png": produto4,
  "/src/assets/produto5.jpeg": produto5,
  "/src/assets/produto6.jpeg": produto6,
  "/src/assets/produto7.jpeg": produto7,
  "/src/assets/produto8.jpeg": produto8,
  "1": produto1,
  "2": produto2,
  "3": produto3,
  "4": produto4,
  "5": produto5,
  "6": produto6,
  "7": produto7,
  "8": produto8
};

export const resolverImagemProduto = (item) => {
  if (!item) return produto1;
  const src = item.img || item.image;
  if (localImageMap[src]) return localImageMap[src];
  if (item.id && localImageMap[item.id]) return localImageMap[item.id];
  return src || produto1;
};
