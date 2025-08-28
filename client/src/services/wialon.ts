import { wialonApi } from "../api/wialonApi";

/** Tiplər (istəsən ayrıca fayla çıxart) */
export interface WialonResourceItem {
  nm: string;
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

/** Sənin JSON strukturuna uyğun axtarış */
export async function fetchResources(): Promise<WialonSearchResponse> {
  const paramsObj = {
    spec: {
      itemsType: "avl_resource",
      propName: "rel_is_account,sys_name",
      propValueMask: "*",
      sortType: "sys_name",
      propType: "",
      or_logic: "0",
    },
    force: 1,
    flags: 5,
    from: 0,
    to: 152,
  };

  const { data } = await wialonApi.get<WialonSearchResponse>("/ajax.html", {
    params: {
      svc: "core/search_items",
      params: paramsObj, // interceptor bunu JSON.stringify edəcək
    },
  });

  return data;
}
