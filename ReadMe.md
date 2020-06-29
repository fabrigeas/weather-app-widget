# Weather Widget

Humans!

This is a minimalist weather widget written in vanilla js.
The app does the following:

- gets user position
- use user's position to fetch fetch weather data from API
- parse and render fetched weather data in a placeholder div that you must provide

## How to run the widget

- Link the weather-widget.js file to your .html file
- create an empty tag with the id 'weatherWidgetDomContainer'
- The script(widget) will automatically execute once the tab has loaded

```
<body>

  <script src='weather-widget.js'></script>  <-- here you link(install) the widget
  <div id='weatherWidgetDomContainer'></div> <-- provide a placeholder div where the widget will be displayed

</body>

```
