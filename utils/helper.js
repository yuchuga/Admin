export const mergeRemoveDuplicates = (arr1, arr2) => {
  const mergedArray = [...arr1, ...arr2]
  const uniqueSet = new Set(mergedArray)
  const uniqueArray = [...uniqueSet]
  return uniqueArray
};
