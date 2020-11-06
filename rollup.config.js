import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/sfmic.d.ts',
      format: 'esm',
      exports: 'named'
    },
    {
      file: 'dist/sfmic.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/sfmic.js',
      format: 'umd',
      sourcemap: true,
      name: 'sfmic'
    }
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      removeComments: true,
      useTsconfigDeclarationDir: true
    })
  ]
}
