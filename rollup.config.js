export default {
  input: 'dist/index.js',
  output: {
    file: 'dist/bundles/trumbowyg.umd.js',
    format: 'umd',
    name: 'main'
  },
  sourceMap: false,
  moduleName: 'ng2.lazy.trumbowyg',
  globals: {
    '@angular/core': 'ng.core',
    'rxjs': 'Rx',
    'rxjs/operators': 'Rx.Observable.prototype',
  }
}