jQuery(document).ready(function() {


    var total = $('.kt-wizard-v4__nav-item').length;
    var pending = $('a[data-ktwizard-state="pending"]').length;
    var done = total - pending;
    var hasil = done/total * 100;
    var persen = hasil.toFixed(2);
    var pagging = "Halaman ke " + done + " dari " + total;
    $(".progress-djp div").text(persen + "%");
    $(".progress-djp div").css("width", persen + "%");
    $(".pagging-djp").text(pagging);

//    $(".kt-wizard-v4__nav-item, button[data-ktwizard-type='action-prev'], button[data-ktwizard-type='action-next']").click(function () {
//        var pending = $('a[data-ktwizard-state="pending"]').length;
//        var done = total - pending;
//        var nopetunjuk = done - 1;
//        var hasil = done/total * 100;
//        var persen = hasil.toFixed(2);
//        var pagging = "Halaman ke " + done + " dari " + total;
//        $(".progress-djp div").text(persen + "%");
//        $(".progress-djp div").css("width", persen + "%");
//        $(".pagging-djp").text(pagging);
//        $(".petunjuk-wizard").removeClass("show");
//        $(".petunjuk-wizard:eq("+nopetunjuk+")").addClass("show");
//    });

    $("#btn_collapse_help").click(function () {
        $(".petunjuk").removeClass("col-md-3").addClass("col-md-12");
        $(".petunjuk").removeClass("help-show").addClass("help-hide");
        $(".halaman-utama").removeClass("col-md-9").addClass("col-md-12");
        $("#btn_show_help").css("display", "unset");
    });

    $("#btn_show_help").click(function () {
        $(".petunjuk").removeClass("help-hide").addClass("help-show");
        $(".petunjuk").removeClass("col-md-12").addClass("col-md-3");
        $(".halaman-utama").removeClass("col-md-12").addClass("col-md-9");
        $("#btn_show_help").css("display", "none");
    });

});
