// paymentStatusStore.js

const paymentStatusMap = new Map();

function setPaymentStatus(id, status) {
    paymentStatusMap.set(id.toString(), status);
}

function getPaymentStatus(id) {
    return paymentStatusMap.get(id.toString()) || 'unknown';
}

module.exports = {
    setPaymentStatus,
    getPaymentStatus,
};
