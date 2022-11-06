import request from '@/utils/request';
import { SeataForm } from './types';

/**
 * 订单支付
 * @returns
 */
export function payOrder(data: SeataForm) {
  return request({
    url: '/laboratory/api/v1/seata/order/_pay',
    method: 'post',
    data: data,
  });
}

/**
 * 获取Seata模拟数据(包括订单信息、商品信息、会员余额信息)
 * @returns
 */
export function getSeataData() {
  return request({
    url: '/laboratory/api/v1/seata/data',
    method: 'get',
  });
}

/**
 * 重置Seata模拟数据
 * @returns
 */
export function resetSeataData() {
  return request({
    url: '/laboratory/api/v1/seata/data/_reset',
    method: 'put',
  });
}
