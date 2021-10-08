# GenSca

Create free circe decoders from json data.

```shell
$ git clone github.com:ptwales/gensca.git
$ cd gensca
$ yarn install
$ ln -s index.js ~/.local/bin/gensca # or somewhere on your path
$ curl https://some-external-json.api/endpoint | gensca | xclip
```
and paste results into your scala code.  You'll still need to sort the decoders
by their dependencies.

## TODO

- [ ] Follow actuall node package guidelines for cli tools
- [ ] Sort derived decoders
- [ ] De-pluralize names with array values
- Provide options for:
  - [ ] Different root class name
  - [ ] Different json libraries
