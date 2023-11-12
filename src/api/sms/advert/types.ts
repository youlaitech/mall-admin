/**
 * 广告查询参数类型
 */
export interface AdvertQuery extends PageQuery {
  keywords: string;
}

/**
 * 广告分页列表项
 */
export interface Advert {
  id: string;
  name: string;
  logoUrl: string;
  sort: number;
}

/**
 * 广告分页项类型
 */
export type AdvertPageResult = PageResult<Advert[]>;

/**
 * 广告表单类型
 */
export interface AdvertForm {
  id?: number;
  title: string;
  picUrl: string;
  beginTime: string;
  endTime: string;
  status: number;
  sort: number;
  url: string;
  remark: string;
}
