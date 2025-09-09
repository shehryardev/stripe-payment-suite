require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createStripeProducts() {
    try {
        console.log('🚀 Setting up Stripe products...\n');

        // Create products
        const products = [
            {
                name: 'Basic Plan',
                description: 'Perfect for individuals and small projects',
                price: 999, // $9.99 in cents
                interval: 'month',
                features: ['Up to 1,000 transactions', 'Basic analytics', 'Email support']
            },
            {
                name: 'Pro Plan',
                description: 'Ideal for growing businesses',
                price: 2999, // $29.99 in cents
                interval: 'month',
                features: ['Up to 10,000 transactions', 'Advanced analytics', 'Priority support', 'API access']
            },
            {
                name: 'Enterprise Plan',
                description: 'For large-scale operations',
                price: 9999, // $99.99 in cents
                interval: 'month',
                features: ['Unlimited transactions', 'Custom analytics', '24/7 support', 'Custom integrations']
            }
        ];

        const createdProducts = [];

        for (const product of products) {
            console.log(`Creating product: ${product.name}...`);

            // Create the product
            const stripeProduct = await stripe.products.create({
                name: product.name,
                description: product.description,
                metadata: {
                    features: JSON.stringify(product.features)
                }
            });

            // Create the price
            const stripePrice = await stripe.prices.create({
                product: stripeProduct.id,
                unit_amount: product.price,
                currency: 'usd',
                recurring: {
                    interval: product.interval
                },
                metadata: {
                    plan_type: product.name.toLowerCase().replace(' ', '_')
                }
            });

            createdProducts.push({
                id: stripeProduct.id,
                name: product.name,
                description: product.description,
                price: product.price,
                priceId: stripePrice.id,
                interval: product.interval,
                features: product.features
            });

            console.log(`✅ Created: ${product.name} - $${(product.price / 100).toFixed(2)}/${product.interval}`);
            console.log(`   Product ID: ${stripeProduct.id}`);
            console.log(`   Price ID: ${stripePrice.id}\n`);
        }

        console.log('🎉 All products created successfully!\n');
        console.log('📋 Product Summary:');
        console.log('==================');

        createdProducts.forEach(product => {
            console.log(`${product.name}:`);
            console.log(`  - Price: $${(product.price / 100).toFixed(2)}/${product.interval}`);
            console.log(`  - Product ID: ${product.id}`);
            console.log(`  - Price ID: ${product.priceId}`);
            console.log('');
        });

        // Save to a config file for the app
        const fs = require('fs');
        const configPath = './src/config/stripe-products.json';

        // Ensure directory exists
        const path = require('path');
        const dir = path.dirname(configPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(configPath, JSON.stringify(createdProducts, null, 2));
        console.log(`💾 Product configuration saved to: ${configPath}`);

        return createdProducts;

    } catch (error) {
        console.error('❌ Error creating products:', error.message);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    createStripeProducts()
        .then(() => {
            console.log('\n✅ Setup complete! You can now use real Stripe payments.');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Setup failed:', error.message);
            process.exit(1);
        });
}

module.exports = { createStripeProducts };
