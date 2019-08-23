var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'));

const MultisigContract = new web3.eth.Contract(MULTISIG_ABI, MULTISIG_ADDRESS);
const TestContract = new web3.eth.Contract(TEST_ABI, TEST_ADDRESS);

var auth = {
    admin1: '',
    admin2: '',
    signer1: '',
    signer2: '',
    client1: '',
    client2: '',
    client3: '',
};

const Home = {
    message: {
        toAddress: "",
        ethValue: "",
        data: "",
        expireTime: "",
        sequenceId: "",
        operationHash: "",
        signature: "",
    },

    start: async function () {
        const admin = await web3.eth.getAccounts();
        auth = {
            admin1: admin[0],
            admin2: admin[1],
            signer1: admin[2],
            signer2: admin[3],
            client1: admin[4],
            client2: admin[5],
            client3: admin[6],
        };
        web3.eth.defaultAccount = auth.admin1;
        $('#owner').text(await TestContract.methods.who().call());
    },

    //setChangeA()를 실행한 후에 실행해야 함
    //세팅된 값들을 이용해 Test 컨트랜트의 changeA()를 실행시키는 기능
    sendMultiSig: async function () {
        let sendData = await web3.eth.abi.encodeFunctionCall({
            name: 'changeA',
            type: 'function',
            inputs: []
        }, []);

        let tx = {
            from: auth.admin1,
            to: MULTISIG_ADDRESS,
            gas: 2000000,
            data: MultisigContract.methods.sendMultiSig(
                this.message.toAddress, 
                this.message.ethValue, 
                sendData, 
                this.message.expireTime, 
                this.message.sequenceId, 
                this.message.signature).encodeABI(),
        };

        try {
            console.log("web3.eth.defaultAccount: ", web3.eth.defaultAccount);
            await web3.eth.sendTransaction(tx);
            location.reload();
        } catch (e) {
            alert(e);
        }
    },

    changeA: async function () {
        let tx = {
            from: auth.admin1,
            to: TEST_ADDRESS,
            gas: 200000,
            data: await web3.eth.abi.encodeFunctionCall({
                name: 'changeA',
                type: 'function',
                inputs: []
            }, [])
        };

        try{
            await web3.eth.sendTransaction(tx);
            alert("success");
        } catch(e) {
            console.log(e);
        }
    },

    changeOwner: async function () {
        let sendData = TestContract.methods.changeOwner('0x8ab6a9949b621F75e056533b22D79f304d706B4b').encodeABI();

        let tx = {
            from: auth.admin1,
            to: MULTISIG_ADDRESS,
            gas: 2000000,
            data: MultisigContract.methods.sendMultiSig(
                this.message.toAddress, 
                this.message.ethValue, 
                sendData, 
                this.message.expireTime, 
                this.message.sequenceId, 
                this.message.signature).encodeABI(),
        }
        try{
            await web3.eth.sendTransaction(tx);
            alert("success");
            location.reload();
        } catch(e) {
            console.log(e);
        }
    },

    ChangeOwnerToMulti: async function () {
        try{
            let tx = {
                from: auth.admin1,
                to: TEST_ADDRESS,
                gas: 2000000,
                data: TestContract.methods.changeOwner(MULTISIG_ADDRESS).encodeABI(),
            }
            await web3.eth.sendTransaction(tx);
            alert("success");
            location.reload();
        } catch(e) {
            console.log(e);
        }
    },

    setChangeA: async function () {
        this.message.toAddress = TEST_ADDRESS;
        this.message.ethValue = 0;
        this.message.data = await web3.eth.abi.encodeFunctionCall({
            name: 'changeA',
            type: 'function',
            inputs: []
        }, []);
        let timestamp = new Date()/1000;
        this.message.expireTime = Math.floor(+ (timestamp + 600));
        this.message.sequenceId = await MultisigContract.methods.getNextSequenceId().call();
        this.message.operationHash = await web3.utils.soliditySha3(
            { type: 'string', value: 'ETHER' },
            { type: 'address', value: this.message.toAddress },
            { type: 'uint', value: this.message.ethValue },
            { type: 'bytes', value: this.message.data },
            { type: 'uint', value: this.message.expireTime },
            { type: 'uint', value: this.message.sequenceId });

        this.message.signature = await web3.eth.sign(this.message.operationHash, auth.admin2);
        let recoverData = await web3.eth.accounts.recover(this.message.operationHash, this.message.signature);

        $('#signer').text('signer : ' + auth.admin1);
        $('#to-address').text('toAddress : ' + this.message.toAddress);
        $('#value').text('value : ' + this.message.ethValue);
        $('#data').text('data : ' + this.message.data);
        $('#timestamp').text('timestamp : ' + timestamp);
        $('#expireTime').text('expireTime : ' + this.message.expireTime);
        $('#sequenceId').text('sequenceId : ' + this.message.sequenceId);
        $('#operationHash').text('operationHash : ' + this.message.operationHash);
        $('#signature').text('signature : ' + this.message.signature);
        $('#recover').text('recover : ' + recoverData);
    },

    setChangeOwner: async function () {
        this.message.toAddress = TEST_ADDRESS;
        this.message.ethValue = 0;
        this.message.data = TestContract.methods.changeOwner(auth.admin1).encodeABI();
        let timestamp = new Date()/1000;
        this.message.expireTime = Math.floor(+ (timestamp + 600));
        this.message.sequenceId = await MultisigContract.methods.getNextSequenceId().call();
        this.message.operationHash = await web3.utils.soliditySha3(
            { type: 'string', value: 'ETHER' },
            { type: 'address', value: this.message.toAddress },
            { type: 'uint', value: this.message.ethValue },
            { type: 'bytes', value: this.message.data },
            { type: 'uint', value: this.message.expireTime },
            { type: 'uint', value: this.message.sequenceId });

        // let pkey = '180eb2e70669b241d455c2e39bfea17f84a48ae2ff34eacb885c768edb030fe3';
        this.message.signature = await web3.eth.sign(this.message.operationHash, auth.admin2);
        let recoverData = await web3.eth.accounts.recover(this.message.operationHash, this.message.signature);

        $('#signer').text('signer : ' + auth.admin1);
        $('#to-address').text('toAddress : ' + this.message.toAddress);
        $('#value').text('value : ' + this.message.ethValue);
        $('#data').text('data : ' + this.message.data);
        $('#timestamp').text('timestamp : ' + timestamp);
        $('#expireTime').text('expireTime : ' + this.message.expireTime);
        $('#sequenceId').text('sequenceId : ' + this.message.sequenceId);
        $('#operationHash').text('operationHash : ' + this.message.operationHash);
        $('#signature').text('signature : ' + this.message.signature);
        $('#recover').text('recover : ' + recoverData);
    },
};

window.Home = Home;

window.addEventListener("load", function() {
    Home.start();
});