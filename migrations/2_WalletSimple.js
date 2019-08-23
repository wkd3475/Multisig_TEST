const WalletSimple = artifacts.require("WalletSimple");
const fs = require('fs');

module.exports = function(deployer) {
    let inputs = ['0x8ab6a9949b621F75e056533b22D79f304d706B4b', '0xF06980FB60DD607E6b8F73FEbA76A7a03799c865', '0xF1Ff430506c8C81DeeFDE44f6Ad2E581239A0Bfc'];
    deployer.deploy(WalletSimple, inputs)
    .then(() => {
        if (WalletSimple._json) {
            fs.writeFile('MultisigABI', JSON.stringify(WalletSimple._json.abi),
                (err) => {
                    if (err) throw err;
                    console.log("파일에 ABI 입력 성공");
                }
            )
            fs.writeFile('MultisigAddress', WalletSimple.address,
                (err) => {
                    if (err) throw err;
                    console.log("파일에 주소 입력 성공");
                }
            )
        }
    });
};