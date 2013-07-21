from tornado import websocket, web, ioloop
import tornado
import sys
import os.path

sys.path.append('module')
from HentaiAPI import HentaiAPI

clients = []

class IndexHandler(tornado.web.RequestHandler):
	def get(self):
		self.render("index.html")

class SocketHandler(tornado.websocket.WebSocketHandler):
	def open(self):
		if self not in clients:
			clients.append(self)

	def on_close(self):
		if self in clients:
			clients.remove(self)

class Select(tornado.web.RequestHandler):
	@tornado.web.asynchronous
	def get(self, *args):
		id = self.get_argument("id")

		api = HentaiAPI()
		apiResult = api.select(id)

		for client in clients:
			client.write_message(apiResult)

		self.finish()

class SelectAll(tornado.web.RequestHandler):
	@tornado.web.asynchronous
	def get(self, *args):
		api = HentaiAPI()
		apiResult = api.selectAll()

		self.write(apiResult);
		self.finish()

class Create(tornado.web.RequestHandler):
	@tornado.web.asynchronous
	def post(self, *args):
		text = self.get_argument("text")

		api = HentaiAPI()
		apiResult = api.create(text)

		for client in clients:
			client.write_message(apiResult)

		self.finish()

class Done(tornado.web.RequestHandler):
	@tornado.web.asynchronous
	def post(self, *args):
		id = self.get_argument("id")

		api = HentaiAPI()
		apiResult = api.done(id)

		for client in clients:
			client.write_message(apiResult)

		self.finish()

class DbClear(tornado.web.RequestHandler):
	@tornado.web.asynchronous
	def get(self, *args):
		api = HentaiAPI()
		api._clear()

		self.finish()

if __name__ == '__main__':
	handlers = [
		(r'/', IndexHandler),
		(r'/ws', SocketHandler),
		(r'/select', Select),
		(r'/select_all', SelectAll),
		(r'/create', Create),
		(r'/done', Done),
		(r'/db_clear', DbClear),
	]

	settings = dict(
		static_path=os.path.join(os.path.dirname(__file__), "static"),
	)

	app = tornado.web.Application(handlers, **settings)

	port = 8080 if os.name == 'nt' else 5000
	app.listen(port)
	tornado.ioloop.IOLoop.instance().start()
