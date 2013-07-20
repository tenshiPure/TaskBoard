#!/usr/bin/env python
# -*- coding: utf-8 -*-

from pymongo import MongoClient
from HentaiHelper import HentaiHelper
import json

class HentaiAPI():

	def __init__(self):
		self.client = MongoClient('localhost', 27017)
		self.db = self.client.hentai_db
		self.collection = self.db.hentai_collection

	def select(self, id):
		dict = HentaiHelper.createDict(id)

		fetchResult = self.collection.find_one(dict)
		
		return HentaiHelper.convertJson(fetchResult)

	def selectAll(self):
		fetchResult = self.collection.find()

		returnJsons = {}
		index = 0
		for row in fetchResult:
			returnJsons[index] = HentaiHelper.convertJson(row)
			index += 1
		
		return json.dumps(returnJsons)

	def create(self, text):
		id = self._getLatestId()
		dict = HentaiHelper.createDict(id, text, 'new')
		self.collection.insert(dict)

		return HentaiHelper.convertJson(dict)

	def update(self, id, text):
		before = self._selectByDict(id)
		after = HentaiHelper.createDict(id, text, before['status'])

		self.collection.update(before, after)

	def done(self, id):
		before = self._selectByDict(id)
		after = HentaiHelper.createDict(id, before['text'], 'done')

		self.collection.update(before, after)

		return HentaiHelper.convertJson(after)

	def _getLatestId(self):
		fetchResult = self.collection.find()
		
		latestid = 0
		for row in fetchResult:
			if int(row['id']) > latestid:
				latestid = int(row['id'])

		return latestid + 1

	def _selectByDict(self, id):
		dict = HentaiHelper.createDict(id)

		return self.collection.find_one(dict)

	def _clear(self):
		self.collection.remove()

