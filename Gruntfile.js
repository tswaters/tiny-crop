
module.exports = (grunt) => {

  grunt.initConfig({

    'pkg': grunt.file.readJSON('package.json'),

    'name': '<%= pkg.name.toLowerCase() %>',
    'banner': [
      '/*',
      '<%= pkg.name %> - <%= pkg.description %> v<%= pkg.version%>',
      'built <%= grunt.template.today(\'UTC:yyyy-mm-dd"T"HH:MM:ss.l"Z"\') %>',
      '<%= grunt.file.read("LICENSE") %>',
      '*/'
    ].join('\n'),

    clean: {
      options: {
        force: true
      },
      dist: ['dist'],
      docs: ['docs'],
      coverage: ['test/reports/coverage'],
      analysis: ['test/reports/analysis']
    },

    browserify: {
      options: {
      },
      dist: {
        files: {
          './dist/tiny-crop.js': ['src/index.js']
        },
        options: {
          browserifyOptions: {
            debug: true
          },
          transform: [
            ['babelify', {
              presets: ['es2015']
            }]
          ]
        }
      }
    },

    extract_sourcemap: {
      dist: {
        files: {
          'dist/': 'dist/tiny-crop.js'
        }
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>\n',
        compress: {
          unsafe: true
        },
        sourceMap: true,
        sourceMapIn: 'dist/tiny-crop.js.map'
      },
      dist: {
        options: {
          screwIE8: true
        },
        files: {
          'dist/tiny-crop.min.js': ['./dist/tiny-crop.js']
        }
      },
      compat: {
        files: {
          'dist/tiny-crop.compat.min.js': ['./dist/tiny-crop.compat.js']
        }
      }
    },

    eslint: {
      options: {
        format: require('eslint-html-reporter'),
        outputFile: 'test/reports/analysis/report.html'
      },
      target: [
        'src/**/*.js',
        'test/unit/**/*.js',
        'Gruntfile.js'
      ]
    },

    shell: {
      coverage: {
        command: 'npm run-script coverage'
      },
      test: {
        command: 'npm run-script test'
      }
    },

    jsdoc: {
      dist: {
        src: [
          'README.MD',
          'src/**/*.js'
        ],
        options: {
          destination: 'docs',
          private: false,
          configure: './jsdoc.conf.json',
          template: 'node_modules/ink-docstrap/template'
        }
      }
    },

    gitcheckout: {
      'gh-pages': {
        options: {
          branch: 'gh-pages'
        }
      }
    },

    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/**/*.js'],
        tasks: ['browserify', 'extract_sourcemap', 'uglify:dist']
      }
    }
  })

  grunt.loadNpmTasks('grunt-jsdoc')
  grunt.loadNpmTasks('grunt-eslint')
  grunt.loadNpmTasks('grunt-shell')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-extract-sourcemap')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-babel')

  grunt.registerTask('default', [
    'clean:dist',
    'browserify',
    'extract_sourcemap',
    'uglify:dist'
  ])

  grunt.registerTask('lint', [
    'clean:analysis',
    'eslint'
  ])

  grunt.registerTask('test', [
    'clean:coverage',
    'shell:test',
    'shell:coverage'
  ])

  grunt.registerTask('docs', [
    'clean:docs',
    'jsdoc'
  ])

  grunt.registerTask('dev', [
    'default',
    'watch'
  ])

  grunt.registerTask('publish', [
    'default',
    'test',
    'lint',
    'docs'
  ])

}
