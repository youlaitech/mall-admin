import { CouponQuery, CouponPageResult, CouponForm } from "./types";
import request from "@/utils/request";
import { AxiosPromise } from "axios";

/**
 * 获取优惠券分页列表
 *
 * @param queryParams
 */
export function getCouponPage(
  queryParams: CouponQuery
): AxiosPromise<CouponPageResult> {
  return request({
    url: "/mall-sms/api/v1/coupons/page",
    method: "get",
    params: queryParams,
  });
}

/**
 * 获取优惠券表单数据
 *
 * @param id
 */
export function getCouponForm(id: number): AxiosPromise<CouponForm> {
  return request({
    url: "/mall-sms/api/v1/coupons/" + id + "/form_data",
    method: "get",
  });
}

/**
 * 添加优惠券
 *
 * @param data
 */
export function addCoupon(data: CouponForm) {
  return request({
    url: "/mall-sms/api/v1/coupons",
    method: "post",
    data: data,
  });
}

/**
 * 修改优惠券
 *
 * @param id
 * @param data
 */
export function updateCoupon(id: number, data: CouponForm) {
  return request({
    url: "/mall-sms/api/v1/coupons/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 删除优惠券
 *
 * @param ids
 */
export function deleteCoupons(ids: string) {
  return request({
    url: "/mall-sms/api/v1/coupons/" + ids,
    method: "delete",
  });
}
