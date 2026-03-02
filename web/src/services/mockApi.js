export const simulateAntigravityResponse = async (message) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Antigravity Response to: ${message}`);
        }, 1000);
    });
};