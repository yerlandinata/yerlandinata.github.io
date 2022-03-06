/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    $("input[name=rbStep1]:radio").change(function () {
        var step1 = $("input[name=rbStep1]:checked").val();
        $("#rbs21").prop("checked", false);
        $("#rbs22").prop("checked", false);
        if (step1 === "1") {
            $("#divUpload").show();
            $("#step2").hide();
            $("#step3").hide();
            $("#step4").hide();
            $("#divS").hide();
            $("#divSS").hide();
        } else {
            $("#step2").show();
            $("#divUpload").hide();
            $("#step3").hide();
            $("#step4").hide();
            $("#divS").hide();
            $("#divSS").hide();
        }
    });
    $("input[name=rbStep2]:radio").change(function () {
        var step2 = $("input[name=rbStep2]:checked").val();
        $("#rbs31").prop("checked", false);
        $("#rbs32").prop("checked", false);
        $("#rbs41").prop("checked", false);
        $("#rbs42").prop("checked", false);
        $("#rbs43").prop("checked", false);
        if (step2 === "1") {
            $("#step4").show();
            $("#divS").show();
            $("#btn2").hide();
            $("#btn3").hide();
            $("#btn5").hide();
            $("#divUpload").hide();
            $("#step3").hide();
            $("#divSS").hide();
        } else {
            $("#step3").show();
            $("#divUpload").hide();
            $("#step4").hide();
            $("#divS").hide();
            $("#divSS").hide();
        }
    });
    $("input[name=rbStep3]:radio").change(function () {
        var step3 = $("input[name=rbStep3]:checked").val();
        $("#rbs41").prop("checked", false);
        $("#rbs42").prop("checked", false);
        $("#rbs43").prop("checked", false);
        if (step3 === "1") {
            $("#divSS").show();
            $("#divS").hide();
            $("#step4").hide();
        } else {
            $("#step4").show();
            $("#divS").show();
            $("#btn2").hide();
            $("#btn3").hide();
            $("#btn5").hide();
            $("#divSS").hide();
        }
    });
    $("input[name=rbStep4]:radio").change(function () {
        var step4 = $("input[name=rbStep4]:checked").val();
        if (step4 === "1") {
            $("#btn2").show();
            $("#btn3").hide();
            $("#btn5").hide();
        } else if (step4 === "2") {
            $("#btn2").hide();
            $("#btn3").show();
            $("#btn5").hide();
        } else {
            $("#btn2").hide();
            $("#btn3").hide();
            $("#btn5").show();
        }
    });
});

