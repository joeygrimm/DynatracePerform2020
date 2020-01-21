* In order to allow for a Plugin to be configurable the sections '''properties''' and '''configUI''' within '''plugin.json''' need to get completed
* Make sure to use the same key within the '''properties''' and the '''configUI''' section
* '''space_x_plugin.py''' contains a new method '''initialize'''.
* It evaluates the base URL that has been hard coded previously before the method '''query''' is being called
* Complete the code within method '''initialize'''. Hint: use the same key you have been using within '''plugin.json'''
* There exists a new file '''properties.json'''. What is it used for? Add the missing content to this file.