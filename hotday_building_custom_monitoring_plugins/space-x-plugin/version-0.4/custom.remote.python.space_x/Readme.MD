* The metric for the thrust is a bit more complex.
* Thrust is being reported per engine - which makes it a multi dimensional metric
* Complete the entry for that metric within '''plugin.json'''. Make sure to use a proper unit. Also don't forget to mention in there, that this metric has an additional dimension for the engine.
* Complete the python code that reports measurements for that metric

* The Plugin also reports the property for the URL of every ship
* Replicate that code, in order to also report the Home Port of the ship

* The IP Address of the Ship is yet another property you should report to Dynatrace
* IP Addresses are very special for Dynatrace. Report it as a so-called EndPoint