var state = new GameState();
//read cookie if one exists
var current_room = state.getCurrentRoom();
// var current_room = KernelFiles;
var man_pages = {"cd": "遥か彼方から聞こえるかのように老人の声が頭の中に響く: \n"+
"(場所を選ぶ) \"cd\"を使って世界を歩き回るのじゃ。 \n" +
"コマンド入力: cd LOCATION \n" +
 "忘れるなよぉぉぉぉ...", 
"mv": "遥か彼方から聞こえるかのように老人の声が頭の中に響く: \n"+ 
"(MoVe). \n \"mv\"でオブジェクトを移動させるのじゃ。\n コマンド入力:" + 
"mv OBJECT NEWLOCATION \n" + 
"忘れるなよぉぉぉぉ...",
"ls": "遥か彼方から聞こえるかのように老人の声が頭の中に響く: \n" + 
"(周りを見渡す). \n \"ls\"を使って、ある場所に何があるか見るのじゃ。" +
"現在地点か、(あまりないが)他の場所に何があるのか見ることもできるぞい。\n"+
" コマンド入力: \n" + 
"ls          (現在地用) \n" + 
"-OR- \n" + 
"ls LOCATION     (\"cd\"で入れない場所用)\n" + 
"忘れるなよぉぉぉぉ...", 
"less": "遥か彼方から聞こえるかのように老人の声が頭の中に響く: \n"+
"(物を見る、調べる、または誰かに話しかける). \n\"less\"を使ってとある場所に何があるのか見るのじゃ。"+
"現在地点か、(あまりないが)他の場所に何があるのか見ることもできるぞい。\n"+
"コマンド入力: less ITEM\n" +
"忘れるなよぉぉぉぉ...", 
"man": "I'm the old man dangit! わしのことを調べようったってそうはいかんぞい。 manで調べられるコマンドは: cd, ls, rm, mv, exit, help, man, touch, grep, pwd.", 
"help": "コマンドの使い方がわからなくなったら\"man COMMAND\"するのだぞ。", 
"exit": "遥か彼方から聞こえるかのように老人の声が頭の中に響く:\n" + 
"(exit) \n" + 
"\"exit\"を使うとゲームをやめることができるのじゃ。永久にな。" + 
"コマンド入力: \n" + 
"exit \n" + 
"忘れるなよぉぉぉぉ...", 
"cp": "遥か彼方から聞こえるかのように老人の声が頭の中に響く:\n" +
"(CoPy)\n" + 
"\"cp\"を使ってアイテムを複製するのじゃ。\n" + 
"コマンド入力:\n" + 
"cp ITEM NEWNAME \n" +
"忘れるなよぉぉぉぉ...", 
"pwd": "遥か彼方から聞こえるかのように老人の声が頭の中に響く: \n" + 
"(今どこにいるのかを出力する) \n" +
"今どこにいるのか思い出すのじゃ。\n" + 
"コマンド入力: \n" + 
"pwd \n" + 
"忘れるなよぉぉぉぉ...",
"grep": "遥か彼方から聞こえるかのように老人の声が頭の中に響く:\n" +
"(grep) \n" + 
"\"grep\"を使ってミニオンにテキストの中から検索するのを手伝ってもらうのじゃ。\n" + 
"コマンド入力: \n" + 
"grep 調べる単語 調べる対象 \n" +
"忘れるなよぉぉぉぉ...",
"touch": "遥か彼方から聞こえるかのように老人の声が頭の中に響く:\n"+
"(触る) 職人の手で新たな物体を生成する\n" +
"\"touch\" を使って世界に新たな物体を生成するのじゃ。\n" +
"コマンド入力:\n" + 
"touch OBJECT \n" + 
"忘れるなよぉぉぉぉ...", 
"tellme": "遥か彼方から聞こえるかのように老人の声が頭の中に響く:\n"+
"(tellme combo) MITのAthenaClusterルームのコンビネーションを得るのじゃ。\n"+
"コマンド入力:\n"+
"tellme combo\n"+
"忘れるなよぉぉぉぉ..."}

