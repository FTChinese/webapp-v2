function listenToStory(ele) {
	try {
		// MARK: - Switch Between two buttons
		var buttonClass = ele.className;
		var buttonAction;
		if (buttonClass.indexOf(' pause') >= 0) {
			buttonAction = 'pause';
			buttonClass = buttonClass.replace(' pause', '');
		} else {
			buttonAction = 'play';
			buttonClass += ' pause';
		}
		ele.className = buttonClass;

		var title;
		var text;
		var currentStory;
		var audioMessage = {};
		currentStory = allstories[gCurrentStoryId];
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
			language: langmode,
			action: buttonAction
		}
		webkit.messageHandlers.listen.postMessage(audioMessage);

	} catch (ignore) {

	}
}