/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import leftPad from '../utils/leftPad';
import clamp from '../utils/clamp';
import times from '../utils/times';

const isValid = (value, format) => {
  value *= 1;
  return value >= format.min && value <= format.max;
};

const replaceAt = ({ value, index, len = 1, str }) => {
  return value.substring(0, index) + str + value.substring(index + len);
};

const handleArrow = (format, { currentValue, key, dir }) => {
  dir = dir || (key == 'ArrowUp' ? 1 : -1);

  return {
    value: clamp(currentValue * 1 + dir, {
      min: format.min,
      max: format.max,
      circular: true,
    }),
    caretPos: true,
  };
};

const handleArrowLeftPad = (format, config) => {
  const { value, caretPos } = handleArrow(format, config);

  return {
    value: leftPad(value),
    caretPos,
  };
};

const handlePage = (format, config) => {
  config.dir = config.dir || (config.key == 'PageUp' ? 10 : -10);

  return handleArrow(format, config);
};

const handlePageLeftPad = (format, config) => {
  config.dir = config.dir || (config.key == 'PageUp' ? 10 : -10);

  return handleArrowLeftPad(format, config);
};

const handleUpdate = (value, format, { range }) => {
  value *= 1;

  const len = range.end - range.start + 1;
  const pow10 =
    `1${times(3 - len)
      .map(() => '0')
      .join('')}` * 1;
  const modLen = value % pow10;

  let newValue = clamp(value, {
    min: format.min,
    max: format.max,
    circular: false,
  });

  if (pow10 > 1 && value % pow10 == 0) {
    // the user is modifying the millenium or century
    newValue += modLen;
    // so we try to keep the century
    newValue = clamp(newValue, {
      min: format.min,
      max: format.max,
      circular: false,
    });
  }

  return newValue;
};

const handleUnidentified = (format, { event, currentValue, range }) => {
  const newChar = String.fromCharCode(event.which);
  let index = range.start - format.start;

  const caretPos = { start: range.start + 1 };

  if (newChar * 1 != newChar) {
    return {
      preventDefault: false,
      value: currentValue,
    };
  }

  let value;
  let valid;

  value = replaceAt({ value: currentValue, index, str: newChar });
  valid = isValid(value, format);

  if (!valid && index == 0 && newChar == `${format.max}`[0]) {
    valid = true;
    value = format.max;
    caretPos.start++;
  }

  if (!valid) {
    do {
      value =
        times(index)
          .map(() => '0')
          .join('') +
        replaceAt({ value: currentValue, index, str: newChar }).substring(
          index
        );

      valid = isValid(value, format);
      index++;

      if (!valid) {
        caretPos.start++;
      }
    } while (!valid && index <= format.end);
  }

  if (valid) {
    value = handleUpdate(value, format, { range });
  } else {
    const defaultValue = format.default;
    value =
      1 *
      replaceAt({
        value: defaultValue,
        index: defaultValue.length - 1,
        str: newChar,
      });

    if (isValid(value, format)) {
      caretPos.start = format.start + defaultValue.length;
    } else {
      caretPos.start = range.start + 1;
      value = currentValue;
    }
  }

  return {
    value,
    caretPos,
  };
};

const handleUnidentifiedLeftPad = (format, config) => {
  const { value, caretPos, preventDefault } = handleUnidentified(
    format,
    config
  );

  return {
    value: leftPad(value),
    caretPos,
    preventDefault,
  };
};

const handleYearUnidentified = handleUnidentified;

const handleDelete = (format, { range, currentValue, dir }) => {
  dir = dir || 0;

  if (range.start <= format.start && range.end >= format.end) {
    return {
      value: format.default,
      caretPos: true,
    };
  }

  const len = range.end - range.start + 1;
  const str = times(len)
    .map(() => '0')
    .join('');
  const index = range.start - format.start + dir;

  let value = replaceAt({ value: currentValue, index, str, len }) * 1;

  value = leftPad(handleUpdate(value, format, { range }));

  return {
    value,
    caretPos: { start: range.start + (dir < 0 ? -1 : 1) },
  };
};

const handleBackspace = (format, config) => {
  config.dir = -1;
  return handleDelete(format, config);
};

const toggleMeridiem = ({ upper, value }) => {
  if (upper) {
    return value == 'AM' ? 'PM' : 'AM';
  }

  return value == 'am' ? 'pm' : 'am';
};

const handleMeridiemArrow = (format, { currentValue }) => {
  return {
    value: toggleMeridiem({ upper: format.upper, value: currentValue }),
    caretPos: true,
  };
};

