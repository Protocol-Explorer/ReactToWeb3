interface Address {
    crowdFund: `0x${string}`;
    reactToWebToken: `0x${string}`;
}

interface Addresses {
    [key: number]: Address;
}

export const addresses: Addresses = {
    11155111: {
        crowdFund: `0x24D58c41DFd527316Ec68A4E536e6C5321899c1a`,
        reactToWebToken: `0x4b2cc2A34b5d0c82084f4Bb1C6caFEd6b5Bf06d4`,
    },
    84532: {
        crowdFund: `0x6BDc9a8610a2A1E8d1D5AD34B57F7475FA1e6B2D`,
        reactToWebToken: `0xbaE801D7a485DaD6c80ceEa0A31B986dB52B4C75`, 
    }
}
