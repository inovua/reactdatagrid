/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import assign from '../../../../common/assign';
import FORMATS from './formats';
import { TypeFormats, TypeSuggestions } from './types';

const SUGGESTIONS: TypeSuggestions = {
  Y: ['YYYY', 'YY'],
  M: ['MM'],
  D: ['DD'],
  H: ['HH'],
  h: ['hh'],
  k: ['kk'],
  m: ['mm'],
  s: ['ss'],
};

const parseFormat = (format: string) => {
  let index = 0;
  let positionIndex = 0;

  let suggestions;
  let suggestionMatch;

  const positions = [];
  const matches = [];

  while (index < format.length!) {
    const char = format[index];
    const match = FORMATS[char as keyof TypeFormats];
    let matchObject;

    suggestionMatch = null;
    suggestions = SUGGESTIONS[char as keyof TypeSuggestions];

    if (!match && !suggestions) {
      positions[positionIndex] = char;
      matches.push(char);
    } else {
      if (suggestions && suggestions.length) {
        // it might be a longer match
        suggestionMatch = suggestions.filter(
          s => format.substr(index, s.length) == s
        )[0];
      }

      if (!suggestionMatch) {
        if (!FORMATS[char as keyof TypeFormats]) {
          console.warn(`Format ${char} is not supported yet!`);
          if (suggestions) {
            console.warn(`Use one of ["${suggestions.join(',')}"]`);
          }
          positions[positionIndex] = char;
          matches.push(char);
        } else {
          // we found a match, with no other suggestion

          const currentFormat = FORMATS[char as keyof TypeFormats];
          let start = positionIndex;
          const end = positionIndex + (currentFormat.length || 1) - 1;

          matchObject = assign({}, currentFormat, { format: char, start, end });

          for (; start <= end; start++) {
            positions[positionIndex] = matchObject;
            positionIndex++;
          }
          index++;
          matches.push(matchObject);
          continue; // to skip incrementing twice
        }
      } else {
        matchObject = assign(
          {},
          FORMATS[suggestionMatch as keyof TypeFormats],
          {
            format: suggestionMatch,
            start: positionIndex,
          }
        );
        matches.push(matchObject);

        const endIndex = positionIndex + suggestionMatch.length;

        matchObject.end = endIndex - 1;
        while (positionIndex < endIndex) {
          positions[positionIndex] = matchObject;
          positionIndex++;
          index++;
        }
        continue; // to skip incrementing index once more
      }
    }

    positionIndex++;
    index++;
  }

  return { positions, matches };
};

export default parseFormat;
