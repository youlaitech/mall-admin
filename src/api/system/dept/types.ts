/**
 * 部门查询参数
 */
export interface DeptQuery {
  keywords: string | undefined;
  status: number | undefined;
}

/**
 * 部门类型
 */
export interface DeptType {
  id: string;
  name: string;
  parentId: string;
  treePath: string;
  sort: number;
  status: number;
  leader?: string;
  mobile?: string;
  email?: string;
  children: DeptType[];
}

/**
 * 部门表单类型
 */
export interface DeptForm {
  id?: string;
  parentId: string;
  name: string;
  sort: number;
  status: number;
}
