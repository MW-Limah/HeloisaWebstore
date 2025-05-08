const express = require('express');
const { Payment } = require('mercadopago');

module.exports = (client) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        res.send('Webhook ativo!');
    });

    router.post('/', async (req, res) => {
        console.log('✅ Webhook chamado com dados:', req.body);

        try {
            const { type, data } = req.body;

            if (type === 'payment') {
                const paymentId = data.id;

                try {
                    const payment = await new Payment(client).get({ id: paymentId });

                    if (payment.status === 'approved') {
                        console.log('💰 Pagamento aprovado:', {
                            id: payment.id,
                            valor: payment.transaction_amount,
                            comprador: payment.payer.email,
                            método: payment.payment_method_id,
                        });
                    } else {
                        console.log('⚠️ Pagamento ainda não aprovado:', payment.status);
                    }
                } catch (error) {
                    console.error('❌ Erro ao buscar pagamento com id:', paymentId);
                    console.error(error.message || error);
                }
            }

            res.status(200).send('OK');
        } catch (err) {
            console.error('❌ Erro no webhook:', err);
            res.status(500).send('Erro no webhook');
        }
    });

    return router;
};
