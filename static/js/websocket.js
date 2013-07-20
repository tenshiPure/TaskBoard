var ws = new WebSocket('ws://133.208.21.190:5000/ws');

ws.onopen = function(){
	console.log('通信開始！');
};

ws.onclose = function(ev){
	console.log('通信終了！');
};

ws.onmessage = function(ev){
	var json = JSON.parse(ev.data);

	console.log(json);

	_id = json['id'];
	text = json['text'];
	status = json['status'];
	if (status === 'new') {
		todoCreate.fusenAdd(_id, text, status);
	}
	else {
		for (var index in fusenData) {
			if (fusenData[index] === null) {
				continue;
			}
			if (fusenData[index].id === _id) {
				completion.fusenCompletion({index : index, id : _id, element : fusenData[index].element});
			}
		}
	}
};
