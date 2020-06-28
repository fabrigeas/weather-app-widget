# Weather Widget

Humans!

This is a minimalist weather widget written in vanilla js.
The app does the following:

- gets user position
- use user's position to fetch fetch weather data from API
- parse and render fetched weather data in a div

## How to run the widget

- Link the weather-widget.js file to your .html file
- create an empty tag with the id 'weatherWidgetDomContainer'
- The script(widget) will automatically execute once the tab has loaded

```
  <html>
    <body>
      <!-- Provide a div with the id 'weatherWidgetDomContainer' -->
      <div id='weatherWidgetDomContainer'> </div>

      <!-- Link the script file -->
      <script src='path/to/weather-widget.js'></script>
    </body>
  </html>

```
