const obs = new OBSWebSocket();

document.querySelector(`.connection-section-form button`).addEventListener(`click`, async element => {
  const host = `ws://localhost:4455`;

  obs.connect(host);
});



obs.on('ConnectionOpened', async () => {
  console.log("Connected");

  let scenes = await obs.call('GetSceneList');
  console.log(scenes);


});