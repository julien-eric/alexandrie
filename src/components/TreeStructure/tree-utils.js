import { levenshtein } from 'string-comparison'

export const positiveMatch = (chain, filter) => {
  if (chain.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) return true;
  const results = levenshtein.sortMatch(filter, chain.split(' '));
  return results.find((result) => result.rating > 0.7);
}

export const filterElement = (itemId, remote, filter, involvedIds) => {
  const currentItem = remote.items[itemId];
  
  if(currentItem.data.name === 'root') return;
  
  if(positiveMatch(currentItem.data.name, filter)) {
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

export const treeReducer = (local, remote, filter, forceLocal) => {
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
    if(filter) {
      filterElement(itemId, remote, filter, involvedIds);
    } else {
      items[itemId] = mergeProperties(itemId, remote, local);
    }
  }

  if(filter){
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
  setCollapsed:setCollapsed,
  getAncestryArray:getAncestryArray,
  generateNewSortOrder:generateNewSortOrder
}