$(document).ready(function() {

	new Image().src = "img/wheel_active.png";

	function OpenWindow(targetWindow) {
		$(targetWindow).arcticmodal({
			closeOnEsc: false,
			closeOnOverlayClick: false,
			openEffect: {
				type: "none"
			},
			overlay: {
				css: {
					backgroundColor: "#0C111D",
					opacity: .70
				}
			}
		});
	}

	$(".js-order_button").click(function(){
		
		$(".js-bonus_window").hide();
		OpenWindow(".js-order_window");

	});

	$(".js-wheel_button").click(function(){

		if (!$(this).hasClass("disabled")) {

			$(".js-wheel_button").addClass("disabled");
			$(".js-wheel").addClass("rotate");

			setTimeout(function() {
				$(".js-wheel").addClass("wheel_active");
				$(".js-wheel").removeClass("rotate");
				$(".js-bonus_window").fadeIn(300);
			}, 5000);

			setTimeout(function() {
				$(".js-bonus_window").hide();
				OpenWindow(".js-order_window");
			}, 10000);
			
		}

	});

});