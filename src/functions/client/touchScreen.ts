export const isBotanyTouchscreen = async () => {
    if (await fetch('/api/ip').then(res => res.text()) === '137.150.35.115') return true
    return false
}