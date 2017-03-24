function listenToStory() {
	try {
		var title;
		var text;
		var currentStory = allstories[gCurrentStoryId];
		var audioMessage = {};
		if (langmode === 'ch' || currentStory.ebody === '') {
			title = currentStory.cheadline;
			text = currentStory.cbody;
			language = 'ch';
		} else {
			title = currentStory.eheadline;
			text = currentStory.ebody;
			language = 'en';
		}
		audioMessage = {
			title: title,
			text: text,
			language: langmode
		}
		console.log (audioMessage);
		webkit.messageHandlers.listen.postMessage(audioMessage);
	} catch (ignore) {

	}
}