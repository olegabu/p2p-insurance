/**
 * @class PeerService
 * @classdesc
 * @ngInject
 */
function PeerService($log, $q, $http, cfg, UserService) {

  // jshint shadow: true
  var PeerService = this;

  var payload = {
      'jsonrpc': '2.0',
      'params': {
        'type': 1,
        'chaincodeID': {
          name: cfg.chaincodeID
        },
        'ctorMsg': {}
      },
      'id': 0
  };

  var invoke = function(functionName, functionArgs) {
    $log.debug('PeerService.invoke');

    payload.method = 'invoke';
    payload.params.ctorMsg['function'] = functionName;
    payload.params.ctorMsg.args = functionArgs;
    payload.secureContext = UserService.getUser().id;

    $log.debug('payload', payload);

    return $http.post(cfg.endpoint, angular.copy(payload)).then(function(data) {
      $log.debug('result', data.data.result);
    });
  };

  var query = function(functionName, functionArgs) {
    $log.debug('PeerService.query');
    
    var d = $q.defer();

    payload.method = 'query';
    payload.params.ctorMsg['function'] = functionName;
    payload.params.ctorMsg.args = functionArgs;
    payload.secureContext = UserService.getUser().id;

    $log.debug('payload', payload);

    $http.post(cfg.endpoint, angular.copy(payload)).then(function(data) {
      $log.debug('result', data.data.result);
      d.resolve(data.data.result);
    });

    return d.promise;
  };

}


angular.module('peerService', []).service('PeerService', PeerService);