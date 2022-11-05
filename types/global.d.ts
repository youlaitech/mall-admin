declare global {
  /**
   * 弹窗类型
   */
  interface DialogType {
    title: string;
    visible: boolean;
  }

  /**
   * 下拉项
   */
  interface OptionType {
    value: string;
    label: string;
    checked?: boolean;
    children?: OptionType[];
  }

  interface PageQuery {
    pageNum: number;
    pageSize: number;
  }

  interface PageResult<T> {
    list: T;
    total: number;
  }
}

export {};
