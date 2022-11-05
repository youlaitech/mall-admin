import request from '@/utils/request';
import { AxiosPromise } from 'axios';

/**
 * 【普通流控】获取数据
 * @returns
 */
export function getFlowLimitingData(): AxiosPromise<string> {
  return request({
    url: '/youlai-lab/api/v1/sentinel/flow_limiting/data',
    method: 'get',
  });
}

/**
 * 【网关流控-RouteID】获取数据
 * @returns
 */
export function getGatewayRouteFlowLimitingData(): AxiosPromise<string> {
  return request({
    url: '/youlai-lab/api/v1/sentinel/gateway_route_flow_limiting/data',
    method: 'get',
  });
}

/**
 * 【网关流控-API分组】获取数据
 * @returns
 */
export function getGatewayApiFlowLimitingData(): AxiosPromise<string> {
  return request({
    url: '/youlai-lab/api/v1/sentinel/gateway_api_flow_limiting/data',
    method: 'get',
  });
}
