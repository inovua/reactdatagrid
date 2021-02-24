/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
export default (groups, props) => {
    const map = groups.reduce((acc, group) => {
        if (group.name) {
            acc[group.name] = { ...group };
        }
        return acc;
    }, {});
    if (props.showWarnings) {
        groups.forEach(group => {
            if (group.group && !map[group.group]) {
                console.error(`You have referred group "${group.group}", but it is not defined in your groups prop.`);
            }
        });
    }
    Object.keys(map).map(groupName => {
        let count = -1;
        let group;
        let itGroupName = groupName;
        while ((group = map[itGroupName])) {
            count++;
            itGroupName = group.group;
            if (!itGroupName) {
                break;
            }
        }
        map[groupName].computedDepth = count;
    });
    return map;
};
