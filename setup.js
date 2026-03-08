const fs = require('fs');
const path = require('path');
function w(f, c) {
  const d = path.dirname(f);
  if (!fs.existsSync(d)) fs.mkdirSync(d, {recursive: true});
  fs.writeFileSync(f, c);
  console.log('Created: ' + f);
}
w('package.json', JSON.stringify({name:'voicewall',version:'1.0.0',"private":true,scripts:{dev:'next dev',build:'next build',start:'next start'},dependencies:{next:'^16.1.6',react:'^19.2.4','react-dom':'^19.2.4'},devDependencies:{'@types/node':'25.3.5','@types/react':'19.2.14',typescript:'5.9.3'}},null,2));
w('next.config.ts', 'import type { NextConfig } from "next";\nconst nextConfig: NextConfig = {};\nexport default nextConfig;\n');
w('tsconfig.json', JSON.stringify({compilerOptions:{target:'ES2017',lib:['dom','dom.iterable','esnext'],allowJs:true,skipLibCheck:true,strict:true,noEmit:true,esModuleInterop:true,module:'esnext',moduleResolution:'bundler',resolveJsonModule:true,isolatedModules:true,jsx:'react-jsx',incremental:true,plugins:[{name:'next'}],paths:{'@/*':['./src/*']}},include:['next-env.d.ts','**/*.ts','**/*.tsx','.next/types/**/*.ts','.next/dev/types/**/*.ts'],exclude:['node_modules']},null,2));
w('.gitignore', 'node_modules/\n.next/\nout/\n.DS_Store\n*.tsbuildinfo\nnext-env.d.ts\n');
console.log('Done!');
