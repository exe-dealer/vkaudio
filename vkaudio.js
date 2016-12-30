document.addEventListener('mouseover', function (e) {
  if (!e.target.matches('.audio_row') ||
       e.target.querySelector('.audio_act_save'))
    return;

  var downloadEl = document.createElement('div');
  downloadEl.className = 'audio_act_save';
  downloadEl.textContent = 'save';
  downloadEl.style = 'line-height: 1.6; display: inline-block; vertical-align: middle';
  downloadEl.onclick = handleSaveClick;
  e.target.querySelector('.audio_acts').appendChild(downloadEl);

  var audio = AudioUtils.getAudioFromEl(e.target, true);
  function handleSaveClick() {
    ajax.post("al_audio.php",
      { act: "reload_audio", ids: audio.fullId },
      { onDone: handleGetUrlDone });
  }
  function handleGetUrlDone(res) {
    var url = res[0][AudioUtils.AUDIO_ITEM_INDEX_URL];
    var fileName = res[0][AudioUtils.AUDIO_ITEM_INDEX_PERFORMER]
      + ' - ' + res[0][AudioUtils.AUDIO_ITEM_INDEX_TITLE] + '.mp3';
    download(url, fileName);
  }
  function download(url, fileName) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
    xhr.onload = function () {
      var save = document.createElement('a');
      save.href = URL.createObjectURL(xhr.response);
      save.download = fileName;
      save.click();
      URL.revokeObjectURL(save.href);
    };
  }
});

console.log('you can download audio now');
