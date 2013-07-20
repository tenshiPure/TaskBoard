/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

// 写真データ
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

// Todoを登録する
var todoCreate = {
    submit : function(){
        var todoInput = $('#todoInput').val();
        // 必須入力チェック
        if(todoInput === ""){
            alert("Todoの内容は必ず入力してください。");
            return;
        }
        $('#todoInput').val("");
        // 登録処理
        jQuery.post("/create", {text : todoInput}, function(){
        });
    },
    fusenAdd : function(id, text, status){
        // Maxチェック
        if(fusenData.length >= todoShow.pictureData.order.length){
            alert("皆さん仕事が多すぎます！");
            return;
        }
        // 空きを探す
        addDataNum = null;
        for(var i in fusenData){
            if(fusenData[i] === null){
                addDataNum = i;
                fusenData[i] = {id: id, text: text, status: status, element : todoShow.todoElementClass + todoShow.pictureData.order[addDataNum]};
                break;
            }
        }
        if(addDataNum === null){
            fusenData.push({id: id, text: text, status: status, element : todoShow.todoElementClass + todoShow.pictureData.order[fusenData.length]});
            addDataNum = fusenData.length - 1;
        }

        // 表示制御
        var todoElement = todoShow.todoElementClass + todoShow.pictureData.order[addDataNum];
        var todoButtonElement = todoShow.todoElementClass + todoShow.pictureData.order[addDataNum]+"_fusen_button";
        
        // 付箋の中身
        var height = todoShow.rowHeight - 2;
        var width = todoShow.columnWidth - 2;
        $("#"+todoElement).html(
//            '<div class="fusen disposition" id="'+todoElement+'_fusen'+'" style="height:'+height+'px;width:'+width+'px;">'+text+'<button class="btn" type="button" id="'+todoButtonElement+'">完了</button></span>'
            '<div class="fusen disposition" id="'+todoElement+'_fusen'+'" style="height:'+height+'px;width:'+width+'px;">'+text+'</span>'
        );
            
        // ドラッグの設定
        $("#"+todoElement+'_fusen').draggable({
            revert:'invalid',
            zIndex:'1000'
        });
        
        $('#'+todoElement).removeClass("todocel_null");
        $("#"+todoElement).addClass("todocel");
        document.getElementById(todoElement+'_fusen').fusenData = {
            index : addDataNum,
            element : todoElement,
			id : id
        };
        $("#"+todoButtonElement).click(function(){
            //付箋を削除
            completion.fusenCompletion(this.fusenData);
        });
    }
};

// 付箋を完了にする
var completion = {
    // 完了にする
    fusenCompletion : function(data){
        // 表示を削除する
        fusenData[data.index] = null;
        $('#'+data.element).html("");
        $('#'+data.element).addClass("todocel_null");
        $('#'+data.element).removeClass("todocel");
        $('#'+data.element).data = null;

        jQuery.post("/done", {id : data.id}, function(){
        });
	}
};

// Todoを表示する
var todoShow = {
    // どの画像を使っていくか
    pictureData : "",
    // 画像のサイズ
    pictureWidth : 0,
    pictureHeight : 0,
    // TodoElementのIDにつける固定文字列
    todoElementClass : 'call_',
    // データを亮君から取得する
    getTodoDataAll : function(){
        $.get("/select_all", {}, function(data){
            // 表示処理
        });
    },
    // 画像を隠す
    hideImage : function(){
        // 画像上クリア
        $('#todobody').html("");
        
        // 付箋の縦の大きさ
        var row = this.pictureData.splitBox.length;
        var rowHeight = Math.round(todoShow.pictureHeight / row);
        // 付箋の横の大きさ
        var column = this.pictureData.splitBox[0].length;
        var columnWidth = Math.round(todoShow.pictureWidth / column);
        
        for(var i in this.pictureData.splitBox){
            var rowElement = $("<div/>");
            
            for(var j in this.pictureData.splitBox[i]){
                rowElement.append('<div class="todocel" id="'+this.todoElementClass+this.pictureData.splitBox[i][j]+'" style="width:'+columnWidth+'px; height:'+rowHeight+'px;">'+
                        "</div>");
            }
            $('#todobody').append(rowElement);
        }
        todoShow.columnWidth = columnWidth;
        todoShow.rowHeight = rowHeight;
        
    }
};

$(function(){ 
    // マウスイベントを登録する
    $('#todoCreate').click(todoCreate.submit);
    $('#todoInput').keypress(function ( e ) {
	if ( e.which == 13 ) {
		todoCreate.submit();
                return false;
	}
});
    
//    document.body.style.backgroundImage = "url(" + "idol/"+pictureData[0].filename + ")";
    todoShow.pictureData = pictureData[0];
    $('#idolimage').attr("src", "static/image/idol/"+todoShow.pictureData.filename);
    // 画像サイズの取得
    $('#idolimage').bind('load',function(){
        todoShow.pictureWidth = $("#idolimage").width();
        todoShow.pictureHeight = $("#idolimage").height();
        todoShow.hideImage();
    });
    
    // ドロップの設定
    $('#drop').droppable({
        drop: function(ev, ui){
            console.log(ui.draggable.prependTo(this).attr("id"));
            var id = document.getElementById(ui.draggable.prependTo(this).attr("id"));
            completion.fusenCompletion(id.fusenData);
        }
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
