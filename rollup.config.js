import resolve from 'rollup-plugin-node-resolve';


export default {
  // If using any exports from a symlinked project, uncomment the following:
  // preserveSymlinks: true,
        input: ['src/mapbox3d-viewer.js'],
        output: {
                file: 'build/mapbox3d-viewer.js',
                format: 'iife',
                sourcemap: true
        },
        plugins: [
            resolve()
        ]
};
