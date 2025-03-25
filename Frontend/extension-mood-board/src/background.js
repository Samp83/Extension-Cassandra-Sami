const api = typeof browser !== 'undefined' ? browser : chrome;

api.browserAction.onClicked.addListener(() => {
  api.windows.create({
    url: 'index.html',
    type: 'popup',
    width: 400,
    height: 600
  });
});