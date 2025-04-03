import fs from 'fs';
import path from 'path';
import { loadEnv } from 'vite';
export default function viteEnvConfig(options) {
    let env = {};
    let jsFileName = '';
    const projectRoot = process.cwd();
    return {
        name: 'vite-env-config',
        apply: 'build',
        config(config, { mode }) {
            // 加载环境变量并断言为EnvConfig类型，或者提供默认值
            const loadedEnv = loadEnv(mode, projectRoot, '');
            // 确保每个环境变量都存在
            env = { ...loadedEnv };
            return config;
        },
        buildStart() {
            // 提前创建目录
            const distPath = path.resolve(projectRoot, 'dist');
            if (!fs.existsSync(distPath)) {
                fs.mkdirSync(distPath, { recursive: true });
            }
        },
        closeBundle() {
            const configFilePath = path.resolve(projectRoot, 'dist/config.js');
            const filteredEnv = Object.entries(env)
                .filter(([key]) => options.includes(key))
                .reduce((obj, [key, val]) => {
                obj[key.replace('VITE_', '')] = val;
                return obj;
            }, {});
            fs.writeFileSync(configFilePath, `window.config = ${JSON.stringify(filteredEnv, null, 2)}`, 'utf-8');
        },
        // 获取构建后的 JS 文件名
        generateBundle(options, bundle) {
            for (const [fileName, file] of Object.entries(bundle)) {
                if (file.type === 'chunk' && file.isEntry) {
                    jsFileName = file.fileName; // 获取生成的入口文件名（带 hash）
                }
            }
        },
        // 替换 index.html 中的脚本引用
        transformIndexHtml(html) {
            return html.replace(/<script type="module" crossorigin src="\/assets\/index-[\w\d]+\.js"><\/script>/, `<script src="/config.js"></script>\n    <script type="module" crossorigin src="/${jsFileName}"></script>`);
        },
    };
}
