/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

export const computeSummary = (dataArray, config) => {
  const columnsMap = config.columnsMap || {};
  if (
    (config.groupSummaryReducer || config.groupColumnSummaryReducers) &&
    Array.isArray(dataArray)
  ) {
    const columnsWithSummaries = Object.keys(
      config.groupColumnSummaryReducers || {}
    ).filter(colName => !!columnsMap[colName]);
    const result = dataArray.reduce(
      (acc, item, index, arr) => {
        if (acc.groupSummary !== undefined) {
          acc.groupSummary = config.groupSummaryReducer.reducer(
            acc.groupSummary,
            item,
            index,
            arr
          );
        }
        if (acc.groupColumnSummaries !== undefined) {
          acc.groupColumnSummaries = columnsWithSummaries.reduce(
            (acc, colName) => {
              const fn = config.groupColumnSummaryReducers[colName].reducer;
              acc[colName] = fn(acc[colName], item[colName], index, arr);
              return acc;
            },
            acc.groupColumnSummaries
          );
        }
        return acc;
      },
      {
        groupSummary:
          config.groupSummaryReducer && config.groupSummaryReducer.reducer
            ? config.groupSummaryReducer.initialValue
            : undefined,
        groupColumnSummaries: columnsWithSummaries.length
          ? columnsWithSummaries.reduce((acc, colName) => {
              if (config.groupColumnSummaryReducers[colName]) {
                acc[colName] =
                  config.groupColumnSummaryReducers[colName].initialValue;
              }
              return acc;
            }, {})
          : undefined,
      }
    );
    if (
      result.groupSummary !== undefined &&
      config.groupSummaryReducer &&
      config.groupSummaryReducer.complete
    ) {
      result.groupSummary = config.groupSummaryReducer.complete(
        result.groupSummary,
        dataArray
      );
    }
    if (result.groupColumnSummaries) {
      result.groupColumnSummaries = Object.keys(
        result.groupColumnSummaries
      ).reduce((acc, colName) => {
        const value = acc[colName];
        if (
          config.groupColumnSummaryReducers[colName] &&
          typeof config.groupColumnSummaryReducers[colName].complete ==
            'function'
        ) {
          acc[colName] = config.groupColumnSummaryReducers[colName].complete(
            value,
            dataArray
          );
        }
        return acc;
      }, result.groupColumnSummaries);
    }
    return result;
  }
};
