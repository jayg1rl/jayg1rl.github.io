var routes = [
  {
    path: '/',
    templateUrl: './pages/index.html',
    name: 'Home Page',
  },{
    path: '/home/',
    templateUrl: './pages/home.html',
    name: 'Dashboard',
  },{
    path: '(.*)',
    templateUrl: './pages/404.html',
	name: 'Error',
  },
];
