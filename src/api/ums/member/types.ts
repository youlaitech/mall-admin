/**
 * 会员查询参数类型声明
 */
export interface MemberQuery extends PageQuery {
  nickName?: string;
}

/**
 * 会员分页列表项声明
 */
export interface Member {
  id: string;
  gender: number;
  nickName: string;
  mobile: string;
  birthday?: any;
  avatarUrl: string;
  openid: string;
  sessionKey?: any;
  city: string;
  country: string;
  language: string;
  province: string;
  status: number;
  balance: string;
  deleted: number;
  point: number;
  addressList: Address[];
}

export interface Address {
  id: string;
  memberId: string;
  consigneeName: string;
  consigneeMobile: string;
  province: string;
  city: string;
  area: string;
  detailAddress: string;
  zipCode?: any;
  defaulted: number;
}

/**
 * 会员分页项类型声明
 */
export type MemberPageResult = PageResult<Member[]>;

/**
 * 会员表单类型声明
 */
export interface MemberForm {
  id: number | undefined;
  title: string;
  picUrl: string;
  beginTime: string;
  endTime: string;
  status: number;
  sort: number;
  url: string;
  remark: string;
}
