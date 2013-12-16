/*
 * document name: analyzer.js
 * edited by: Jelon Zhang
 * date: 2013/5/7 
 *
 *
 */

 (function() {
 	var analyzer = {}; //词法分析器对象

 	//绑定事件
 	analyzer.bind = function(obj, type, handler) {
 		if (obj.attachEvent) {
 			obj.attachEvent("on" + type, handler);
 		} else {
 			obj.addEventListener(type, handler, false);
 		}
 	};
	

 	analyzer.spliter = {


 		split_handlers: {

 			//关键字判断
 			isKey: function(_inputStr) {
 				/*
 		 		 * 本程序规定
 		 		 * 被分析的语言
 		 		 * javascript
 		 		 * 的关键词如下：
 		 		 *
 		 		 */
 				switch (_inputStr) {
 					case "var":
 					case "if":
 					case "else":
 					case "new":
 					case "delete":
 					case "this":
 					case "break":
 					case "continue":
 					case "while":
 					case "do":
 					case "for":
 					case "getElementById":
					case "getElementsByClass":
					case "getElementsByTagName":
 					case "onclick":
 					case "write":
 					case "default":
 					case "document":
 					case "typeof":
 					case "switch":
 					case "try":
 					case "catch":
 					case "case":
 					case "null":
 					case "true":
 					case "false":
 					case "alert":
 					case "function":
 					case "void": 
 					case "return": {
 						return true;
 						break;
 					}

 					default: {
 						return false;
 					}
 				}

 			},

 			//字母判断
 			isLetter: function(inputChar) {

 				if (((inputChar >= 'a') && (inputChar <= 'z')) || ((inputChar >= 'A') && ( inputChar <= 'Z'))) {
 					return true;
 				} else {
 					return false;
 				}
 			},

 			//数字判断
 			isDigit: function(inputChar) {

 				if ((inputChar >= '0') && (inputChar <= '9')) {
 					return true;
 				} else {
 					return false;
 				}
 			},

 			//空格、换行、制表符判断
 			isLiteral: function(inputChar) {
 				var r = null;
 				var reg = /\t|\n|\s/g;

 				if ((r = reg.exec(inputChar)) == null) {
 					return false;
 				} else {
 					return true;
 				}
 			},

 			//去除注释
 			removeComments: function(_inputStr) {
 				var notes = ["(\\/\\/.*)", "(\\/\\*(\\/|\\**[^\\*])*\\*+\\/)"].join('|');
 				var retStr;

 				var reg = new RegExp(notes, "g");
 				retStr = _inputStr.replace(reg, '');

 				return retStr;
 			}

 		},


 		//自动机分析过程
 		tokens: function(inputStr) {
 			var ret = [];
 			var counter = 0;
 			inputStr = this.split_handlers.removeComments(inputStr);	//执行去掉注释

 			while (counter < inputStr.length) {
 				var tmp_char;
 				tmp_char = inputStr.charAt(counter); 

 				var next_char = '';
 				var tmp_str = "";

 				if (this.split_handlers.isLiteral(tmp_char)) {			//判断空格、换行、制表符

 					//do nothing..
 				
 				} else if (this.split_handlers.isLetter(tmp_char)) { 	//判断字母
 					var tmp_counter = counter;
 					tmp_str = "";

 					while (this.split_handlers.isLiteral(tmp_char) == false 
 							&& (this.split_handlers.isDigit(tmp_char) 
 							|| this.split_handlers.isLetter(tmp_char))) {
 						
 						tmp_str += inputStr.charAt(tmp_counter);
 						tmp_counter++;
 						tmp_char = inputStr.charAt(tmp_counter);

 					}
 					if (this.split_handlers.isKey(tmp_str)) {
 						ret.push("关键字\t" + tmp_str);
 						counter = tmp_counter - 1;
 					} else {
 						ret.push("标识符\t" + tmp_str);
 						counter = tmp_counter - 1;
 					}

 				} else if (this.split_handlers.isDigit(tmp_char)) { 	//判断数字
 					
 					var tmp_counter = counter;
 					tmp_str = "";

 					while (this.split_handlers.isLiteral(tmp_char) == false 
 						&& (this.split_handlers.isDigit(tmp_char) 
 						|| tmp_char == '.')) {
 						
 						tmp_str += inputStr.charAt(tmp_counter);
 						tmp_counter++;
 						tmp_char = inputStr.charAt(tmp_counter);
 					}

 					var r = [];
 					var reg = /^\d+(\.\d+)?$/; 

 					if ((r = reg.exec(tmp_str)) !=null) {
 						ret.push("常数\t" + tmp_str);
 						counter = tmp_counter - 1;
 					} else {
 						ret.push("标识符\t" + tmp_str);
 						counter = tmp_counter -1;
 					}

 				} else if (tmp_char == '\"' || tmp_char == '\'') {		//判断字符串

 					var tmp_counter = counter + 1;
 					tmp_char = inputStr.charAt(tmp_counter);

 					while (tmp_char != '\"' && tmp_char != '\'') {

 						tmp_counter++;
 						tmp_char = inputStr.charAt(tmp_counter);

 					}

 					counter = tmp_counter;


 				} else {												//判断分解符

 					switch (tmp_char) {
 						case '+': {
 							counter++;
 							next_char = inputStr.charAt(counter);

 							if (next_char == '+') {
 								ret.push("运算符\t" + "++");
 								break;
 							} else {
 								counter--;
 							}
 						}
 						case '-': {
 							counter++;
 							next_char = inputStr.charAt(counter);

 							if (next_char == '-') {
 								ret.push("运算符\t" + "--");
 							} else {
 								counter--;
 							}
 						}
 						case '*':
 						case '/':
 						case '=':
 							ret.push("运算符\t" + tmp_char);
 							break;

 						case '(':
 						case ')': 
						case '[':
						case ']':
						case '{':
						case '}':
						case ',':
						case ';':
						case '.':
							ret.push("分隔符\t" + tmp_char);
							break;

						case ':': {
							counter++;
							next_char = inputStr.charAt(counter);

							if (next_char == '=') {
								ret.push("运算符\t"+ ":=");
							} else {
								counter--;
							}
							
							break;
						}
						case '|': {
							counter++;
							next_char = inputStr.charAt(counter);
							
							if (next_char == '|') {
								ret.push("运算符\t" + "||");
							} else {
								ret.push("运算符\t" + "|");
								counter--;
							}
							
							break;
						}
						case '&': {
							counter++;
							next_char = inputStr.charAt(counter);
							
							if (next_char == '&') {
								ret.push("运算符\t" + "&&");
							} else {
								ret.push("运算符\t" + "&");
								counter--;
							}
							
							break;
						}
						case '>': {
							counter++;
							next_char = inputStr.charAt(counter); 

							if (next_char == '=') {
								ret.push("运算符\t" + ">=");
							} else if (next_char == '>') {
								ret.push("输入控制符\t" + ">>");
							} else {
								counter--;
								ret.push("运算符\t" + tmp_char)
							}

							break;
						}

						case '<': {
							counter++;
							next_char = inputStr.charAt(counter);

							if ( next_char == '<') {
								ret.push("输出控制符\t" + "<<");

							} else if (next_char == '=') {
								ret.push("运算符\t" + "<=");

							} else if (next_char == '>') {
								ret.push("运算符\t" + "<>");

							} else {
								counter--;
								ret.push("运算符\t" + tmp_char);
							}

							break;
						}

						default: 
							ret.push("标识符\t" + tmp_char);
							break;


 					}
 				}

 				counter++;
 			}

 			return ret.join('\n');
 		}
 	};
	



	/*
	 * 执行部分
	 *
	 */	

 	var txtCode = document.getElementById("txtCode");
	var txtResult = document.getElementById("txtResult");
	var btnGo = document.getElementById("btnGo");

	analyzer.bind(btnGo, "click", function() {
		if (txtCode.value == '') {
			alert("请输入要分析的源代码程序!");
			txtCode.focus();
		}
 		var _tokens = analyzer.spliter.tokens(txtCode.value); 	//分析源代码
 		txtResult.value = _tokens;  							//输出分析结果
	});

 })();
