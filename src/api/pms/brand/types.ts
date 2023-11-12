/**
 * 品牌查询参数类型声明
 */
export interface BrandQuery extends PageQuery {
  name?: string;
}

/**
 * 品牌分页列表项声明
 */
export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  sort: number;
}

/**
 * 品牌分页项类型声明
 */
export type BrandPageResult = PageResult<Brand[]>;

/**
 * 品牌表单类型声明
 */
export interface BrandForm {
  id: number | undefined;
  name: string;
  logoUrl: string;
  sort: number;
}
