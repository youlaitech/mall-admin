/**
 * Seata表单类型声明
 */
export interface SeataForm {
  memberId: number;
  skuId: number;
  amount: number;
  openTx: boolean;
  openEx: boolean;
}
