# COG-UK

> COG-UK

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Create a new release

``` bash
npm run dev
# make changes and commit them
npm run release # this creates a new tag and starts a job on Gotlab CI to build a new image 
```

Wait for pipeline to finish on https://gitlab.com/cgps/cog-uk/cog-uk.io/pipelines, then run
```
ssh root@droplet.metadata.cog-uk.io "/root/metadata.cog-uk.io/update.sh"
```
