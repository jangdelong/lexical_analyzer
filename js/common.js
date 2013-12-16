/*
 * document name: common.js
 * edited by: Jelon Zhang
 * date: 2013/5/14 
 *
 */

(function() {
	var btnReset = document.getElementById("btnReset");
	var txtCode = document.getElementById("txtCode");
	var txtResult = document.getElementById("txtResult");


	//清空重置
	btnReset.onclick = function() {
		if (txtCode.value != '' || txtResult.value != '') {
			txtResult.value = '';
			txtCode.value = '';
		}
		txtCode.focus();
	}

	//载入页面时，源代码框获取焦点
	window.onload = function() {
		if (txtCode.value != '' || txtResult.value != '') {
			txtCode.value = '';
			txtResult.value = '';
		}
		txtCode.focus();
	}
	
})();
