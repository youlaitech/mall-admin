import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { OrderPageResult, OrderQuery } from "./types";

/**
 * 获取订单分页列表
 *
 * @param queryParams
 */
export function getOrderPage(
  queryParams: OrderQuery
): AxiosPromise<OrderPageResult> {
  return request({
    url: "/mall-oms/api/v1/orders",
    method: "get",
    params: queryParams,
  });
}

/**
 * 获取订单详情
 *
 * @param orderId
 */
export function getOrderDetail(orderId: number) {
  return request({
    url: "/mall-oms/api/v1/orders/" + orderId,
    method: "get",
  });
}
