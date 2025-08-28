export interface WialonResourceItem {
  nm: string; // ad (name)
  cls: number;
  id: number;
  crt: number;
  bact: number;
  mu: number;
  bpact: number;
  uacl: number;
}

export interface WialonSearchResponse {
  searchSpec: {
    itemsType: string;
    propName: string;
    propValueMask: string;
    sortType: string;
    propType: string;
    or_logic: string;
  };
  dataFlags: number;
  totalItemsCount: number;
  indexFrom: number;
  indexTo: number;
  items: WialonResourceItem[];
}
