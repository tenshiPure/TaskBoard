#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json

class HentaiHelper():

	@staticmethod
	def createDict(id, text = None, status = None):
		if isinstance(id, int):
			id = str(id)

		result = {'id' : id}

		if text is not None:
			result['text'] = text

		if status is not None:
			result['status'] = status

		return result

	@staticmethod
	def convertJson(dict):
		if dict.has_key('_id'):
			del dict['_id']

		return json.dumps(dict)
