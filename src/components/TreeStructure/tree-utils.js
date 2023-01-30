import { levenshtein } from 'string-comparison'
import { ICON_STATE } from './ReadFilter.js';

/**
 * Returns `true` if the `chain` string contains the `filter` string after converting both to lower case, 
 * or if `levenshtein.sortMatch` returns a match rating greater than 0.7.
 * 
 * @param {string} chain - The string to check for a match.
 * @param {string} filter - The string to match against.
 * 
 * @returns {boolean} - `true` if there is a positive match, `false` otherwise.
 */
export const positiveMatch = (chain, filter) => {
  if (chain.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) return true;
  const results = levenshtein.sortMatch(filter, chain.split(' '));
  return results.find((result) => result.rating > 0.7);
}

/**
 * Returns `true` positive match if item's read value passes the read-filter applied by the user
 * 
 * @param {*} itemReadValue Whether the entry is marked as being read by this user
 * @param {*} readFilter The read-unread filter applied by the user
 * @returns Returns positive match if item's read value passes the read-filter applied by the user
 */
export const readUnreadMatch = (itemReadValue, readFilter) => {
  // if(readFilter === ICON_STATE.ALL) //All, do nothing 
  if(readFilter === ICON_STATE.UNREAD && itemReadValue) return false;
  if(readFilter === ICON_STATE.READ && !itemReadValue) return false;
  return true;
}


/**
 * Returns an array of the `_id` values of the lineage of the `itemId` in the `tree` object.
 * If `excludeSelf` is `true`, the `itemId` is not included in the lineage.
 * 
 * @param {string} itemId - The `_id` of the item to find the lineage for.
 * @param {object} tree - The tree object containing the items.
 * @param {boolean} excludeSelf - Specifies if the `itemId` should be excluded from the lineage.
 * 
 * @returns {Array<string>} - The lineage of `itemId`.
 */
export const getLineage = (itemId, tree, excludeSelf) => {
  
  const element = tree.items[itemId]; 

  let lineage = [];
  const traverse = (item) => {
    if(!excludeSelf) lineage.push(item.data._id)
    if(item.data.children && item.data.children.length > 0) {
      item.data.children.forEach((childElementId) => {
        traverse(tree.items[childElementId]);
      })
    }
  }
  traverse(element, excludeSelf);
  return [...lineage];
}

/**
 * Filters the `itemId` in the `remote` object.
 * If the `name` of the item is "root", the item is not filtered.
 * If the `positiveMatch` function returns `true` for the item's `name` and `filter`, the item is included and its parent is also included.
 * 
 * @param {string} itemId - The `_id` of the item to filter.
 * @param {object} remote - The remote object containing the items.
 * @param {string} filter - The filter string to match against.
 * @param {string} readFilter - The read filter string, either `ICON_STATE.ALL`, `ICON_STATE.UNREAD`, or `ICON_STATE.READ`.
 * @param {object} involvedIds - An object used to keep track of included items.
 */
export const filterElement = (itemId, remote, filter, readFilter, involvedIds) => {
  const currentItem = remote.items[itemId];
  
  if(currentItem.data.name === 'root') return;

  let positive = false;

  if(readFilter && filter && readUnreadMatch(currentItem.data.read, readFilter) && positiveMatch(currentItem.data.name, filter)) {
    positive = true;
  }
  if(readFilter && !filter && readUnreadMatch(currentItem.data.read, readFilter)) {
    positive = true;
  }
  if(!readFilter && filter && positiveMatch(currentItem.data.name, filter)) {
    positive = true;
  }

  if(positive){
    involvedIds[currentItem.data._id] = true;
    const getAncestry = (item) => {
      if(item.data.parent) {
        involvedIds[item.data.parent] = true;
        getAncestry(remote.items[item.data.parent]);
      }
    }
    if(currentItem.data.parent) getAncestry(currentItem);
  }
}      

/**
 * Merges the `local` and `remote` objects into a new tree object, filtering and collapsing items as specified.
 * If `remote` is falsy, returns `local`.
 * If `filter` is truthy, only items that match the filter are included.
 * If `readFilter` is truthy, only items with the specified `read` status are included.
 * If `forceLocal` is truthy, the `local` properties are used instead of the `remote` properties.
 * 
 * @param {object} local - The local object to merge with `remote`.
 * @param {object} remote
 * @returns Returns a new tree object merging DB fetched values and local properties in a form usable by the Tree Library
 */