const handleMeridiemDelete = (format, { dir, range }) => {
  dir = dir || 0;

  if (range.start <= format.start && range.end >= format.end) {
    return {
      value: format.default,
      caretPos: true,
    };
  }

  return {
    value: format.upper ? 'AM' : 'am',
    caretPos: { start: range.start + (dir < 0 ? -1 : 1) },
  };
};

const handleMeridiemBackspace = (format, config) => {
  config.dir = -1;
  return handleMeridiemDelete(format, config);
};

const getFormats = () => {
  return {
    YYYY: {
      min: 100,
      max: 9999,
      default: '0100',
      handleDelete,
      handleBackspace,
      handleArrow,
      handlePageUp: handlePage,
      handlePageDown: handlePage,
      handleUnidentified: handleYearUnidentified,
    },

    MM: {
      min: 1,
      max: 12,
      default: '01',
      handleDelete,
      handleBackspace,
      handlePageUp: handlePageLeftPad,
      handlePageDown: handlePageLeftPad,
      handleUnidentified: handleUnidentifiedLeftPad,
      handleArrow: handleArrowLeftPad,
    },

    DD: {
      min: 1,
      max: 31,
      default: '01',
      handlePageUp: handlePageLeftPad,
      handlePageDown: handlePageLeftPad,
      handleDelete,
      handleBackspace,
      handleUnidentified: handleUnidentifiedLeftPad,
      handleArrow: handleArrowLeftPad,
    },

    HH: {
      time: true,
      min: 0,
      max: 23,
      default: '00',
      handleDelete,
      handleBackspace,
      handleUnidentified: handleUnidentifiedLeftPad,
      handleArrow: handleArrowLeftPad,
      handlePageUp: handlePageLeftPad,
      handlePageDown: handlePageLeftPad,
    },

    H: {
      time: true,
      min: 0,
      max: 23,
      default: '0',
      handleDelete,
      handleBackspace,
      handleUnidentified: handleUnidentifiedLeftPad,
      handleArrow: handleArrowLeftPad,
      handlePageUp: handlePageLeftPad,
      handlePageDown: handlePageLeftPad,
    },

    kk: {
      time: true,
      min: 1,
      max: 24,
      default: '01',
      handleDelete,
      handleBackspace,
      handleUnidentified: handleUnidentifiedLeftPad,
      handleArrow: handleArrowLeftPad,
      handlePageUp: handlePageLeftPad,
      handlePageDown: handlePageLeftPad,
    },

    k: {
      time: true,
      min: 1,
      max: 24,
      default: '1',
      handleDelete,
      handleBackspace,
      handleUnidentified: handleUnidentifiedLeftPad,
      handleArrow: handleArrowLeftPad,
      handlePageUp: handlePageLeftPad,
      handlePageDown: handlePageLeftPad,
    },

    hh: {
      min: 1,
      max: 12,
      default: '01',
      time: true,
      handleDelete,
      handleBackspace,
      handleUnidentified: handleUnidentifiedLeftPad,
      handleArrow: handleArrowLeftPad,
      handlePageUp: handlePageLeftPad,
      handlePageDown: handlePageLeftPad,
    },

    h: {
      min: 1,
      max: 12,
      default: '1',
      time: true,
      handleDelete,
      handleBackspace,
      handleUnidentified: handleUnidentifiedLeftPad,
      handleArrow: handleArrowLeftPad,
      handlePageUp: handlePageLeftPad,
      handlePageDown: handlePageLeftPad,
    },

    a: {
      time: true,
      length: 2,
      default: 'am',
      handleArrow: handleMeridiemArrow,
      handlePageUp: handleMeridiemArrow,
      handlePageDown: handleMeridiemArrow,
      handleDelete: handleMeridiemDelete,
      handleBackspace: handleMeridiemBackspace,
    },

    A: {
      length: 2,
      time: true,
      default: 'AM',
      upper: true,
      handleArrow: handleMeridiemArrow,
      handlePageUp: handleMeridiemArrow,
      handlePageDown: handleMeridiemArrow,
      handleDelete: handleMeridiemDelete,
      handleBackspace: handleMeridiemBackspace,
    },

    mm: {
      min: 0,
      max: 59,
      default: '00',
      time: true,
      handleDelete,
      handleBackspace,
      handleUnidentified: handleUnidentifiedLeftPad,
      handleArrow: handleArrowLeftPad,
      handlePageUp: handlePageLeftPad,
      handlePageDown: handlePageLeftPad,
    },

    ss: {
      time: true,
      min: 0,
      max: 59,
      default: '00',
      handleDelete,
      handleBackspace,
      handleUnidentified: handleUnidentifiedLeftPad,
      handleArrow: handleArrowLeftPad,
      handlePageUp: handlePageLeftPad,
      handlePageDown: handlePageLeftPad,
    },
  };
};

export { getFormats };

export default getFormats();
