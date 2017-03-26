function listenToStory(ele) {
	try {
		// MARK: - Switch Between two buttons
		var buttonClass = ele.className;
		var buttonNewClass = '';
		var buttonAction;
		if (buttonClass.indexOf(' pause') >= 0) {
			buttonAction = 'pause';
			buttonNewClass = buttonClass.replace(' pause', '') + ' continue';
		} else if (buttonClass.indexOf(' continue') >= 0) {
			buttonAction = 'continue';
			buttonNewClass = buttonClass.replace(' continue', '') + ' pause';
		} else {
			buttonAction = 'play';
			buttonNewClass = buttonClass + ' pause';
		}
		ele.className = buttonNewClass;
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
			language: language,
			action: buttonAction
		}
		webkit.messageHandlers.listen.postMessage(audioMessage);
	} catch (ignore) {

	}
}

function stopeAudio() {
	try {
		var audioMessage = {
			title: '',
			text: text,
			language: 'en-GB',
			action: 'stop'
		}
		webkit.messageHandlers.listen.postMessage(audioMessage);
	} catch (ignore) {

	}
}

function refreshAudioButton() {
	document.getElementById('audio-button-top-right').className = 'header-side right storyOnly';
}