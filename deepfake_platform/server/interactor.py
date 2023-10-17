import os
from pymongo import MongoClient

# db config
# <user>:<pw>@<ip>
user_pw_prefix = ""
ip_port = "localhost:27017"
db_name = "Hackathon"
collection_name = "info"
CONNECTION_STRING = f"mongodb://{user_pw_prefix}{ip_port}/{db_name}"

# data config
ARTICLE_PATH = "data/articles"

######## db utils #######

def get_db():
   client = MongoClient(CONNECTION_STRING)
   return client[db_name][collection_name]

def insert(info):
   return get_db().insert_one(info)

def get():
   return get_db().find()

def showAll():
   for i in get_db().find():
      print(i)

def delete():
   return get_db().delete_many({"title":"Untitled"})

####### file path ########

def get_store_path():
   dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
   store_path = os.path.join(dir_path,ARTICLE_PATH)
   if not os.path.exists(store_path):
      os.makedirs(store_path)
   return store_path

def get_relative_path(rel_path):
   store_path = get_store_path()
   origin_path = os.path.join(store_path,rel_path)
   i = 0
   file_path = f'{origin_path}_{i}'
   while os.path.exists(file_path):
      i += 1
      file_path = f'{origin_path}_{i}'

   return f'{rel_path}_{i}'

if __name__ == "__main__":   
   # showAll()
   delete()