* The metric for the thrust is a bit more complex.
* Thrust is being reported per engine - which makes it a multi dimensional metric
* Complete the entry for that metric within ```plugin.json```. Make sure to use a proper unit. Also don't forget to mention in there, that this metric has an additional dimension for the engine.
* Complete the python code that reports measurements for that metric

* The Plugin also reports the property for the URL of every ship
* Replicate that code, in order to also report the Home Port of the ship

* Add another metric for ```thrust``` and report the value
* Note: A ship usually has multiple engines. Every engine has its own value for thrust
* The IP Address of the Ship is yet another property you should report to Dynatrace
* IP Addresses are very special for Dynatrace. Report it as a so-called EndPoint
* Check out the ```Transactions and Services``` in Dynatrace. What changes can you notice here?
* Check out the Infographics of one of the ships in Dynatrace. Apart from metrics, does it contain something in addition?

* Estimate how man Custom Metrics your plugin will consume
