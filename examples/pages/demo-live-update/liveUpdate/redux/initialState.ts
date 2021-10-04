export type State = {
  theme?: string;
  state?: any;
  dispatch?: any;
  actions?: any;
  data?: any[];
  cols?: string;
  records?: number;
  updateRecords?: number;
  interval?: number;
  load?: boolean;
  cellSelection?: any;
};

export const initialState: State = {
  theme: 'default-dark',
  data: [],
  cols: 'abcdefghij', //'klmnopqrstuvwxyz',
  records: 1000,
  updateRecords: 1000,
  interval: 1000,
  load: false,
  cellSelection: {},
};
