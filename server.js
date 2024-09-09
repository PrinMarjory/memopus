const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/auth', (req, res) => {
  const { username, password } = req.body;
  const user = router.db.get('users').find({ username, password }).value();

  if (user) {
    res.jsonp({ success: true });
  } else {
    res.jsonp({ success: false });
  }
});

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});