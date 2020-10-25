import request from '@/utils/request'

export function del(path) {
  return request({
    url: '/youlai-admin/files',
    method: 'delete',
    params: { path: path}
  })
}
