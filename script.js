document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.getElementById('cart');
    const totalAmountElement = document.getElementById('total-amount');
    const checkoutButton = document.getElementById('checkout-button');
    const removeAllButton = document.getElementById('remove-all-button');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const productDetail = document.querySelector('.product-detail');
    const productGrid = document.getElementById('product-grid');

    if (productDetail) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productItem = button.closest('.product-detail');
                addToCart(productItem, true); // true indicates this is a detailed product
            });
        });
    }

    if (productGrid) {
        productGrid.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-to-cart')) {
                const productItem = event.target.closest('.product-item');
                addToCart(productItem, false); // false indicates this is from the product grid
            }
        });
    }

    function addToCart(productItem, isDetail) {
        let productId, productName, productPrice;

        if (isDetail) {
            productId = productItem.getAttribute('data-id');
            productName = productItem.querySelector('h2').innerText;
            productPrice = parseFloat(productItem.querySelector('p:nth-child(3)').innerText.replace('Price: $', ''));
        } else {
            productId = productItem.getAttribute('data-id');
            productName = productItem.getAttribute('data-name');
            productPrice = parseFloat(productItem.getAttribute('data-price'));
        }

        const cartItem = {
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        };

        const existingItemIndex = cart.findIndex(item => item.id === productId);
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(cartItem);
        }

        updateCartDisplay();
        saveCart();
    }

    function removeFromCart(productId) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex !== -1) {
            cart.splice(itemIndex, 1);
            updateCartDisplay();
            saveCart();
        }
    }

    function removeAllFromCart() {
        cart.length = 0;
        updateCartDisplay();
        saveCart();
    }

    function updateCartDisplay() {
        cartList.innerHTML = '';
        let totalAmount = 0;
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-button');
            removeButton.addEventListener('click', () => removeFromCart(item.id));
            li.appendChild(removeButton);
            cartList.appendChild(li);
            totalAmount += item.price * item.quantity;
        });
        totalAmountElement.textContent = totalAmount.toFixed(2);
    }

    function handleProceedToCheckout() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        alert('Proceeding to checkout...');
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    checkoutButton.addEventListener('click', handleProceedToCheckout);
    removeAllButton.addEventListener('click', removeAllFromCart);

    updateCartDisplay();
});
