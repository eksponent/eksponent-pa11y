# Eksponent pa11y #

## Build docker image ##

````bash
docker build -t eksponent/eksponent-pa11y .
````

## How to use it ##

By default it exposes the port 8080.

````bash
docker run -p 49160:8080 eksponent/pa11y
````

Given the configuration file that tests the frontpage of eksponent.com using two viewports.  

```json
{
  "standard": "WCAG2AAA",
  "level": "error",
  "defaults": {
    "timeout": 50000,
    "runners": ["axe"],
    "ignore": [],
    "chromeLaunchConfig": {
      "args": ["--no-sandbox"]
    }
  },
  "urls": [
    {
      "url": "https://eksponent.com",
      "viewport": { "width": 320, "height": 480 },
      "actions": []
    },
    {
      "url": "https://eksponent.com",
      "viewport": { "width": 1024, "height": 768 },
      "actions": []
    }
  ]
}
```

a cURL request will generate a json response with the result of the test

```bash
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"standard": "WCAG2AAA","level": "error","defaults": {"runners": ["axe"], "timeout": 50000,"ignore": [],"chromeLaunchConfig": {"args": ["--no-sandbox"]}},"urls": [{"url": "https://eksponent.com","viewport": { "width": 320, "height": 480 },"actions": []},{"url": "https://eksponent.com","viewport": { "width": 1024, "height": 768 },"actions": []}]}' \
  http://192.168.99.100:49160/
```