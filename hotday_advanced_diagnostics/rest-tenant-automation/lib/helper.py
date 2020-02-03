import os
import json


def load_jsons_as_text(path):
    JSONS = load_jsons(path, True)
    return JSONS

def load_jsons(path, loadAsText=False):
    jsonsList = os.listdir(path)
    JSONS = []
    for j in jsonsList:
        if '.json' in j:
            filePath = path + '/' + j
            if loadAsText:
                json_txt = (open( filePath, 'r', encoding='utf8')).read()
                JSONS.append(json_txt)
            else:
                JSONS.append(json.load(open(filePath, 'r')))
    return JSONS
