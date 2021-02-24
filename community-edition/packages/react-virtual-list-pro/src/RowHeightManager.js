/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import binarySearch from '../../../packages/binary-search';
import EventEmitter from 'events';
const sortAsc = (a, b) => a - b;
class RowHeightManager extends EventEmitter {
    constructor(rowHeight, rowHeightsMap = {}, config) {
        super();
        this.__id = '';
        this.rowHeight =
            typeof rowHeight === 'object'
                ? typeof rowHeight.rowHeight === 'number'
                    ? rowHeight.rowHeight
                    : rowHeight.minRowHeight || 40
                : 40;
        this.map = rowHeightsMap;
        if (typeof rowHeight === 'object' &&
            typeof rowHeight.rowHeight === 'function') {
            this.rowHeightFn = rowHeight.rowHeight;
        }
        if (!config || config.cache !== false) {
            this.setCache({});
        }
        this.index(this.rowHeight, rowHeightsMap);
    }
    setRowHeight({ index, height, defaultRowHeight, skipIndex, }) {
        if (this.map[index] === height && !defaultRowHeight) {
            console.warn('NOOP');
            return;
        }
        this.map[index] = height;
        if (defaultRowHeight) {
            this.rowHeight = defaultRowHeight;
        }
        if (this.cache) {
            this.setCache({});
        }
        if (!skipIndex) {
            this.index();
        }
    }
    indexRaf() {
        if (this.lazyRowHeightRafId) {
            cancelAnimationFrame(this.lazyRowHeightRafId);
            this.lazyRowHeightRafId = 0;
        }
        this.lazyRowHeightRafId = requestAnimationFrame(() => {
            this.lazyRowHeightRafId = 0;
            this.index();
        });
    }
    setRowHeightLazy({ index, height, defaultRowHeight, }) {
        this.setRowHeight({
            index,
            height,
            defaultRowHeight: defaultRowHeight || this.rowHeight,
            skipIndex: true,
        });
        this.indexRaf();
    }
    setHeights(map) {
        this.map = map;
        if (this.cache) {
            this.setCache({});
        }
        this.index(this.rowHeight, this.map);
    }
    setValues({ defaultRowHeight, map, }) {
        if (defaultRowHeight) {
            this.rowHeight = defaultRowHeight;
        }
        if (this.map) {
            this.map = map;
        }
        if (this.cache) {
            this.setCache({});
        }
        this.index(this.rowHeight, this.map);
    }
    setDefaultRowHeight(defaultRowHeight) {
        this.rowHeight = defaultRowHeight;
        if (this.cache) {
            this.setCache({});
        }
        this.index(this.rowHeight, this.map);
    }
    index(defaultRowHeight = this.rowHeight, map = this.map) {
        this.rowToOffsetCache = {};
        const indexes = map
            ? Object.keys(map)
                .map(x => +x)
                .sort(sortAsc)
            : [];
        this.minHeight = defaultRowHeight;
        this.maxHeight = defaultRowHeight;
        this.__id = JSON.stringify(this.heights);
        this.heights = indexes.map(index => {
            const height = map[index];
            if (height > this.maxHeight) {
                this.maxHeight = height;
            }
            if (height < this.minHeight) {
                this.minHeight = height;
            }
            return height;
        });
        let prev = 0;
        this.indexes = indexes;
        this.offsets = indexes.map((index, i) => {
            const prevIndex = i === 0 ? -1 : indexes[i - 1];
            const prevIndexRowHeight = map[prevIndex] || 0;
            return (prev =
                prev +
                    (index - (prevIndex + 1)) * defaultRowHeight +
                    prevIndexRowHeight);
        });
        this.offsetsToIndexes = {};
        this.indexesToOffsets = this.offsets.reduce((acc, offset, i) => {
            const index = indexes[i];
            acc[index] = offset;
            this.offsetsToIndexes[offset] = index;
            return acc;
        }, {});
        const __id = JSON.stringify(this.heights);
        if (__id === this.__id) {
            return;
        }
        this.afterIndex();
    }
    afterIndex() {
        this.emit('index');
    }
    setCache(cache) {
        this.cache = cache;
    }
    getTotalSize(count) {
        if (count == null) {
            throw new Error('Specify a count when calling getTotalSize!');
        }
        if (count <= 0 || isNaN(count)) {
            return 0;
        }
        let sum = 0;
        for (let i = 0; i < count; i++) {
            let value = this.map[i];
            sum += value === undefined ? this.rowHeight : value;
        }
        return sum;
    }
    getDefaultRowHeight() {
        return this.rowHeight;
    }
    getMinHeight() {
        return this.minHeight || this.rowHeight;
    }
    getMaxHeight() {
        return this.maxHeight || this.rowHeight;
    }
    getRowOffset(index) {
        let offset = this.indexesToOffsets[index];
        if (offset !== undefined) {
            return offset;
        }
        offset = this.rowToOffsetCache[index];
        if (offset !== undefined) {
            return offset;
        }
        // otherwise, it's a normal row
        // so we need to search the biggest known row
        // smaller than index
        const insertPos = ~binarySearch(this.indexes, index, sortAsc);
        const closestIndex = this.indexes[insertPos - 1];
        if (insertPos === 0) {
            offset = index * this.rowHeight;
        }
        else {
            const closestOffset = this.indexesToOffsets[closestIndex];
            offset =
                closestOffset +
                    this.map[closestIndex] +
                    (index - closestIndex - 1) * this.rowHeight;
        }
        this.rowToOffsetCache[index] = offset;
        return offset;
    }
    getRowHeight(index, fn) {
        let value = this.map[index];
        if (value !== undefined) {
            return value;
        }
        if (fn) {
            return fn();
        }
        return this.rowHeight;
    }
    getRowAt(offset) {
        if (offset < 0) {
            return 0;
        }
        const roundedOffset = Math.floor(offset / this.rowHeight) * this.rowHeight;
        let result = this.cache ? this.cache[roundedOffset] : undefined;
        if (result !== undefined) {
            return result;
        }
        if (!this.map) {
            result = roundedOffset / this.rowHeight;
            if (this.cache) {
                this.cache[roundedOffset] = result;
            }
            return result;
        }
        const index = binarySearch(this.offsets, offset, sortAsc);
        if (index < 0) {
            const insertPos = ~index;
            const beforeKnownIndex = this.indexes[insertPos - 1];
            if (beforeKnownIndex !== undefined) {
                const beforeKnownOffset = this.indexesToOffsets[beforeKnownIndex];
                const nextOffset = beforeKnownOffset + this.map[beforeKnownIndex];
                if (offset < nextOffset) {
                    result = beforeKnownIndex;
                }
                else {
                    result =
                        beforeKnownIndex +
                            Math.floor((offset - nextOffset) / this.rowHeight) +
                            1;
                }
            }
            else {
                result = Math.floor(offset / this.rowHeight);
            }
        }
        else {
            result = this.indexes[index];
        }
        if (this.cache) {
            this.cache[roundedOffset] = result;
        }
        return result;
    }
}
export default RowHeightManager;
