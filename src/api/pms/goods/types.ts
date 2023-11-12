/**
 * 商品查询参数类型声明
 */
export interface GoodsQuery extends PageQuery {
  name?: string;
  categoryId?: number;
}

/**
 * 商品列表项类型声明
 */
export interface Goods {
  id: string;
  name: string;
  categoryId?: any;
  brandId?: any;
  originPrice: string;
  price: string;
  sales: number;
  picUrl?: any;
  album?: any;
  unit?: any;
  description: string;
  detail: string;
  status?: any;
  categoryName: string;
  brandName: string;
  skuList: Sku[];
}

/**
 * 商品规格项类型声明
 */
export interface Sku {
  id: string;
  skuSn?: any;
  name: string;
  spuId?: any;
  specIds: string;
  price: string;
  stockNum: number;
  lockedStockNum?: any;
  picUrl?: any;
}

/**
 * 商品分页项类型声明
 */
export type GoodsPageResult = PageResult<Goods[]>;

/**
 * 商品表单数据类型声明
 */
export interface GoodsDetail {
  id?: string;
  name?: string;
  categoryId?: string;
  brandId?: string;
  originPrice?: number;
  price?: number;
  picUrl?: string;
  album: string[];
  description?: string;
  detail?: string;
  attrList: any[];
  specList: any[];
  skuList: any[];
}
