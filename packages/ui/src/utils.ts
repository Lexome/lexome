import debounce from 'lodash/debounce';

export const activityMonitor = {
  isActive: false,
};

const SET_INACTIVE_AFTER = 300000
let watchInactiveTimeout: any = undefined;

const watchForInactive = () => {
  watchInactiveTimeout = setTimeout(() => {
    activityMonitor.isActive = false;
  }, SET_INACTIVE_AFTER);
};

const onMouseMove = debounce(() => {
  activityMonitor.isActive = true
  clearTimeout(watchInactiveTimeout);
  watchForInactive();
});

document.addEventListener('mousemove', onMouseMove);

