var BASE_URL = "/dev-api";// 接口地址

// @if NODE_ENV = 'development'
BASE_URL = '';
// @endif
// @if NODE_ENV = 'production'
BASE_URL = '';
// @endif