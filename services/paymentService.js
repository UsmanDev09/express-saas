const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const checkoutSession = async (products, res) => {
    try {
        const lineItems = products.map(product => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: product.name,
                },
                unit_amount: product.price * 100,
            },
            quantity: product.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_HOST_URL}/success`,
            cancel_url: `${process.env.FRONTEND_HOST_URL}/cancel`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    checkoutSession,
};
