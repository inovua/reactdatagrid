/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Takes a datasource and creates a data structure that describes the groups.
 * The structure looks like
 * @param Object[] data
 * @param String groupProperty
 */
function getGroups(data, groupProperty = 'group') {
  const groupsConfig = data.reduce(
    (acc, item, index) => {
      const groupTitle = item[groupProperty];
      const currentGroup = acc.groups[acc.currentGroup];

      // there is a new group
      if (groupTitle && groupTitle !== (currentGroup && currentGroup.title)) {
        const newGroup = {
          title: groupTitle,
          indexAjustment: acc.indexAjustment + 1,
        };
        const groupIndex = index + acc.indexAjustment;

        acc.groups[groupIndex] = newGroup;
        acc.currentGroup = groupIndex;
        acc.indexAjustment += 1;
      }

      return acc;
    },
    {
      groups: {},
      currentGroup: 0,
      indexAjustment: 0,
    }
  );

  return groupsConfig.groups;
}

export default getGroups;
