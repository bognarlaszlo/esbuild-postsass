import { OnLoadArgs, OnLoadResult, OnResolveArgs, OnResolveResult, PluginBuild } from 'esbuild';

import { dirname, isAbsolute, resolve } from 'path';
import postcss, {AcceptedPlugin} from 'postcss';
import sass from 'sass';

type PluginOptions = {
    postcssPlugins?: AcceptedPlugin[],
    sassFunctions?: object
}

const NAMESPACE = 'esbuild-postsass';
const CONFIG: PluginOptions = {};

const postSassPlugin = (options?: PluginOptions) => ({
    name: NAMESPACE,
    setup: (build: PluginBuild) => {
        Object.assign(CONFIG, options);

        build.onResolve({filter: /\.(sass|scss)$/}, onResolveHandler)
        build.onLoad({filter: /.*/, namespace: NAMESPACE}, onLoadHandler)
    }
});

const onResolveHandler = async ({resolveDir, path}: OnResolveArgs): Promise<OnResolveResult> => {
    return {
        path: isAbsolute(path) ? path : resolve(resolveDir, path),
        namespace: NAMESPACE
    }
}

const onLoadHandler = async ({path}: OnLoadArgs): Promise<OnLoadResult> => {
    const cache = new Map;

    try {
        let {css, watchFiles} = await transform(path)

        watchFiles = [...watchFiles]
        cache.set(path, watchFiles)

        return {
            contents: css,
            loader: 'css',
            resolveDir: dirname(path),
            watchFiles
        }
    } catch (e) {
        return {
            errors: [{text: e.message}],
            watchFiles: cache.get(path) || [path]
        }
    }
}

const transform = async (file) => {
    let {css, stats: {includedFiles}} = sass.renderSync({file, functions: CONFIG.sassFunctions, sourceMap: './tmp.css.map', sourceMapEmbed: true, sourcesContent: true});

    // No need to run PostCSS if no plugins...
    if (CONFIG.postcssPlugins?.length) {
        const result = await postcss(CONFIG.postcssPlugins).process(css, {from: undefined});
        css = result.css
    }

    return {
        css,
        watchFiles: includedFiles
    }
}

export = postSassPlugin
