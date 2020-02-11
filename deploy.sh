#/bin/bash

rollup -c rollup.config.js
rsync -ark * saturnus.geodan.nl:/var/data/html/beta/mapbox3d
