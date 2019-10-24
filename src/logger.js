export const logger = store => next => action => {
  console.group(action.type);
  console.log(action);
  console.log(store.getState());
  next(action);
  console.log(store.getState());
  console.groupEnd();
}
