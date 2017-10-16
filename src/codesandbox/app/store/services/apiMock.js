export default {
    "/api/v1/sandboxes/new":
        {
            "data": {
              "view_count": 79122,
              "version": 11,
              "user_liked": false,
              "title": null,
              "template": "create-react-app",
              "tags": [
                
              ],
              "source_id": "6bd39aa7-9800-45fb-9487-c915634d8d4f",
              "privacy": 0,
              "owned": false,
              "npm_dependencies": {
                "react-dom": "16.0.0",
                "react": "16.0.0"
              },
              "modules": [
                {
                  "title": "Hello.js",
                  "source_id": "6bd39aa7-9800-45fb-9487-c915634d8d4f",
                  "shortid": "NKZ4K",
                  "is_binary": false,
                  "id": "7546d2c4-6657-46d9-ba63-8564e0dcb463",
                  "directory_shortid": null,
                  "code": "import React from 'react';\n\nexport default ({ name }) => <h1>Hello {name}!</h1>;\n"
                },
                {
                  "title": "index.html",
                  "source_id": "6bd39aa7-9800-45fb-9487-c915634d8d4f",
                  "shortid": "BA1N",
                  "is_binary": false,
                  "id": "9c54d8d0-5a0e-4e5f-8794-3092757733ee",
                  "directory_shortid": null,
                  "code": "<div id=\"root\"></div>"
                },
                {
                  "title": "index.js",
                  "source_id": "6bd39aa7-9800-45fb-9487-c915634d8d4f",
                  "shortid": "wRo98",
                  "is_binary": false,
                  "id": "928871a1-bbdc-425c-ace2-0b302b14a58a",
                  "directory_shortid": null,
                  "code": "import React from 'react';\nimport { render } from 'react-dom';\nimport Hello from './Hello';\n\nconst styles = {\n  fontFamily: 'sans-serif',\n  textAlign: 'center',\n};\n\nconst App = () => (\n  <div style={styles}>\n    <Hello name=\"CodeSandbox\" />\n    <h2>Start editing to see some magic happen {'\\u2728'}</h2>\n  </div>\n);\n\nrender(<App />, document.getElementById('root'));\n"
                }
              ],
              "like_count": 64,
              "id": "new",
              "git": null,
              "forked_from_sandbox": null,
              "fork_count": 0,
              "external_resources": [
                
              ],
              "directories": [
                
              ],
              "description": null,
              "author": null
            }
          }
    };