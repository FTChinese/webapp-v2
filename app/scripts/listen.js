function listenToStory(ele) {
	try {
		var title;
		var text;
		var audioMessage = {};
		var language = '';
		var currentStory = allstories[gCurrentStoryId];
		var cheadline = currentStory.cheadline || '';
		var eheadline = currentStory.eheadline || '';
		var ebody = currentStory.ebody || '';
		var cbody = currentStory.cbody || '';

		if (langmode === 'ch' || ebody === '' || eheadline === '') {
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
			language: language
		}
		webkit.messageHandlers.listen.postMessage(audioMessage);
	} catch (ignore) {

	}
}