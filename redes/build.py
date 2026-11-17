"""Arma redes/index.html juntando los archivos de src/. Uso: python3 redes/build.py"""
import os
d = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src')
r = lambda n: open(os.path.join(d, n), encoding='utf-8').read()
out = (r('template.html')
       .replace('/*CSS*/', r('style.css'))
       .replace('/*LIB*/', r('lib.js'))
       .replace('/*CONTENT*/', r('content.js') + '\n' + r('content2.js'))
       .replace('/*APP*/', r('app.js')))
open(os.path.join(os.path.dirname(d), 'index.html'), 'w', encoding='utf-8').write(out)
print('redes/index.html', len(out), 'bytes')