$(document).ready(function() {
    $('#term').terminal(function(input, term) {
        var split = input.split(" ");
        var command = split[0].toString();
        var args = split.splice(1,split.length);
        var exec = true;
        if( current_room.commands.indexOf(command) > -1 ){ //Could use current_room.hasOwnProperty(command)
            var prev_room_to_test = current_room;
            if (args.length > 0 && args[0].indexOf("/") > 0){
                var rooms_in_order = args[0].split("/");
                var cur_room_to_test = current_room;
                for (var i = 0; i < rooms_in_order.length; i++){
                    prev_room_to_test = cur_room_to_test;
                    var room_to_cd = rooms_in_order[i];
                    if (i > 0 && rooms_in_order[i-1] === "~"){
                        cur_room_to_test = Home.can_cd(room_to_cd)
                    } else if (room_to_cd === "~"){
                        cur_room_to_test = Home;
                    } else {
                        cur_room_to_test = cur_room_to_test.can_cd(room_to_cd);
                    }
                    if ((command === "cd" || command === "ls") && cur_room_to_test === false){
                        term.echo("That is not reachable from here.");
                        exec = false;
                    }
                }
                args[0] = cur_room_to_test.room_name;
            }
            if (exec){
                var text_to_display = prev_room_to_test[command](args);
                if (text_to_display){
                    term.echo(text_to_display);
                }
                if (command in current_room.cmd_text){
                    term.echo(current_room.cmd_text[command]);
                }
            }
        }
        else{
            term.echo("Command '"+command+"' not found in room '"+current_room.room_name+"'");
        }
    }, { history: true,                     // Keep user's history of commands
        prompt: '>',                        // Text that prefixes terminal entries
        name: 'terminus_terminal',          // Name of terminal
                                            // Signiture to include at top of terminal
        greetings:"ようこそ！初めて来た人へ:\n\n" +
		"\"ls\"コマンドで身の回りを確認してください。 \n" +
		"\"cd LOCATION\"コマンドで新たな場所へ移動できます。 \n" +
		"\"cd ..\"コマンドで一つ前の場所へ戻ることができます。 \n" +
		"\"less ITEM\"コマンドでこの世界のものに 触ることができます。\n\n" +
        "今どこにいるのかわからなくなったら、\"pwd\"コマンドで確認できます。 \n\n" + 
		"さあ、探検へ出かけましょう。ここでの発見が、楽しいものであることを祈っています。lsコマンドを実行して、始めましょう。\n",
        exit: false,                        // Disable 'exit' command
        clear: true,                       // Disable 'clear' command
        });
    
    // Clear history on page reload
    $("#term").terminal().history().clear();
    //Give term focus (Fixes weird initial draw issue)
    $("#term").click();
    //Tab Completion FOR LAST ARGUMENT
    $(window).keyup(function(event){
        if(event.keyCode == 9){
            var command = $("#term").terminal().get_command().replace(/\s+$/,"");
            var split_command = command.split(" ");
            var first_arg = split_command[0]
            var last_arg = split_command.pop();
            //Start in a room, try to move through path, and if we get to the end
            // check whether a room/item could complete our trip
            
            //Get starting room
            var search_room;
            if(last_arg.substring(0,1) == "~"){
                search_room = jQuery.extend(true, {}, Home);
            }
            else{
                search_room = jQuery.extend(true, {}, current_room);
            }
            //Iterate through each room
            var path_rooms = last_arg.split("/");
            var new_room;
            var incomplete_room;
            var substring_matches = [];
            for (room_num=0;room_num<path_rooms.length;room_num++)
            {
                new_room = search_room.can_cd(path_rooms[room_num]);
                if(new_room){
                    search_room = new_room;
                }
                else{
                    //We've made it to the final room,
                    // so we should look for things to complete our journey
                    if(room_num == path_rooms.length-1){
                        //IF cd, ls, cp, mv, less
                        //Compare to this room's children
                        if(first_arg == "cd" ||
                            first_arg == "ls" ||
                            first_arg == "mv")
                        {
                            for(child_num = 0; child_num<search_room.children.length; child_num++){
                                if(search_room.children[child_num].room_name.match("^"+path_rooms[room_num])){
                                    substring_matches.push(search_room.children[child_num].room_name);
                                }
                            }
                        }
                        //IF cp, mv, less, grep, touch
                        //Compare to this room's items
                        if(first_arg == "cp" ||
                            first_arg == "mv" ||
                            first_arg == "less" ||
                            first_arg == "grep" ||
                            first_arg == "touch" ||
                            first_arg == "rm" ||
                            first_arg == "sudo")
                        {
                            for(item_num = 0; item_num<search_room.items.length; item_num++){
                                if(search_room.items[item_num].itemname.match("^"+path_rooms[room_num])){
                                    substring_matches.push(search_room.items[item_num].itemname);
                                }
                            }
                        }
                        
                        //If one match exists
                        if(substring_matches.length == 1){
                            path_rooms.pop();
                            path_rooms.push(substring_matches[0]);
                            split_command.push(path_rooms.join("/"))
                            $("#term").terminal().set_command(split_command.join(" "));
                        }
                        //If multiple matches exist
                        else if(substring_matches.length > 1){
                            //Search for longest common substring (taken from: http://stackoverflow.com/questions/1837555/ajax-autocomplete-or-autosuggest-with-tab-completion-autofill-similar-to-shell/1897480#1897480)
                            var lCSindex = 0
                            var i, ch, memo
                            do {
                                memo = null
                                for (i=0; i < substring_matches.length; i++) {
                                    ch = substring_matches[i].charAt(lCSindex)
                                    if (!ch) break
                                    if (!memo) memo = ch
                                    else if (ch != memo) break
                                }
                            } while (i == substring_matches.length && ++lCSindex)

                            var longestCommonSubstring = substring_matches[0].slice(0, lCSindex)
                            //If there is a common substring...
                            if(longestCommonSubstring != ""){
                                //If it already matches the last snippit, then show the options
                                if(path_rooms[room_num] == longestCommonSubstring){
                                    split_command.push(last_arg)                                                    //Join final argument to split_command
                                    $("#term").terminal().echo(">"+split_command.join(" ").replace(/\s+$/,""));     //Print what the user entered
                                    $("#term").terminal().echo(substring_matches.join(" "));                        //Print the matches
                                    $("#term").terminal().set_command(split_command.join(" ").replace(/\s+$/,""));  //Set the text to what the user entered
                                }
                                //Otherwise, fill in the longest common substring
                                else{
                                    path_rooms.pop();                           //Pop final snippit
                                    path_rooms.push(longestCommonSubstring);    //Push longest common substring
                                    split_command.push(path_rooms.join("/"))    //Join room paths
                                    $("#term").terminal().set_command(split_command.join(" ")); //Set the terminal text to this auto-completion
                                }
                            }
                            //Otherwise, there is no common substring.  Show all of the options.
                            else{
                                split_command.push(last_arg)                                                    //Join final argument to split_command
                                $("#term").terminal().echo(">"+split_command.join(" ").replace(/\s+$/,""));     //Print what the user entered
                                $("#term").terminal().echo(substring_matches.join(" "));                        //Print the matches
                                $("#term").terminal().set_command(split_command.join(" ").replace(/\s+$/,""));  //Set the text to what the user entered
                            }
                        }
                        //If no match exists
                        else{
                            //DO NOTHING (except remove TAB)
                            $("#term").terminal().set_command(command.replace(/\s+$/,""));
                        }
                    }
                    else{
                        //DO NOTHING (except remove TAB)
                        $("#term").terminal().set_command(command.replace(/\s+$/,""));
                    }
                }
            }
        }
    });
});
