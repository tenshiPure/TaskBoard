from tornado import websocket, web, ioloop
import tornado
from HentaiAPI import HentaiAPI
import os.path

clients = []

class IndexHandler(tornado.web.RequestHandler):

	def get(self):
		#self.render("index.html")
		self.render("index_yasu.html")

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
		self.finish()
		text = self.get_argument("text")

		api = HentaiAPI()
		apiResult = api.create(text)

		for client in clients:
			client.write_message(apiResult)

class Update(tornado.web.RequestHandler):

	@tornado.web.asynchronous
	def post(self, *args):
		id = self.get_argument("id")
		text = self.get_argument("text")

		api = HentaiAPI()
		apiResult = api.update(id, text)

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
		(r'/update', Update),
		(r'/done', Done),
		(r'/db_clear', DbClear),
	]

	settings = dict(
		static_path=os.path.join(os.path.dirname(__file__), "static"),
	)

	app = tornado.web.Application(handlers, **settings)

	app.listen(5000)
	tornado.ioloop.IOLoop.instance().start()
