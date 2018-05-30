module.exports = function (caller, interval = 10000) {
    setInterval(async () => {
        await caller();
    }, interval)
}