const express = require('express');
const { Payment } = require('mercadopago');

module.exports = (client) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        res.send('Webhook ativo!');
    });

    router.post('/', async (req, res) => {
        console.log('✅ Webhook chamado com dados:', req.body); // 🔔 LOG DIRETO AQUI

        try {
            const { type, data } = req.body;

            if (type === 'payment') {
                const paymentId = data.id;

                const payment = await new Payment(client).get({ id: paymentId });

                if (payment.status === 'approved') {
                    console.log('💰 Pagamento aprovado:', {
                        id: payment.id,
                        valor: payment.transaction_amount,
                        comprador: payment.payer.email,
                        método: payment.payment_method_id,
                    });

                    // Aqui você pode atualizar a base de dados ou outra ação
                } else {
                    console.log('⚠️ Pagamento ainda não aprovado:', payment.status);
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
