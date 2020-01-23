#/bin/bash

rollup -c rollup.config.js
rsync -ark * saturnus:/var/data/html/beta/mapbox3d
