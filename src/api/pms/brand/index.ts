import { BrandForm, Brand, BrandPageResult, BrandQuery } from "./types";
import request from "@/utils/request";
import { AxiosPromise } from "axios";

/**
 * 获取品牌分页列表
 *
 * @param queryParams
 */
export function getBrandPage(
  queryParams: BrandQuery
): AxiosPromise<BrandPageResult> {
  return request({
    url: "/mall-pms/api/v1/brands/page",
    method: "get",
    params: queryParams,
  });
}

/**
 * 获取品牌列表
 *
 * @param queryParams
 */
export function getBrandList(queryParams?: BrandQuery): AxiosPromise<Brand[]> {
  return request({
    url: "/mall-pms/api/v1/brands",
    method: "get",
    params: queryParams,
  });
}

/**
 * 获取品牌详情
 *
 * @param id
 */
export function getBrandFormDetail(id: number): AxiosPromise<BrandForm> {
  return request({
    url: "/mall-pms/api/v1/brands/" + id,
    method: "get",
  });
}

/**
 * 添加品牌
 *
 * @param data
 */
export function addBrand(data: BrandForm) {
  return request({
    url: "/mall-pms/api/v1/brands",
    method: "post",
    data: data,
  });
}

/**
 * 修改品牌
 *
 * @param id
 * @param data
 */
export function updateBrand(id: number, data: BrandForm) {
  return request({
    url: "/mall-pms/api/v1/brands/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 删除品牌
 *
 * @param ids
 */
export function deleteBrands(ids: string) {
  return request({
    url: "/mall-pms/api/v1/brands/" + ids,
    method: "delete",
  });
}
