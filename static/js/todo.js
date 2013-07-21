var pictureData = [
	{
		filename : "yoshitakayuriko.jpg",
		splitBox : [
			[ '1_1', '1_2', '1_3'],
			[ '2_1', '2_2', '2_3'],
			[ '3_1', '3_2', '3_3'],
			[ '4_1', '4_2', '4_3'],
			[ '5_1', '5_2', '5_3'],
			[ '6_1', '6_2', '6_3'],
			[ '7_1', '7_2', '7_3'],
			[ '8_1', '8_2', '8_3']
		],
		order : [
			'1_1',
			'2_2',
			'4_3',
			'1_3',
			'2_1',
			'3_2',
			'2_3',
			'3_1',
			'3_3',
			'4_1',
			'4_2', 
			'5_1',
			'5_2',
			'7_2', 
			'5_3',
			'6_1',
			'6_2',
			'1_2',
			'6_3',
			'7_1',
			'7_3',
			'8_1',
			'8_2',
			'8_3'
		]
	}
];

var fusenData = [];

var todoCreate = {
	submit : function(){
		var todoInput = $('#todoInput').val();
		$('#todoInput').val("");
		jQuery.post("/create", {text : todoInput}, function(){});
	},

	fusenAdd : function(id, text, status){
		addDataNum = null;
		for(var i in fusenData){
			if(fusenData[i] === null){
				addDataNum = i;
				fusenData[i] = {id: id, text: text, status: status, 
					element : todoShow.todoElementClass + todoShow.pictureData.order[addDataNum]};
				break;
			}
		}
		if(addDataNum === null){
			fusenData.push({id: id, text: text, status: status, 
				element : todoShow.todoElementClass + todoShow.pictureData.order[fusenData.length]});
			addDataNum = fusenData.length - 1;
		}

		var todoElement = todoShow.todoElementClass + todoShow.pictureData.order[addDataNum];
		var todoButtonElement = todoShow.todoElementClass + todoShow.pictureData.order[addDataNum]+"_fusen_button";
		
		var height = todoShow.rowHeight - 2;
		var width = todoShow.columnWidth - 2;
		$("#"+todoElement).html(
            '<div class="fusen disposition" id="'+todoElement+'_fusen'+'" style="height:'+height+'px;width:'+width+'px;">'+text+'<button class="btn" type="button" id="'+todoButtonElement+'">完了</button></span>'
		);
			
		$("#"+todoElement+'_fusen').draggable({
			revert:'invalid',
			zIndex:'1000'
		});
		
		$('#'+todoElement).removeClass("todocell_null");
		$("#"+todoElement).addClass("todocell");
		document.getElementById(todoElement+'_fusen').fusenData = {
			index : addDataNum,
			element : todoElement,
			id : id
		};
		$("#"+todoButtonElement).click(function(){
			var id = document.getElementById(todoElement + '_fusen');
			completion.fusenCompletion(id.fusenData);
		});
	}
};

var completion = {
	fusenCompletion : function(data){
		fusenData[data.index] = null;
		$('#'+data.element).html("");
		$('#'+data.element).addClass("todocell_null");
		$('#'+data.element).removeClass("todocell");
		$('#'+data.element).data = null;

		jQuery.post("/done", {id : data.id}, function(){});
	}
};

var todoShow = {
	pictureData : "",
	pictureWidth : 0,
	pictureHeight : 0,
	todoElementClass : 'cell_',

	hideImage : function(){
		$('#todobody').html("");
		
		var row = this.pictureData.splitBox.length;
		var rowHeight = Math.round(todoShow.pictureHeight / row);

		var column = this.pictureData.splitBox[0].length;
		var columnWidth = Math.round(todoShow.pictureWidth / column);
		
		for(var i in this.pictureData.splitBox){
			var rowElement = $("<div/>");
			
			for(var j in this.pictureData.splitBox[i]){
				rowElement.append('<div class="todocell" id="'+this.todoElementClass+this.pictureData.splitBox[i][j]+'" style="width:'+columnWidth+'px; height:'+rowHeight+'px;">'+
						"</div>");
			}
			$('#todobody').append(rowElement);
		}
		todoShow.columnWidth = columnWidth;
		todoShow.rowHeight = rowHeight;
	}
};

$(function(){ 
	$('#todoInput').keypress(function ( e ) {
		if ( e.which == 13 ) {
			todoCreate.submit();
			return false;
		}
	});
	
	todoShow.pictureData = pictureData[0];
	$('#idolimage').attr("src", "static/image/idol/"+todoShow.pictureData.filename);
	$('#idolimage').bind('load',function(){
		todoShow.pictureWidth = $("#idolimage").width();
		todoShow.pictureHeight = $("#idolimage").height();
		todoShow.hideImage();
	});
	
	jQuery.get("/select_all", {}, function(data){
		var jsons = JSON.parse(data);
		for (index in jsons){
			json = JSON.parse(jsons[index]);

			id = json['id'];
			text = json['text'];
			status = json['status'];

			if (status === 'new') {
				todoCreate.fusenAdd(id, text, status);
			}
		}
	});
});
