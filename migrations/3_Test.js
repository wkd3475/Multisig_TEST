const Test = artifacts.require("Test");
const fs = require('fs');
const MultisigAddress = fs.readFileSync('../MultisigAddress', 'utf8').replace(/\n|\r/g, "");

module.exports = function(deployer) {
    deployer.deploy(Test, MultisigAddress)
    .then(() => {
        if (Test._json) {
            fs.writeFile('TestABI', JSON.stringify(Test._json.abi),
                (err) => {
                    if (err) throw err;
                    console.log("파일에 ABI 입력 성공");
                }
            )
            fs.writeFile('TestAddress', Test.address,
                (err) => {
                    if (err) throw err;
                    console.log("파일에 주소 입력 성공");
                }
            )
        }
    });
};