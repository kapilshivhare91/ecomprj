$(document).ready(function () {
    // Add to Cart Logic
    $(".add-to-cart-btn").on("click", function () {
        let _this = $(this);
        let _index = _this.attr("data-index");

        let quantity = $(".product-qty-" + _index).val();
        let product_title = $(".product-title-" + _index).val();
        let product_id = $(".product-id-" + _index).val();
        let product_price = $(".product-price-" + _index).val(); // Should be current price
        let product_image = $(".product-image-" + _index).val();
        let this_btn = _this;

        console.log("Adding:", product_title, "Qty:", quantity);

        $.ajax({
            url: '/add-to-cart',
            data: {
                'id': product_id,
                'qty': quantity,
                'title': product_title,
                'price': product_price,
                'image': product_image,
            },
            dataType: 'json',
            beforeSend: function () {
                this_btn.html('<i class="fas fa-spinner fa-spin"></i> Adding...');
            },
            success: function (response) {
                this_btn.html('<i class="fas fa-check"></i> Added');
                $(".cart-items-count").text(response.totalcartitems); // Update Navbar count

                // Optional: Reset button after 2 seconds
                setTimeout(function () {
                    this_btn.html('<i class="fas fa-shopping-cart"></i> Add');
                }, 2000);
            }
        });
    });

    // Delete Item from Cart Logic
    $(document).on("click", ".delete-product", function () {
        let product_id = $(this).attr("data-product");
        let this_val = $(this);
        console.log("Deleting:", product_id);

        $.ajax({
            url: "/delete-from-cart",
            data: {
                "id": product_id
            },
            dataType: "json",
            success: function (response) {
                $(".cart-items-count").text(response.totalcartitems);
                $("#cart-list").html(response.data); // Refreshes the cart table list
            }
        });
    });
});
