# MyCalTracker (VandyHacks 2018)
---
MyCalTracker was originally created during VandyHacks 2018 (Vanderbilt's annual hackathon).
This is a service that integrates with Amazon Alexa in order to help users tracker their caloric
and nutritional intake. This repo includes code for the backend (Amazon Lambda) as well as frontend code.

#### Index:
---
- Structure
- Requirements
- Deployment
- Notes
- License

#### Structure
---
The following is the structure of the folder as well as a short desc. of each folder and file

    └──  lambda                     # Folder contains all of the backend code for the service
        └──  core                   
            └──  logik.js           # File contains all DB logic
        └──  routes
            └── edamam.js           # File contains the
        └──  index.js
        └──  package-lock.json
        └──  package.json
        └──  skills.json
    └──  web
        └──  static
            └──  css
            └──  js
            └──  plugins
        └──  templates
            └──  index.html

#### Requirements
---
- Amazon Services
- AWS SDK (npm)
- Request (npm)

#### Deployment

#### Notes

#### License
---
TrackerVH is licensed under The MIT License (MIT). Which means that you can use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the final products. But you always need to state that Ankush Patel and vjsrinivas are the original authors of this project.
