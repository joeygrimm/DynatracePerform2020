* '''space_x_plugin.py''' now contains a method '''load_ships''' for fetching the list of ships via HTTP
* Take a closer look that method. It tells you how to easily extract properties for a ship later on
* The method '''query''' now consists of two nested loops - the outer one iterating over the types of ships, the inner one iterating over the ships for each ship type
* Complete the source code within these loops
* For every ship type a technology group needs to get created
* For every ship of this ship type a custom device needs to get created
* Hint: Extracting the unique identifier of a ship looks like this: '''ship['ship_id']
* Report the currently available fuel on the ship as a measurement