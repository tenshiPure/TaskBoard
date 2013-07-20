/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

// 写真データ
var pictureData = [
    {
        filename : "yoshitakayuriko_i15.jpg",
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
        todoCreate.fusenAdd("id", todoInput, "");
        $('#todoInput').val("");
        // 登録処理
        jQuery.post("/create", {text : todoInput}, function(){
            // 登録成功なので、表示に追加
        });
    },
    fusenAdd : function(id, text, status){
        fusenData.push({id: id, text: text, status: status});
        addDataNum = fusenData.length - 1;
        todoElement = todoShow.todoElementClass + todoShow.pictureData.order[addDataNum];
        $("#"+todoElement).html(text);
        $("#"+todoElement).data = {
            fusenData : addDataNum
        };
    }
};

// 付箋を完了にする
var completion = {
    // 完了にする
    fusenCompletion : function(){
        
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
        for(var i in this.pictureData.splitBox){
            var rowElement = $("<div/>");
            
            // 付箋の横の大きさ
            var column = this.pictureData.splitBox[i].length;
            var columnWidth = Math.round(todoShow.pictureWidth / column);
            for(var j in this.pictureData.splitBox[i]){
                rowElement.append('<div class="todocel" id="'+this.todoElementClass+this.pictureData.splitBox[i][j]+'" style="width:'+columnWidth+'px; height:'+rowHeight+'px;">'+
                        this.pictureData.splitBox[i][j]+
                        "</div>");
            }
            $('#todobody').append(rowElement);
        }
    }
};

$(function(){ 
    // マウスイベントを登録する
    $('#todoCreate').click(todoCreate.submit);
//    document.body.style.backgroundImage = "url(" + "idol/"+pictureData[0].filename + ")";
    todoShow.pictureData = pictureData[0];
    $('#idolimage').attr("src", "idol/"+todoShow.pictureData.filename);
    // 画像サイズの取得
    $('#idolimage').bind('load',function(){
        todoShow.pictureWidth = $("#idolimage").width();
        todoShow.pictureHeight = $("#idolimage").height();
        todoShow.hideImage();
    });
});
