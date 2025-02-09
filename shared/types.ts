// Types partagés entre React Native et Vue.js
export interface Plat {
  id: string;
  nom: string;
  tps_cuisson: number;
  prix: number;
}

export interface CartItem extends Plat {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
}