export const treeReducer = (local, remote, filter, readFilter, forceLocal) => {
  if(!remote) return  
  
  const items = {}; 
  const involvedIds = {1:true} // Will need to keep sequences to show matches down and up the tree.

  const mergeProperties = (itemId, remote, local) => {
      // Merge Local and Remote (data from remote + isExpanded local)
      let newItem;
      if(forceLocal) {
        newItem = {...local.items[itemId], isExpanded: false}
      } else {
        newItem = {...remote.items[itemId], isExpanded: false}
      }
      if(local && local.items[itemId]) {
        newItem.isExpanded = local.items[itemId].isExpanded || false;
      } 
      return newItem;
  }

  for (const itemId in remote.items) {

    // Restore children from data
    if(!forceLocal && remote.items[itemId].children && remote.items[itemId].data.children) {
      remote.items[itemId].children = [...remote.items[itemId].data.children];
    }

    // Filter
    if(filter || readFilter) {
      filterElement(itemId, remote, filter, readFilter, involvedIds);
    } else {
      items[itemId] = mergeProperties(itemId, remote, local);
    }
  }

  if(filter || readFilter){
    for (const [itemId] of Object.entries(involvedIds)) {
      items[itemId] = mergeProperties(itemId, remote, local);
      if(items[itemId].children) items[itemId].children = items[itemId].children.filter(child => involvedIds[child]);
      if(items[itemId].data.parent) {
          const parentItem = remote.items[items[itemId].data.parent];
          parentItem.children = parentItem.children.filter(child => involvedIds[child]);
      }   
    }
  }

  return {
    rootId: '1',
    items: items
  };
}

export const setCollapsed = (local, remote, collapsed) => {
  if(!remote) return
  const items = {};

  for (const itemId in remote.items) {
    items[itemId] = {...remote.items[itemId], isExpanded: collapsed};
  }

  return { rootId: '1', items: items };
}

export const getAncestryArray = (itemId, tree) => {
  let ancestryArray = []
  if(itemId) {
    const element = tree.items[itemId];
    ancestryArray.push(element);
    let element2, element3;
    if(element && element.data.parent) {
      element2 = tree.items[element.data.parent]
      ancestryArray = [element2].concat(ancestryArray);
    }
    if(element2 && element2.data.parent) {
      element3 = tree.items[element2.data.parent]
      ancestryArray = [element3].concat(ancestryArray);
    }
  }
  return ancestryArray;
}

const getChildFromParent = (tree, parentId, index) => {
  return tree.items[tree.items[parentId].children[index]];
}

export const generateNewSortOrder = (tree, source, destination) => {
  const DEFAULT_DIFF = 1000;

  const getMiddleSortOrder = (pos1, pos2) => {
    if(pos1.sortOrder !== undefined && pos2.sortOrder !== undefined) {
      return Math.ceil((pos1.sortOrder + pos2.sortOrder)/2);
    }
    return -1;
  }

  if(destination.index > 0 && destination.index < tree.items[destination.parentId].children.length - 1) {
    if(source.index < destination.index) {
      return getMiddleSortOrder(
          getChildFromParent(tree, destination.parentId, destination.index).data,
          getChildFromParent(tree, destination.parentId, destination.index+1).data
        );
      } else {
        return getMiddleSortOrder(
          getChildFromParent(tree, destination.parentId, destination.index-1).data,
          getChildFromParent(tree, destination.parentId, destination.index).data
        );
      }
  }
  if(destination.index === 0) {
    const ogFirstChild = getChildFromParent(tree, destination.parentId, 0).data;
    return ogFirstChild.sortOrder - DEFAULT_DIFF;
  }
  if(destination.index === tree.items[destination.parentId].children.length - 1) {
    const parentEntry = tree.items[destination.parentId];
    return getChildFromParent(tree, destination.parentId, parentEntry.children.length - 1).data.sortOrder + DEFAULT_DIFF
  }
}

export default {
  filterElement:filterElement,
  treeReducer: treeReducer,
  getLineage: getLineage,
  setCollapsed:setCollapsed,
  getAncestryArray:getAncestryArray,
  generateNewSortOrder:generateNewSortOrder
}