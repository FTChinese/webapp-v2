function listenToAudio(slideUrl, slideTitle) {
	var audioFileUrl = slideUrl.replace(/^.*audio=(.*\.mp3).*$/,'$1');
	var audioMessage = {
		title: slideTitle,
		audioFileUrl: audioFileUrl,
		interactiveUrl: slideUrl
	}
	var eventCategory = 'Listen To Story';
	try {
		webkit.messageHandlers.audio.postMessage(audioMessage);
		ga('send','event',eventCategory, 'Start', slideTitle);
	} catch (ignore) {

	}
}