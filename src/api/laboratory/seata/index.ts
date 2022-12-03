import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SeataForm } from './types';

/**
 * 购买商品
 */
export function purchaseGoods(data: SeataForm): AxiosPromise<string> {
  return request({
    url: '/laboratory/api/v1/seata/_purchase',
    method: 'post',
    data: data,
  });
}

/**
 * 获取Seata模拟数据(包括订单信息、商品信息、会员余额信息)
 */
export function getSeataData() {
  return request({
    url: '/laboratory/api/v1/seata/data',
    method: 'get',
  });
}

/**
 * 重置数据
 */
export function resetSeataData() {
  return request({
    url: '/laboratory/api/v1/seata/data/_reset',
    method: 'put',
  });
}
