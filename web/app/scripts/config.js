angular.module('config', [])
.constant('cfg', 
    {
  endpoint: 'https://deadbeef-6d99-41a8-988a-c31ce4ae14dc_vp1-api.blockchain.ibm.com:443/chaincode',
  secureContext: 'user_type1_deadbeef',
  chaincodeID: 'badeadbeeff1ec5ab1d077cb38907780c79260420fd94c288d6bddb710114c44969b9d560d365e38b62d379681e2acaa5b88536ebd22d6ed56c0605736349',
  users: [{id: 'user0', role: 'role0'},
          {id: 'user1', role: 'role0'},
          {id: 'user2', role: 'role1'},
          {id: 'user3', role: 'role1'}]
    }
);
